SELECT
      TT."id" as "Token Id",
      TT."tokenString",
      SUM(CASE WHEN "wasMissed" = TRUE THEN 1 ELSE 0 END)::float / COUNT(STT."id") AS "missRatio",
      U."id" as "User Id"
    FROM
      "TrackedToken" AS TT
        INNER JOIN "SampleTrackedToken" AS STT
        ON(TT."id" = STT."trackedTokenId")
          INNER JOIN "Sample" AS S
          ON(STT."sampleId" = S."id")
            INNER JOIN "User" AS U
            ON(S."userId" = U."id")
    GROUP BY 
      U."id", TT."id", TT."tokenString"
    ORDER BY 
      "missRatio" DESC
      ;
