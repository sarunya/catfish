SELECT id, data, created_date, modified_date
FROM user_info
WHERE (data->>'identity_id' = $1);