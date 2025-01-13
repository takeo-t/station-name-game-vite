import React, { useEffect, useState } from 'react';

type Station = {
  stationId: number;
  stationName: string;
  reading: string;
  lineName: string;
  location: string;
  wrongReadings: string[];
};

const ManageQuestionsPage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch(import.meta.env.VITE_API_URI);
        const data: Station[] = await response.json();
        setStations(data);
      } catch (error) {
        setError('Failed to fetch stations');
      } finally {
        setLoading(false);
      }
    }
    fetchStations();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">問題管理ページ</h1>
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700">駅名</th>
            <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700">読み方</th>
            <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700">路線名</th>
            <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700">所在地</th>
            <th className="py-2 px-4 bg-gray-100 dark:bg-gray-700">間違いの読み方</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station, index) => (
            <tr key={station.stationId} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{station.stationName}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{station.reading}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{station.lineName}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">{station.location}</td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                {station.wrongReadings.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ここに問題を追加・修正するフォームや機能を追加 */}
    </div>
  );
};

export default ManageQuestionsPage;