import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Import auth from your firebase.js file
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>NBA Playoff Predictions</title>
        <meta name="description" content="Predict NBA playoff series outcomes with friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-4">NBA Playoff Predictions</h1>
        <p className="text-xl mb-8">Make predictions for NBA playoff series with your friends!</p>

        <div className="mb-12 relative w-[600px] h-[300px]">
          <div className="bg-gray-200 rounded-lg w-full h-full flex items-center justify-center">
            <p className="text-gray-600">NBA Playoffs Image</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 max-w-lg">
          {user ? (
            <>
              <Link href="/dashboard">
                <a className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium shadow hover:bg-blue-700 transition">
                  Go to Dashboard
                </a>
              </Link>
              <button 
                onClick={() => auth.signOut()} 
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium shadow hover:bg-gray-300 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium shadow hover:bg-blue-700 transition">
                  Log In
                </a>
              </Link>
              <Link href="/login?signup=true">
                <a className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium shadow hover:bg-gray-300 transition">
                  Sign Up
                </a>
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 max-w-xl text-left">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Create an account or log in</li>
            <li>View the current NBA playoff matchups</li>
            <li>Predict the outcome of each series (4-0, 4-1, 4-2, or 4-3)</li>
            <li>Earn points when your predictions are correct</li>
            <li>Compete with friends on the leaderboard</li>
          </ol>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-500">
        <p>© {new Date().getFullYear()} NBA Playoff Predictions</p>
      </footer>
    </div>
  );
}