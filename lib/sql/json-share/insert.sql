INSERT INTO json_share_info (id, actual, expected, actualhash, expectedhash, created_date, modified_date) VALUES ($1, $2, $3, $4, $5, now(), now()) returning id;