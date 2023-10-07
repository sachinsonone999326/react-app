import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'entitiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  endpoints: (builder) => ({
    getEntities: builder.query({
      query: () => 'entities',
    }),
    createEntity: builder.mutation({
      query: (entity) => ({
        url: 'entities',
        method: 'POST',
        body: entity,
      }),
    }),
    updateEntity: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `entities/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteEntity: builder.mutation({
      query: (id) => ({
        url: `entities/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetEntitiesQuery,
  useCreateEntityMutation,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
} = api;

export default api;