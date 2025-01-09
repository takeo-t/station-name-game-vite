import { useEffect, useState } from 'react';
import './App.css';

type Station = {
  stationId: number;
  stationName: string;
  reading: string;
  lineName: string;
  location: string;
  wrongReadings: string[];
};

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Station | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  // API から駅データを取得
  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch('https://stations-api.takeo-t.workers.dev/stations');
        const data: Station[] = await response.json();
        setStations(data);
        setQuestion(data[0]); // 最初の質問をセット
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      }
    }
    fetchStations();
  }, []);

  // クイズの選択肢をランダムに生成
  const setQuestion = (station: Station) => {
    const shuffledOptions = shuffleArray([station.reading, ...station.wrongReadings]);
    setCurrentQuestion(station);
    setOptions(shuffledOptions);
  };

  // 選択肢をシャッフルする関数
  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // 回答をチェックする
  const handleAnswer = (selected: string) => {
    if (!currentQuestion) return;
    if (selected === currentQuestion.reading) {
      setScore((prevScore) => prevScore + 1);
    }
    const nextIndex = questionIndex + 1;
    if (nextIndex < stations.length) {
      setQuestionIndex(nextIndex);
      setQuestion(stations[nextIndex]);
    } else {
      alert(`クイズ終了！あなたのスコア: ${score + 1} / ${stations.length}`);
      setScore(0);
      setQuestionIndex(0);
      setQuestion(stations[0]);
    }
  };

  return (
    <div className="App">
      <h1>駅名読みクイズ</h1>
      {currentQuestion ? (
        <div>
          <h2>{currentQuestion.stationName}（{currentQuestion.lineName}）</h2>
          <p>所在地: {currentQuestion.location}</p>
          <div className="options">
            {options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
      <p>スコア: {score}</p>
    </div>
  );
}

export default App;