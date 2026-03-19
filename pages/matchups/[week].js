import Head from "next/head";
import Navbar from "../../components/Navbar";
import MatchupCard from "../../components/MatchupCard";
import WeekSelector from "../../components/WeekSelector";

export async function getServerSideProps(context) {
  const proto = context.req.headers["x-forwarded-proto"] || "http";
  const host = context.req.headers.host;
  const base = `${proto}://${host}`;
  const week = parseInt(context.params.week, 10);

  if (isNaN(week) || week < 1) {
    return { redirect: { destination: "/matchups", permanent: false } };
  }

  try {
    const [matchupsRes, leagueRes] = await Promise.all([
      fetch(`${base}/api/espn/matchups?week=${week}`),
      fetch(`${base}/api/espn/league`),
    ]);

    const matchupsData = matchupsRes.ok
      ? await matchupsRes.json()
      : { week, matchups: [] };
    const leagueData = leagueRes.ok
      ? await leagueRes.json()
      : { currentWeek: week, totalWeeks: 20 };

    return {
      props: {
        week: matchupsData.week || week,
        matchups: matchupsData.matchups || [],
        currentWeek: leagueData.currentWeek,
        totalWeeks: leagueData.totalWeeks,
      },
    };
  } catch {
    return {
      props: { week, matchups: [], currentWeek: week, totalWeeks: 20 },
    };
  }
}

export default function WeekMatchups({ week, matchups, currentWeek, totalWeeks }) {
  return (
    <div className="min-h-screen bg-navy">
      <Head>
        <title>Week {week} Matchups · Shaqtin&apos; A Winner</title>
      </Head>

      <Navbar currentWeek={currentWeek} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            Week {week} Matchups
            {week === currentWeek && (
              <span className="ml-3 text-xs font-normal bg-gold/20 text-gold border border-gold/40 px-2 py-0.5 rounded-full align-middle">
                Live
              </span>
            )}
          </h1>
          <WeekSelector
            currentWeek={week}
            totalWeeks={totalWeeks}
            basePath="/matchups"
          />
        </div>

        {matchups.length === 0 ? (
          <p className="text-gray-400">No matchup data available for week {week}.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchups.map((m, i) => (
              <MatchupCard key={i} matchup={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
