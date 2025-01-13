import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ManageQuestionsPage from './pages/ManageQuestionsPage';

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
  const [resultMessage, setResultMessage] = useState<string | null>(null); // 正解・不正解メッセージ
  const [showNextButton, setShowNextButton] = useState(false); // 次の問題ボタンの表示制御

  // API から駅データを取得
  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch(import.meta.env.VITE_API_URI);
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
    setResultMessage(null); // 結果メッセージをリセット
    setShowNextButton(false); // 次の問題ボタンを非表示にする
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
      setResultMessage('正解！');
    } else {
      setResultMessage(`残念！正解は「${currentQuestion.reading}」です。`);
    }

    setShowNextButton(true); // 次の問題ボタンを表示
  };

  // 次の問題に進む
  const handleNextQuestion = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < stations.length) {
      setQuestionIndex(nextIndex);
      setQuestion(stations[nextIndex]);
    } else {
      alert(`クイズ終了！あなたの正解数は ${stations.length} 問中 ${score} 問です。`);
      setScore(0);
      setQuestionIndex(0);
      setQuestion(stations[0]);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">ホーム</Link> | <Link to="/manage-questions">問題管理</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <div>
              <h2>難読駅名クイズ</h2>
              {currentQuestion ? (
                <div>
                  <h1>{currentQuestion.stationName}</h1>
                  <p>所属路線: {currentQuestion.lineName}</p>
                  <p>所在地: {currentQuestion.location}</p>
                  <p>読み方はどれでしょう？</p>
                  <div className="options">
                    {options.map((option, index) => (
                      <button key={index} onClick={() => handleAnswer(option)} disabled={showNextButton}>
                        {option}
                      </button>
                    ))}
                  </div>
                  {resultMessage && <p className="result-message">{resultMessage}</p>}
                  {showNextButton && (
                    <button className="next-button" onClick={handleNextQuestion}>
                      次の問題
                    </button>
                  )}
                </div>
              ) : (
                <p>読み込み中...</p>
              )}
              <p>正解数: {score} / {stations.length}</p>
            </div>
          } />
          <Route path="/manage-questions" element={<ManageQuestionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
