CREATE OR REPLACE FUNCTION get_device_stats()
RETURNS TABLE (
  device_type TEXT,
  count BIGINT
)
LANGUAGE SQL
AS $$
  SELECT device_type::TEXT, COUNT(*)::BIGINT
  FROM ad_analytics
  WHERE device_type IS NOT NULL
  GROUP BY device_type;
$$;