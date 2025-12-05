import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Template } from '@/types';

export function useTemplates() {
  const setTemplates = useStore((state) => state.setTemplates);

  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const data = await apiClient.getTemplates();
      setTemplates(data as Template[]);
      return data as Template[];
    },
  });
}
