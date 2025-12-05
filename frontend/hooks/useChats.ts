import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export function useChatHistory(phoneNumber: string | null) {
  return useQuery({
    queryKey: ['chat', phoneNumber],
    queryFn: () => apiClient.getChatHistory(phoneNumber!),
    enabled: !!phoneNumber,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { phone: string; message: string; template?: any }) =>
      apiClient.sendMessage(data),
    onSuccess: () => {
      toast.success('Message sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}
