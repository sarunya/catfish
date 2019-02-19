CREATE TABLE IF NOT EXISTS json_share_info
(
  id text,
  actual jsonb,
  expected jsonb,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now()
)
WITH (
  OIDS=FALSE
);