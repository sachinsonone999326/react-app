import React, { useState } from 'react';
import { useCreateEntityMutation } from '../api/entities';
import { TextField, Button } from '@material-ui/core';
import './css/createentity.css';

const EntityForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    client_id: '',
    email: '',
    phone_number: '',
    name: '',
    comment: '',
  });

  const [createEntity, { isLoading, isError }] = useCreateEntityMutation({
    onSettled: () => {
      onCancel();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      await createEntity(formData);
      console.log('New entity created:', formData);
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField label="Client ID" name="client_id" value={formData.client_id} onChange={handleChange} required />
      </div>
      <div>
        <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <TextField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
      </div>
      <div>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <TextField label="Comment" name="comment" value={formData.comment} onChange={handleChange} multiline rows={4} maxLength={1000} required />
      </div>
      <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Entity'}
      </Button>
      {isError && <div>Error creating entity</div>}
    </form>
  );
};

export default EntityForm;