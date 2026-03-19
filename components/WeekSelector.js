import { useRouter } from "next/router";

export default function WeekSelector({ currentWeek, totalWeeks, basePath = "/matchups" }) {
  const router = useRouter();

  const prev = currentWeek > 1 ? currentWeek - 1 : null;
  const next = currentWeek < totalWeeks ? currentWeek + 1 : null;

  const navigate = (week) => {
    router.push(`${basePath}/${week}`);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => prev && navigate(prev)}
        disabled={!prev}
        className="px-3 py-1.5 rounded-lg border border-white/20 text-sm text-gray-300 hover:border-gold/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      <span className="text-white font-semibold text-sm min-w-[80px] text-center">
        Week {currentWeek}
      </span>

      <button
        onClick={() => next && navigate(next)}
        disabled={!next}
        className="px-3 py-1.5 rounded-lg border border-white/20 text-sm text-gray-300 hover:border-gold/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
