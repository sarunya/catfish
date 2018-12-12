SELECT count(*)
FROM user_info where data->>'identity_id'=$1;