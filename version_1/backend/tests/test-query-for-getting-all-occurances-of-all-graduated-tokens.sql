WITH ConsecutiveTrues AS (
    SELECT
        *,
        ROW_NUMBER() OVER (ORDER BY S.dateTimeEnd) - 
        ROW_NUMBER() OVER (PARTITION BY STT.wasMissed ORDER BY S.dateTimeEnd) AS grp
    FROM
        SampleTrackedToken AS STT INNER JOIN Sample AS S 
        ON STT.sampleId = S.id

    WHERE
        STT.wasMissed = TRUE
    ),
end_date AS (
    SELECT
        MAX(your_date_column) AS end_date
    FROM consecutive_true
    WHERE
        (SELECT COUNT(*) FROM consecutive_true WHERE grp = consecutive_true.grp) >= n
    )
SELECT 
    *
FROM 
    SampleTrackedToken AS STT INNER JOIN Sample AS S
WHERE 
    S.dateTimeEnd > (SELECT end_date FROM end_date);