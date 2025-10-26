-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_code TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  current_nav DECIMAL(10, 2) NOT NULL,
  change DECIMAL(10, 2) NOT NULL,
  change_percentage DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scheme_code)
);

-- Enable Row Level Security
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own watchlist" 
ON public.watchlist 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlist items" 
ON public.watchlist 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist items" 
ON public.watchlist 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items" 
ON public.watchlist 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_watchlist_updated_at
BEFORE UPDATE ON public.watchlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();