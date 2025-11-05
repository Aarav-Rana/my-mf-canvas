import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PortfolioHoldingDB {
  id: string;
  user_id: string;
  scheme_code: string;
  scheme_name: string;
  folio_number: string | null;
  units: number;
  current_nav: number;
  invested_amount: number;
  current_value: number;
  returns: number;
  returns_percentage: number;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export const usePortfolioHoldings = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: holdings = [], isLoading } = useQuery({
    queryKey: ["portfolio-holdings", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("portfolio_holdings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PortfolioHoldingDB[];
    },
    enabled: !!userId,
  });

  const importHoldings = useMutation({
    mutationFn: async (importedHoldings: Omit<PortfolioHoldingDB, "id" | "created_at" | "updated_at">[]) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("portfolio_holdings")
        .upsert(
          importedHoldings.map(h => ({
            ...h,
            user_id: userId,
          })),
          {
            onConflict: "user_id,scheme_code,folio_number",
            ignoreDuplicates: false,
          }
        )
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-holdings", userId] });
      toast.success(`Successfully imported ${data.length} mutual fund${data.length !== 1 ? 's' : ''}`);
    },
    onError: (error: any) => {
      console.error("Import error:", error);
      toast.error("Failed to import holdings. Please try again.");
    },
  });

  const deleteHolding = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolio_holdings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-holdings", userId] });
      toast.success("Holding removed");
    },
    onError: () => {
      toast.error("Failed to remove holding");
    },
  });

  return {
    holdings,
    isLoading,
    importHoldings: importHoldings.mutate,
    isImporting: importHoldings.isPending,
    deleteHolding: deleteHolding.mutate,
  };
};
