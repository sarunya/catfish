CREATE TABLE IF NOT EXISTS user_info
(
  id uuid ,
  data jsonb,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now()
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS codeshare_data
(
  id uuid,
  data jsonb,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now()
)
WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS task_data
(
  id uuid,
  identity_id VARCHAR,
  data jsonb,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now()
)
WITH (
  OIDS=FALSE
);