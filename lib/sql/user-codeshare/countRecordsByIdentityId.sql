SELECT count(*)
FROM codeshare_data where data->>'identity_id'=$1;