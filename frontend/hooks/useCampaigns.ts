import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Campaign } from '@/types';

export function useCampaigns() {
  const setCampaigns = useStore((state) => state.setCampaigns);

  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const data = await apiClient.getCampaigns();
      setCampaigns(data as Campaign[]);
      return data as Campaign[];
    },
  });
}

export function useCampaignContacts(campaignName: string | null) {
  return useQuery({
    queryKey: ['campaign-contacts', campaignName],
    queryFn: () => apiClient.getCampaignContacts(campaignName!),
    enabled: !!campaignName,
  });
}

export function useCampaignStatus(campaignName: string | null) {
  return useQuery({
    queryKey: ['campaign-status', campaignName],
    queryFn: () => apiClient.getCampaignStatus(campaignName!),
    enabled: !!campaignName,
  });
}
