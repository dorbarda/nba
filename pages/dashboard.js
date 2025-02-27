import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Leaderboard from '../components/Leaderboard';

// Sample data - In a real app, this would come from your database
const sampleSeries = [
  {
    id: 1,
    round: 'First Round',
    team1: 'Boston Celtics',
    team2: 'Miami Heat',
    status: 'upcoming'
  },
  {
    id: 2,
    round: 'First Round',
    team1: 'New York Knicks',
    team2: 'Philadelphia 76ers',
    status: 'in_progress'
  },
  {
    id: 3,
    round: 'First Round',
    team1: 'Milwaukee Bucks',
    team2: 'Indiana Pacers',
    status: 'completed',
    result: '4-2'
  }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState(sampleSeries);
  const [predictions, setPredictions] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [prediction, setPrediction] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Here you would fetch the user's predictions
        // fetchUserPredictions(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => {
    auth.signOut();
    router.push('/');
  };

  const handleSeriesSelect = (series) => {
    if (series.status === 'completed') return;
    setSelectedSeries(series);
  };

  const handlePredictionChange = (e) => {
    setPrediction(e.target.value);
  };

  const handleSubmitPrediction = async () => {
    if (!selectedSeries || !prediction || !user) return;

    // In a real app, you would save this to Firestore
    // Here's how it might look:
    /*
    try {
      const newPrediction = {
        userId: user.uid,
        seriesId: selectedSeries.id,
        prediction: prediction,
        timestamp: Timestamp.now()
      };

      await addDoc(collection(db, "predictions"), newPrediction);

      // Update the local state
      setPredictions([...predictions, newPrediction]);
      setSelectedSeries(null);
      setPrediction('');

    } catch (error) {
      console.error("Error saving prediction:", error);
    }
    */

    // For now, just update the local state
    const newPrediction = {
      id: Date.now(),
      userId: user.uid,
      seriesId: selectedSeries.id,
      prediction,
      timestamp: new Date().toISOString()
    };

    setPredictions([...predictions, newPrediction]);
    setSelectedSeries(null);
    setPrediction('');
  };

  const getUserPrediction = (seriesId) => {
    return predictions.find(
      p => p.seriesId === seriesId && p.userId === user?.uid
    )?.prediction;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Dashboard | NBA Playoff Predictions</title>
      </Head>

      <Navbar user={user} />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Predictions Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Series List */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Playoff Series</h2>

            <div className="space-y-4">
              {series.map(item => (
                <div 
                  key={item.id}
                  className={`border p-4 rounded-lg cursor-pointer hover:border-blue-500 ${
                    selectedSeries?.id === item.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSeriesSelect(item)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.team1} vs {item.team2}</h3>
                      <p className="text-sm text-gray-600">{item.round}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'upcoming' ? 'bg-gray-200' :
                        item.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {item.status === 'upcoming' ? 'Upcoming' : 
                         item.status === 'in_progress' ? 'In Progress' : 
                         'Completed'}
                      </span>

                      {item.status === 'completed' && (
                        <p className="mt-1">Result: {item.result}</p>
                      )}

                      {getUserPrediction(item.id) && (
                        <p className="mt-1 text-sm">
                          Your prediction: {getUserPrediction(item.id)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Prediction Form & Leaderboard */}
          <div className="space-y-6">
            {/* Prediction Form */}
            {selectedSeries ? (
              <div className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">
                  Make Your Prediction
                </h2>
                <p className="mb-3">
                  {selectedSeries.team1} vs {selectedSeries.team2}
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Series Outcome:
                  </label>
                  <select
                    value={prediction}
                    onChange={handlePredictionChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select outcome...</option>
                    <option value="4-0">{selectedSeries.team1} wins 4-0</option>
                    <option value="4-1">{selectedSeries.team1} wins 4-1</option>
                    <option value="4-2">{selectedSeries.team1} wins 4-2</option>
                    <option value="4-3">{selectedSeries.team1} wins 4-3</option>
                    <option value="0-4">{selectedSeries.team2} wins 4-0</option>
                    <option value="1-4">{selectedSeries.team2} wins 4-1</option>
                    <option value="2-4">{selectedSeries.team2} wins 4-2</option>
                    <option value="3-4">{selectedSeries.team2} wins 4-3</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmitPrediction}
                  disabled={!prediction}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Submit Prediction
                </button>
              </div>
            ) : (
              <div className="border p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Make a Prediction</h2>
                <p className="text-gray-600">
                  Select a series from the list to make your prediction.
                </p>
              </div>
            )}

            {/* User Stats */}
            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Your Stats</h2>
              <div className="space-y-2">
                <p>Total Predictions: {predictions.length}</p>
                <p>Points Earned: 0</p>
                <p>Rank: --</p>
              </div>
            </div>

            {/* Leaderboard */}
            <Leaderboard currentUserId={user?.uid} />
          </div>
        </div>
      </div>
    </div>
  );
}