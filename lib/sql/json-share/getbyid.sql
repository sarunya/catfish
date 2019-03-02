SELECT actual, expected
FROM json_share_info
WHERE (id = $1) and (array_data IS NULL);