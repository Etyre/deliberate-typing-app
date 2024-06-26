WITH "ConsecutiveTrue" AS (
    SELECT
        *,
        ROW_NUMBER() OVER (ORDER BY S."dateTimeEnd") - 
        ROW_NUMBER() OVER (PARTITION BY STT."wasMissed" ORDER BY S."dateTimeEnd") AS grp
    FROM
        "SampleTrackedToken" AS STT INNER JOIN "Sample" AS S 
        ON STT."sampleId" = S."id"

    WHERE
        STT."wasMissed" = TRUE
    ),
"EndDate" AS (
    SELECT
        MAX("dateTimeEnd") AS end_date
    FROM "ConsecutiveTrue"
    WHERE
        (SELECT COUNT(*) FROM "ConsecutiveTrue" WHERE grp = "ConsecutiveTrue".grp) >= 5
    )
SELECT 
    *
FROM 
    "SampleTrackedToken" AS STT INNER JOIN "Sample" AS S
    ON STT."sampleId" = S."id"
WHERE 
    S."dateTimeEnd" > (SELECT end_date FROM "EndDate");