import { fetchFromESPN, parseMatchups, getCurrentWeek } from "../../../lib/espn-api";
import { getCached, setCached } from "../../../lib/firebase-helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // If no week specified, fetch current week first to determine it
  let week = req.query.week ? parseInt(req.query.week, 10) : null;

  const cacheKey = `matchups-week-${week ?? "current"}`;
  const cached = await getCached(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const data = await fetchFromESPN(["mTeam", "mSettings", "mMatchup", "mMatchupScore"]);

    if (!week) {
      week = getCurrentWeek(data);
    }

    const matchups = parseMatchups(data, week);
    const result = { week, matchups };
    await setCached(cacheKey, result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
