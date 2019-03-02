SELECT actual, expected, array_data
FROM json_share_info
WHERE (id = $1) and (array_data IS NOT NULL);