import React, { useState } from 'react';
import {
  useGetEntitiesQuery,
  useDeleteEntityMutation,
  useCreateEntityMutation,
  useUpdateEntityMutation,
} from '../api/entities';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@material-ui/icons';
import EntityUpdateForm from './EntityUpdateForm';
import EntityForm from './EntityForm';
import { useQueryClient } from 'react-query';

const EntityList = () => {
  const { data: entities, isLoading, isError } = useGetEntitiesQuery();
  const [deleteEntity] = useDeleteEntityMutation();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createEntityMutation = useCreateEntityMutation({
    onMutate: (entity) => {
      // Optimistically update the UI with the new entity
      queryClient.setQueryData('entities', (oldData) => {
        if (oldData) {
          return [...oldData, entity];
        }
      });
      return entity;
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update on error
      queryClient.setQueryData('entities', context.prevEntities);
    },
    onSettled: () => {
      // Refetch the entities query after the mutation is complete
      queryClient.invalidateQueries('entities');
    },
  });

  const updateEntityMutation = useUpdateEntityMutation();

  const handleCreate = async (entity) => {
    try {
      await createEntityMutation.mutateAsync(entity);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };

  const handleDelete = async (entity) => {
    try {
      await deleteEntity(entity.client_id); // Use client_id for delete
      queryClient.invalidateQueries('entities');
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  };

  const handleUpdate = (entity) => {
    setSelectedEntity(entity);
    setIsUpdateDialogOpen(true);
  };

  const handleCancelUpdate = () => {
    setSelectedEntity(null);
    setIsUpdateDialogOpen(false);
  };

  const handleCancelCreate = () => {
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSubmit = async (entity) => {
    try {
      await updateEntityMutation.mutateAsync(entity);
      setIsUpdateDialogOpen(false);
      queryClient.invalidateQueries('entities');
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

  const handleCancelUpdateSubmit = () => {
    setIsUpdateDialogOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h2>Entity List</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsCreateDialogOpen(true)}
      >
        Create Entity
      </Button>
      <List>
        {entities.map((entity) => (
          <ListItem key={entity.client_id}>
            <ListItemText
              primary={`${entity.client_id} - ${entity.name}`}
              secondary={`${entity.email} - ${entity.phone_number} - ${entity.comment}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleUpdate(entity)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(entity)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {selectedEntity && (
        <Dialog open={isUpdateDialogOpen} onClose={handleCancelUpdate}>
          <DialogTitle>Update Entity</DialogTitle>
          <DialogContent>
            <EntityUpdateForm entity={selectedEntity} onSubmit={handleUpdateSubmit} onCancel={handleCancelUpdateSubmit} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelUpdateSubmit} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={isCreateDialogOpen} onClose={handleCancelCreate}>
        <DialogTitle>Create Entity</DialogTitle>
        <DialogContent>
          <EntityForm onSubmit={handleCreate} onCancel={handleCancelCreate} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EntityList;
