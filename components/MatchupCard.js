export default function MatchupCard({ matchup }) {
  const { homeTeam, awayTeam, homeScore, awayScore, winner } = matchup;

  const homeWon = winner === "home";
  const awayWon = winner === "away";
  const isLive = homeScore === 0 && awayScore === 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/30 transition-colors">
      {/* Away team */}
      <div className={`flex items-center justify-between mb-3 ${awayWon ? "opacity-100" : "opacity-70"}`}>
        <div>
          <div className={`font-semibold ${awayWon ? "text-white" : "text-gray-300"}`}>
            {awayTeam.name}
          </div>
          <div className="text-xs text-gray-500">{awayTeam.ownerName}</div>
        </div>
        <div className={`text-xl font-bold tabular-nums ${awayWon ? "text-gold" : "text-gray-300"}`}>
          {isLive ? "–" : awayScore.toFixed(2)}
        </div>
      </div>

      <div className="border-t border-white/10 my-2" />

      {/* Home team */}
      <div className={`flex items-center justify-between mt-3 ${homeWon ? "opacity-100" : "opacity-70"}`}>
        <div>
          <div className={`font-semibold ${homeWon ? "text-white" : "text-gray-300"}`}>
            {homeTeam.name}
          </div>
          <div className="text-xs text-gray-500">{homeTeam.ownerName}</div>
        </div>
        <div className={`text-xl font-bold tabular-nums ${homeWon ? "text-gold" : "text-gray-300"}`}>
          {isLive ? "–" : homeScore.toFixed(2)}
        </div>
      </div>

      {isLive && (
        <div className="mt-3 text-center text-xs text-gray-500">Not started</div>
      )}

      {!isLive && (
        <div className="mt-3 text-center text-xs text-gray-600">
          {winner === "home"
            ? `${homeTeam.name} wins by ${(homeScore - awayScore).toFixed(2)}`
            : winner === "away"
            ? `${awayTeam.name} wins by ${(awayScore - homeScore).toFixed(2)}`
            : "Tie"}
        </div>
      )}
    </div>
  );
}
