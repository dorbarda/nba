import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import StandingsTable from "../components/StandingsTable";
import MatchupCard from "../components/MatchupCard";

export async function getServerSideProps(context) {
  const proto = context.req.headers["x-forwarded-proto"] || "http";
  const host = context.req.headers.host;
  const base = `${proto}://${host}`;

  try {
    const [standingsRes, scoreboardRes] = await Promise.all([
      fetch(`${base}/api/espn/standings`),
      fetch(`${base}/api/espn/scoreboard`),
    ]);

    const standings = standingsRes.ok ? await standingsRes.json() : [];
    const scoreboard = scoreboardRes.ok
      ? await scoreboardRes.json()
      : { currentWeek: 1, totalWeeks: 20, matchups: [] };

    return { props: { standings, scoreboard } };
  } catch {
    return {
      props: {
        standings: [],
        scoreboard: { currentWeek: 1, totalWeeks: 20, matchups: [] },
      },
    };
  }
}

export default function Home({ standings, scoreboard }) {
  const { currentWeek, totalWeeks, matchups } = scoreboard;

  return (
    <div className="min-h-screen bg-navy">
      <Head>
        <title>Shaqtin&apos; A Winner Fantasy League</title>
        <meta name="description" content="Your NBA fantasy league home base" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar currentWeek={currentWeek} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🏀 Shaqtin&apos; A Winner
          </h1>
          <p className="text-gray-400 text-sm">
            ESPN H2H Points League &middot; 10 Teams &middot; 2025–26 Season
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Standings */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Standings</h2>
              <span className="text-xs text-gray-500">
                Week {currentWeek} of {totalWeeks}
              </span>
            </div>
            <StandingsTable standings={standings} />
          </section>

          {/* Current week matchups */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Week {currentWeek} Matchups
              </h2>
              <Link href="/matchups">
                <span className="text-xs text-gold hover:underline cursor-pointer">
                  All weeks →
                </span>
              </Link>
            </div>

            {matchups.length === 0 ? (
              <p className="text-gray-400 text-sm">No matchup data available.</p>
            ) : (
              <div className="space-y-3">
                {matchups.map((m, i) => (
                  <MatchupCard key={i} matchup={m} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
