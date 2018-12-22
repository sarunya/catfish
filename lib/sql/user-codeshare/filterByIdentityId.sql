SELECT id, data, created_date, modified_date
FROM codeshare_data
WHERE (data->>'identity_id' = $1);