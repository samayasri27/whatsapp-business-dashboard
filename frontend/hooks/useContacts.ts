import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Contact } from '@/types';
import toast from 'react-hot-toast';

export function useContacts() {
  const userId = useStore((state) => state.userId);
  const setContacts = useStore((state) => state.setContacts);

  return useQuery({
    queryKey: ['contacts', userId],
    queryFn: async () => {
      if (!userId) {
        // Use a default user ID if not set
        const defaultUserId = 'default_user';
        const data = await apiClient.getContacts(defaultUserId);
        setContacts(data as Contact[]);
        return data as Contact[];
      }
      const data = await apiClient.getContacts(userId);
      setContacts(data as Contact[]);
      return data as Contact[];
    },
    enabled: true, // Always enabled
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.getTags(),
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: any) => 
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: JSON.stringify(contact),
      }).then(res => res.json()),
    onSuccess: () => {
      toast.success('Contact created successfully!');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => {
      toast.error('Failed to create contact');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        },
      }).then(res => res.json()),
    onSuccess: () => {
      toast.success('Contact deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: () => {
      toast.error('Failed to delete contact');
    },
  });
}
