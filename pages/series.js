import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Navbar from '../../components/Navbar';

export default function SeriesDetail() {
  const [user, setUser] = useState(null);
  const [series, setSeries] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // In a real app, fetch data from Firestore
        // For now, using sample data
        if (id === '1') {
          setSeries({
            id: 1,
            round: 'First Round',
            team1: 'Boston Celtics',
            team2: 'Miami Heat',
            status: 'upcoming',
            team1Seed: 1,
            team2Seed: 8,
            startDate: 'April 20, 2025',
          });
        } else if (id === '2') {
          setSeries({
            id: 2,
            round: 'First Round',
            team1: 'New York Knicks',
            team2: 'Philadelphia 76ers',
            status: 'in_progress',
            team1Seed: 2,
            team2Seed: 7,
            startDate: 'April 19, 2025',
            games: [
              { game: 1, winner: 'New York Knicks', score: '112-96' },
              { game: 2, winner: 'Philadelphia 76ers', score: '109-104' },
            ]
          });
        } else if (id === '3') {
          setSeries({
            id: 3,
            round: 'First Round',
            team1: 'Milwaukee Bucks',
            team2: 'Indiana Pacers',
            status: 'completed',
            result: '4-2',
            team1Seed: 3,
            team2Seed: 6,
            startDate: 'April 18, 2025',
            games: [
              { game: 1, winner: 'Milwaukee Bucks', score: '116-98' },
              { game: 2, winner: 'Milwaukee Bucks', score: '104-92' },
              { game: 3, winner: 'Indiana Pacers', score: '107-96' },
              { game: 4, winner: 'Milwaukee Bucks', score: '118-111' },
              { game: 5, winner: 'Indiana Pacers', score: '99-95' },
              { game: 6, winner: 'Milwaukee Bucks', score: '122-110' },
            ]
          });
        }

        // Sample user prediction
        setPredictions([
          { 
            id: 'pred1', 
            userId: user?.uid, 
            seriesId: id, 
            prediction: '4-2',
            createdAt: new Date().toISOString()
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div>
        <Navbar user={user} />
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div>
        <Navbar user={user} />
        <div className="container mx-auto p-4">
          <p>Series not found.</p>
          <Link href="/dashboard">
            <a className="text-blue-600 hover:underline">Back to Dashboard</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{series.team1} vs {series.team2} | NBA Playoff Predictions</title>
      </Head>

      <Navbar user={user} />

      <div className="container mx-auto p-4">
        <div className="mb-4">
          <Link href="/dashboard">
            <a className="text-blue-600 hover:underline">&larr; Back to Dashboard</a>
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Series Header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-2xl font-bold">
                  {series.team1} vs {series.team2}
                </h1>
                <p className="text-gray-300 mt-1">
                  {series.round} • {series.team1Seed} Seed vs {series.team2Seed} Seed
                </p>
              </div>

              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  series.status === 'upcoming' ? 'bg-gray-600 text-white' :
                  series.status === 'in_progress' ? 'bg-blue-600 text-white' :
                  'bg-green-600 text-white'
                }`}>
                  {series.status === 'upcoming' ? 'Upcoming' : 
                   series.status === 'in_progress' ? 'In Progress' : 
                   'Completed'}
                </span>

                {series.status === 'completed' && (
                  <span className="ml-3 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {series.result}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Series Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Series Information</h2>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-1/3 font-medium">Start Date:</dt>
                    <dd>{series.startDate}</dd>
                  </div>

                  {series.status === 'completed' && (
                    <div className="flex">
                      <dt className="w-1/3 font-medium">Winner:</dt>
                      <dd className="font-medium">
                        {series.result.startsWith('4') ? series.team1 : series.team2}
                      </dd>
                    </div>
                  )}

                  <div className="flex">
                    <dt className="w-1/3 font-medium">Your Prediction:</dt>
                    <dd>
                      {predictions.length > 0 
                        ? predictions[0].prediction
                        : 'Not predicted yet'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Game Results</h2>
                {series.games ? (
                  <div className="space-y-2">
                    {series.games.map(game => (
                      <div key={game.game} className="flex justify-between border-b pb-2">
                        <span>Game {game.game}</span>
                        <span className="font-medium">{game.winner}</span>
                        <span>{game.score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No games played yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}