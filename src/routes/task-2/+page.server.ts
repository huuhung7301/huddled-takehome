export const load: PageServerLoad = async ({ locals }) => {
  const db = locals.db;

  // Query to list all artists
  const artistsQuery = `
    SELECT id, name FROM artists
  `;
  const artists = await db.prepare(artistsQuery).all();

  // Query to get the total positive engagement for each artist during each hour of the day and day of the week
  const engagementQuery = `
    SELECT
      ue.artist_id,
      CAST(strftime('%H', datetime(ue.created_at / 1000, 'unixepoch')) AS INTEGER) AS hour,
      CAST(strftime('%w', datetime(ue.created_at / 1000, 'unixepoch')) AS INTEGER) AS day_of_week,
      SUM(CASE 
        WHEN ue.event_type = 'like_track' THEN 2
        WHEN ue.event_type = 'add_track_to_playlist' THEN 2
        WHEN ue.event_type = 'play_track' THEN 1
        WHEN ue.event_type = 'share_track' THEN 3
        ELSE 0
      END) AS total_engagement
    FROM
      user_events ue
    GROUP BY
      ue.artist_id, hour, day_of_week
    ORDER BY
      ue.artist_id, day_of_week, hour
  `;
  const engagement = await db.prepare(engagementQuery).all();

  return {
    artists,
    engagement,
  };
};