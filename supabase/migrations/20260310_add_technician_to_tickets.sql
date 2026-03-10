-- Add technician_id to tickets
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_tickets_technician_id ON public.tickets(technician_id);
