import { createSlice } from '@reduxjs/toolkit';
import { useGetEntitiesQuery, useCreateEntityMutation, useUpdateEntityMutation, useDeleteEntityMutation } from '../../api/entities';

const entitiesSlice = createSlice({
  name: 'entities',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(useGetEntitiesQuery.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(useCreateEntityMutation.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(useUpdateEntityMutation.fulfilled, (state, action) => {
        const updatedEntity = action.payload;
        const index = state.findIndex((entity) => entity.id === updatedEntity.id);
        if (index !== -1) {
          state[index] = updatedEntity;
        }
      })
      .addCase(useDeleteEntityMutation.fulfilled, (state, action) => {
        const id = action.meta.arg;
        return state.filter((entity) => entity.id !== id);
      });
  },
});
export default entitiesSlice.reducer;