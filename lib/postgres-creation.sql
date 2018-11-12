
CREATE DATABASE catfish;

CREATE TABLE IF NOT EXISTS userinfo
(
  email text,
  data jsonb,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now(),
  CONSTRAINT email_pkey PRIMARY KEY (email)
  
)
WITH (
  OIDS=FALSE
);

ALTER TABLE userinfo
  OWNER TO ecomdba;

CREATE INDEX IF NOT EXISTS email_and_is_active_idx
  ON userinfo
  USING btree
 ((email), (data->>'is_active_acount'));


/*  COUPONUSAGES  */

CREATE TABLE IF NOT EXISTS taskinfo
(
  id text,
  data jsonb,
  created_date timestamp with time zone DEFAULT now(),
  modified_date timestamp with time zone DEFAULT now(),
  CONSTRAINT taskinfo_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE taskinfo
  OWNER TO ecomdba;

CREATE INDEX IF NOT EXISTS all_taskinfo_email_active
  ON taskinfo
  USING btree
 ((data->>'email'), (data->>'is_active'));


CREATE INDEX IF NOT EXISTS status_taskinfo_email_active
  ON taskinfo
  USING btree
 ((data->>'email'), (data->>'is_active'), (data->>'completion_status'));

CREATE INDEX IF NOT EXISTS scheduleddate_taskinfo_email_active
  ON taskinfo
  USING btree
 ((data->>'email'), (data->>'is_active'), (data->>'scheduled_date'));

CREATE INDEX IF NOT EXISTS categories_taskinfo_email_active
  ON taskinfo
  USING btree
 ((data->>'email'), (data->>'is_active'), (data->>'categories'));