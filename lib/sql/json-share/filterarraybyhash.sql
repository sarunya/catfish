SELECT id
FROM json_share_info
WHERE (actualhash=$1 and expectedhash=$2 and array_data IS NOT NULL);