import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT 
        age_bracket as ageBracket,
        SUM(CASE
            WHEN sex = 'Male' THEN 1
            ELSE 0
        END) AS maleCount,
        SUM(CASE
            WHEN sex = 'Female' THEN 1
            ELSE 0
        END) AS femaleCount
        FROM
        (SELECT 
            CASE
                    WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 20 AND 29 THEN '20-29'
                    WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 30 AND 39 THEN '30-39'
                    WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 40 AND 49 THEN '40-49'
                    WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 50 AND 59 THEN '50-59'
                    WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) >= 60 THEN '60-up'
                END AS age_bracket,
                sex
    FROM
        employees) AS age_gender
    GROUP BY age_bracket
    ORDER BY age_bracket ASC;`,
})
export class AgeBracketView {
  @ViewColumn()
  ageBracket: string;

  @ViewColumn()
  maleCount: number;

  @ViewColumn()
  femaleCount: number;
}
