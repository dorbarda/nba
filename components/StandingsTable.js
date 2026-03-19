export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) {
    return <p className="text-gray-400 text-sm">No standings data available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <th className="py-3 px-4 text-left w-8">#</th>
            <th className="py-3 px-4 text-left">Team</th>
            <th className="py-3 px-4 text-center">W</th>
            <th className="py-3 px-4 text-center">L</th>
            <th className="py-3 px-4 text-center hidden sm:table-cell">PF</th>
            <th className="py-3 px-4 text-center hidden sm:table-cell">PA</th>
            <th className="py-3 px-4 text-center hidden md:table-cell">Streak</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, i) => (
            <tr
              key={team.id}
              className="border-t border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-3 px-4 text-gray-500 text-xs">{i + 1}</td>
              <td className="py-3 px-4">
                <div className="font-medium text-white">{team.name}</div>
                <div className="text-xs text-gray-400">{team.ownerName}</div>
              </td>
              <td className="py-3 px-4 text-center font-semibold text-green-400">
                {team.wins}
              </td>
              <td className="py-3 px-4 text-center font-semibold text-red-400">
                {team.losses}
              </td>
              <td className="py-3 px-4 text-center text-gray-300 hidden sm:table-cell">
                {team.pointsFor?.toFixed(1)}
              </td>
              <td className="py-3 px-4 text-center text-gray-400 hidden sm:table-cell">
                {team.pointsAgainst?.toFixed(1)}
              </td>
              <td className="py-3 px-4 text-center hidden md:table-cell">
                <span
                  className={`text-xs font-medium ${
                    team.streak?.startsWith("W") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {team.streak || "-"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
