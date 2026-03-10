-- Add solution field to tickets
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS solution TEXT;
