import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WatchlistItem {
  id: string;
  scheme_code: string;
  scheme_name: string;
  current_nav: number;
  change: number;
  change_percentage: number;
  category: string;
}

export const useWatchlist = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WatchlistItem[];
    },
    enabled: !!userId,
  });

  const addToWatchlist = useMutation({
    mutationFn: async (item: Omit<WatchlistItem, "id">) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("watchlist")
        .insert({
          user_id: userId,
          scheme_code: item.scheme_code,
          scheme_name: item.scheme_name,
          current_nav: item.current_nav,
          change: item.change,
          change_percentage: item.change_percentage,
          category: item.category,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      toast.success("Fund added to watchlist");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("This fund is already in your watchlist");
      } else {
        toast.error("Failed to add fund to watchlist");
      }
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      toast.success("Fund removed from watchlist");
    },
    onError: () => {
      toast.error("Failed to remove fund from watchlist");
    },
  });

  return {
    watchlist,
    isLoading,
    addToWatchlist: addToWatchlist.mutate,
    removeFromWatchlist: removeFromWatchlist.mutate,
  };
};
