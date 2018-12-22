SELECT id, data, created_date, modified_date
FROM codeshare_data
WHERE (data->>'firebase_id' = $1);