-- Create portfolio_holdings table for storing imported mutual fund data
CREATE TABLE public.portfolio_holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scheme_code TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  folio_number TEXT,
  units NUMERIC NOT NULL CHECK (units > 0),
  current_nav NUMERIC NOT NULL CHECK (current_nav > 0),
  invested_amount NUMERIC NOT NULL CHECK (invested_amount > 0),
  current_value NUMERIC NOT NULL DEFAULT 0,
  returns NUMERIC NOT NULL DEFAULT 0,
  returns_percentage NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own holdings"
ON public.portfolio_holdings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own holdings"
ON public.portfolio_holdings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
ON public.portfolio_holdings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
ON public.portfolio_holdings
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_portfolio_holdings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_holdings_updated_at
BEFORE UPDATE ON public.portfolio_holdings
FOR EACH ROW
EXECUTE FUNCTION public.update_portfolio_holdings_updated_at();

-- Create unique constraint to prevent duplicate holdings (same user, scheme, folio)
CREATE UNIQUE INDEX idx_portfolio_holdings_unique 
ON public.portfolio_holdings(user_id, scheme_code, COALESCE(folio_number, 'NO_FOLIO'));