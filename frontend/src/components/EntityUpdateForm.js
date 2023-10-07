import React, { useState, useEffect } from 'react';
import { useUpdateEntityMutation } from '../api/entities';
import { TextField, Button } from '@material-ui/core';
import { useQueryClient } from 'react-query';

const EntityUpdateForm = ({ entity, entityId, onCancel }) => {
  const [formData, setFormData] = useState({
    client_id: entityId || '',
    email: entity?.email || '',
    phone_number: entity?.phone_number || '',
    name: entity?.name || '',
    comment: entity?.comment || '',
  });

  const [updateEntity, { isLoading }] = useUpdateEntityMutation();
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData({
      client_id: entityId || '',
      email: entity?.email || '',
      phone_number: entity?.phone_number || '',
      name: entity?.name || '',
      comment: entity?.comment || '',
    });
  }, [entity, entityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEntity({ id: entity.client_id, ...formData });
    queryClient.invalidateQueries('entities');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Client ID"
        name="client_id"
        value={formData.client_id}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
        disabled={!!entityId}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone Number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Comment"
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
        multiline
        rows={4}
        inputProps={{ maxLength: 1000 }}
      />
      <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
        Update Entity
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </form>
  );
};

export default EntityUpdateForm;