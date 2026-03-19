const LEAGUE_ID = process.env.NEXT_PUBLIC_ESPN_LEAGUE_ID;
const SEASON = process.env.NEXT_PUBLIC_ESPN_SEASON_YEAR;

const BASE_URL = `https://fantasy.espn.com/apis/v3/games/fba/seasons/${SEASON}/segments/0/leagues/${LEAGUE_ID}`;

/**
 * Fetch data from ESPN's unofficial fantasy basketball API.
 * @param {string[]} views - ESPN view params (e.g. ['mTeam', 'mStandings'])
 * @returns {Promise<object>} raw ESPN API response
 */
export async function fetchFromESPN(views = []) {
  const params = views.map((v) => `view=${v}`).join("&");
  const url = `${BASE_URL}?${params}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Parse teams from ESPN league data into a normalized array.
 * Returns: [{ id, name, abbrev, owners, logoUrl }]
 */
export function parseTeams(data) {
  const members = data.members || [];
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  return (data.teams || []).map((t) => {
    const ownerIds = t.owners || [];
    const ownerNames = ownerIds
      .map((id) => {
        const m = memberMap[id];
        return m ? `${m.firstName} ${m.lastName}`.trim() : "Unknown";
      })
      .join(" & ");

    return {
      id: t.id,
      name: `${t.location || ""} ${t.nickname || ""}`.trim(),
      abbrev: t.abbrev || "",
      ownerName: ownerNames,
      logoUrl: t.logo || null,
    };
  });
}

/**
 * Parse current standings from ESPN league data.
 * Returns sorted array with W/L/PF/PA/streak per team.
 */
export function parseStandings(data) {
  const teams = parseTeams(data);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (data.teams || [])
    .map((t) => {
      const record = t.record?.overall || {};
      return {
        ...teamMap[t.id],
        wins: record.wins ?? 0,
        losses: record.losses ?? 0,
        ties: record.ties ?? 0,
        pointsFor: record.pointsFor ?? 0,
        pointsAgainst: record.pointsAgainst ?? 0,
        streak: t.record?.overall?.streak?.length
          ? `${t.record.overall.streak.type === "WIN" ? "W" : "L"}${t.record.overall.streak.length}`
          : "-",
      };
    })
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.pointsFor - a.pointsFor;
    });
}

/**
 * Parse matchups for a given scoring period from ESPN data.
 * Returns array of { homeTeamId, awayTeamId, homeScore, awayScore, homeTeam, awayTeam, winner }
 */
export function parseMatchups(data, week) {
  const teams = parseTeams(data);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  const schedule = data.schedule || [];
  const weekMatchups = schedule.filter((m) => m.matchupPeriodId === week);

  return weekMatchups.map((m) => {
    const home = m.home || {};
    const away = m.away || {};
    const homeScore = home.totalPoints ?? 0;
    const awayScore = away.totalPoints ?? 0;

    return {
      homeTeamId: home.teamId,
      awayTeamId: away.teamId,
      homeTeam: teamMap[home.teamId] || { name: "TBD" },
      awayTeam: teamMap[away.teamId] || { name: "TBD" },
      homeScore,
      awayScore,
      winner:
        homeScore > awayScore
          ? "home"
          : awayScore > homeScore
          ? "away"
          : "tie",
    };
  });
}

/**
 * Get current scoring period (week) from league settings.
 */
export function getCurrentWeek(data) {
  return data.status?.currentMatchupPeriod || 1;
}

/**
 * Get total number of regular season weeks from league settings.
 */
export function getTotalWeeks(data) {
  return data.status?.finalMatchupPeriod || 20;
}
