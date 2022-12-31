DELETE FROM dups a USING (
    SELECT MIN(ctid) as ctid, key
      FROM dups 
      GROUP BY key HAVING COUNT(*) > 1
    ) b
    WHERE a.key = b.key 
    AND a.ctid <> b.ctid