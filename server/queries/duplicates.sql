DELETE FROM dups a USING (
    SELECT MIN(ctid) as ctid, key
      FROM dups 
      GROUP BY key HAVING COUNT(*) > 1
    ) b
    WHERE a.key = b.key 
    AND a.ctid <> b.ctid


select * from (
  SELECT id,
  ROW_NUMBER() OVER(PARTITION BY time ORDER BY id asc) AS Row
  FROM tbl
) dups
where dups.Row > 1


DELETE FROM Photos
WHERE id IN (
select id from (
  SELECT id,
  ROW_NUMBER() OVER(PARTITION BY merchant_Id, url ORDER BY id asc) AS Row
  FROM Photos
) dups
where 
dups.Row > 1);