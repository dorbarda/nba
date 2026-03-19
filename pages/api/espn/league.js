import { fetchFromESPN, parseTeams, getCurrentWeek, getTotalWeeks } from "../../../lib/espn-api";
import { getCached, setCached } from "../../../lib/firebase-helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const cacheKey = "league-info";
  const cached = await getCached(cacheKey);
  if (cached) return res.status(200).json(cached);

  try {
    const data = await fetchFromESPN(["mTeam", "mSettings"]);
    const result = {
      teams: parseTeams(data),
      currentWeek: getCurrentWeek(data),
      totalWeeks: getTotalWeeks(data),
      seasonId: data.seasonId,
    };
    await setCached(cacheKey, result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
