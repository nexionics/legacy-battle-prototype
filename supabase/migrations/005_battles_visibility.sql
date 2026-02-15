DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'battles'
      AND column_name = 'visibility'
  ) THEN
    ALTER TABLE public.battles
      ADD COLUMN visibility text NOT NULL DEFAULT 'public'
      CHECK (visibility IN ('private', 'public', 'crew'));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_battles_visibility ON public.battles(visibility);
