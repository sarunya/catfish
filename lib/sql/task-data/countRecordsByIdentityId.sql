SELECT count(*)
FROM task_data where data->>'identity_id'=$1;