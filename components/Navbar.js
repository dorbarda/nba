import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar({ currentWeek }) {
  const router = useRouter();

  const links = [
    { href: "/", label: "Home" },
    { href: "/matchups", label: "Matchups" },
  ];

  return (
    <nav className="bg-navy border-b border-gold/20 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <span className="text-gold font-bold text-lg tracking-tight cursor-pointer">
            🏀 Shaqtin&apos; A Winner
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link key={href} href={href}>
              <span
                className={`text-sm font-medium cursor-pointer transition-colors ${
                  router.pathname === href || router.pathname.startsWith(href + "/")
                    ? "text-gold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
              </span>
            </Link>
          ))}

          {currentWeek && (
            <span className="text-xs bg-gold/20 text-gold border border-gold/40 px-2 py-1 rounded-full font-medium">
              Week {currentWeek}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
