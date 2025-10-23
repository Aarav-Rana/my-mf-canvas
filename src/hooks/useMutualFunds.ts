import { useQuery } from "@tanstack/react-query";
import { MutualFund, MutualFundDetails } from "@/types/mutualfund";

const MFAPI_BASE_URL = "https://api.mfapi.in";

export const useMutualFundsList = () => {
  return useQuery<MutualFund[]>({
    queryKey: ["mutualFundsList"],
    queryFn: async () => {
      const response = await fetch(`${MFAPI_BASE_URL}/mf`);
      if (!response.ok) throw new Error("Failed to fetch mutual funds list");
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useMutualFundDetails = (schemeCode: string) => {
  return useQuery<MutualFundDetails>({
    queryKey: ["mutualFundDetails", schemeCode],
    queryFn: async () => {
      const response = await fetch(`${MFAPI_BASE_URL}/mf/${schemeCode}`);
      if (!response.ok) throw new Error("Failed to fetch mutual fund details");
      return response.json();
    },
    enabled: !!schemeCode,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes for real-time data
  });
};

export const useMultipleFundDetails = (schemeCodes: string[]) => {
  return useQuery({
    queryKey: ["multipleFundDetails", schemeCodes],
    queryFn: async () => {
      const promises = schemeCodes.map(code =>
        fetch(`${MFAPI_BASE_URL}/mf/${code}`).then(res => res.json())
      );
      return Promise.all(promises);
    },
    enabled: schemeCodes.length > 0,
    refetchInterval: 1000 * 60 * 5,
  });
};
