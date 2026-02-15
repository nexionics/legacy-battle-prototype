CREATE TABLE IF NOT EXISTS public.crew_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_crew_requests_sender ON public.crew_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_crew_requests_receiver ON public.crew_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_crew_requests_status ON public.crew_requests(status);

ALTER TABLE public.crew_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own crew requests"
ON public.crew_requests
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send crew requests"
ON public.crew_requests
FOR INSERT
WITH CHECK (auth.uid() = sender_id AND sender_id != receiver_id);

CREATE POLICY "Users can update received crew requests"
ON public.crew_requests
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

CREATE POLICY "Users can delete own sent requests"
ON public.crew_requests
FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
