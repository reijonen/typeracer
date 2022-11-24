import React, { useState } from 'react';
import './App.css';
import WordList from './components/WordList';
import { Result } from './components/WordList';

interface Stats {
  totalWords: number;
  correctWords: number;
  badWords: number;
  accuracy: number;
  wpm: number;
  averagedWpm: number;
}

const caluclteStats = (result: Result[]) => {
  const stats: Stats = {
    totalWords: result.length,
    correctWords: result.filter(w => w.isMatching).length,
    badWords: result.filter(w => !w.isMatching).length,
    accuracy: Number((result.filter(w => w.isMatching).length / result.length * 100).toFixed(2)),
    wpm: result.length,
    averagedWpm: result.map(w => w.givenStr).join("").length / 6
  }
  return (
    <>
      <p>Total Words: {stats.totalWords}</p>
      <p>Correct words: {stats.correctWords}</p>
      <p>Typoed words: {stats.badWords}</p>
      <p>Accuracy: {stats.accuracy} %</p>
      <p>WPM: {stats.wpm}</p>
      <p>Average WPM (6c/per word): {stats.averagedWpm}</p>
    </>
  )
}

const App = () => {
  const [gameState, setGameState] = useState<{ running: boolean, result: Result[] | undefined }>({
    running: false,
    result: undefined,
  })

  return (
    <div className="w-[100%] h-[100%] flex justify-center">
      <div className="w-[40%] h-[100%] flex justify-center flex-col">
        <WordList setGameState={setGameState} />
        {!gameState.running && gameState.result && (<div className='w-[100%] mt-5 bg-slate-300 p-4'>
          <h1 className='font-bold'> JUDGEMENT TIME!</h1>

          {caluclteStats(gameState.result)}
        </div>)}
      </div>
    </div>
  );
}

export default App;
