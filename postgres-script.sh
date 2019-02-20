CREATE TABLE IF NOT EXISTS json_share_info
(
  id text,
  actual jsonb,
  expected jsonb,
  actualhash text,
  expectedhash text,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now()
)
WITH (
  OIDS=FALSE
);

CREATE UNIQUE INDEX hash_index ON  json_share_info (actualhash, expectedhash);