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

  const handleInputChange = (index: number, field: string, value: string) => {
    const newStations = [...stations];
    if (field === 'wrongReadings') {
      newStations[index].wrongReadings = value.split(',').map((item) => item.trim());
    } else {
      newStations[index] = { ...newStations[index], [field]: value };
    }
    setStations(newStations);
  };

  const handleWrongReadingChange = (stationIndex: number, readingIndex: number, value: string) => {
    const newStations = [...stations];
    newStations[stationIndex].wrongReadings[readingIndex] = value;
    setStations(newStations);
  }

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">問題管理ページ</h1>
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border-collapse">
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
          {stations.map((station, stationIndex) => (
            <tr
              key={station.stationId}
              className={stationIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
            >
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={station.stationName}
                  onChange={(e) => handleInputChange(stationIndex, 'stationName', e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={station.reading}
                  onChange={(e) => handleInputChange(stationIndex, 'reading', e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={station.lineName}
                  onChange={(e) => handleInputChange(stationIndex, 'lineName', e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={station.location}
                  onChange={(e) => handleInputChange(stationIndex, 'location', e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
                />
              </td>
              <td className="py-2 px-4">
                <div className="flex gap-2">
                  {station.wrongReadings.map((reading, readingIndex) => (
                    <input
                      key={readingIndex}
                      type="text"
                      value={reading}
                      onChange={(e) =>
                        handleWrongReadingChange(stationIndex, readingIndex, e.target.value)
                      }
                      className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0"
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuestionsPage;