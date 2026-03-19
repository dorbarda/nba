import { fetchFromESPN, parseMatchups, getCurrentWeek, getTotalWeeks } from "../../../lib/espn-api";
import { getCached, setCached } from "../../../lib/firebase-helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const cacheKey = "scoreboard-current";
  const cached = await getCached(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const data = await fetchFromESPN(["mTeam", "mScoreboard", "mMatchupScore"]);
    const currentWeek = getCurrentWeek(data);
    const totalWeeks = getTotalWeeks(data);
    const matchups = parseMatchups(data, currentWeek);

    const result = { currentWeek, totalWeeks, matchups };
    await setCached(cacheKey, result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
