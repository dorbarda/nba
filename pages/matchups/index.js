import Head from "next/head";
import Navbar from "../../components/Navbar";
import MatchupCard from "../../components/MatchupCard";
import WeekSelector from "../../components/WeekSelector";

export async function getServerSideProps(context) {
  const proto = context.req.headers["x-forwarded-proto"] || "http";
  const host = context.req.headers.host;
  const base = `${proto}://${host}`;

  try {
    const res = await fetch(`${base}/api/espn/scoreboard`);
    const data = res.ok
      ? await res.json()
      : { currentWeek: 1, totalWeeks: 20, matchups: [] };
    return { props: data };
  } catch {
    return { props: { currentWeek: 1, totalWeeks: 20, matchups: [] } };
  }
}

export default function MatchupsIndex({ currentWeek, totalWeeks, matchups }) {
  return (
    <div className="min-h-screen bg-navy">
      <Head>
        <title>Week {currentWeek} Matchups · Shaqtin&apos; A Winner</title>
      </Head>

      <Navbar currentWeek={currentWeek} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Matchups</h1>
          <WeekSelector
            currentWeek={currentWeek}
            totalWeeks={totalWeeks}
            basePath="/matchups"
          />
        </div>

        {matchups.length === 0 ? (
          <p className="text-gray-400">No matchup data available for this week.</p>
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
