import React, { useEffect, useState, useRef } from 'react';
import { words } from '../../words';
import Timer from '../Timer';
// NUMBER FOR WORDS 4337
// [][]

import { TimerState } from '../Timer'

export interface Result {
  isMatching: boolean
  correctStr: string
  givenStr: string
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

const getWordLine = () => {
  const wordLineList = [];
  const wordScore = 60;
  const give = 6;

  for (let i = 0; i < 20; i++) {
    let wordLine = [];
    let loop = true;
    while (loop) {
      wordLine.push(words[getRandomInt(4336)]);
      let wllen = wordLine.join("").length
      if (wllen < (wordScore + give) && wllen > (wordScore - give)) {
        loop = false;
      } else if (wllen > (wordScore + give)) {
        wordLine.pop();
      }
    }
    wordLineList.push(wordLine);
  }
  return wordLineList;
}

const WordList = ({ setGameState }: { setGameState: any }) => {
  const [wordList, setWordList] = useState<string[][]>([[]]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [result, setResult] = useState<Result[] | undefined>(undefined)
  const [colorMap, setColorMap] = useState<[{ index: number, corr: boolean }] | []>([])
  const [firstMissedCharacterIdx, setFirstMissedCharacterIdx] = useState(-1);
  const [startTimer, setStartTimer] = useState(false);

  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);

  const inputRef = useRef<any>(null);

  useEffect(() => {
    setWordList(getWordLine());
    inputRef.current.focus()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (timerState === 0 && result) {
      setGameState({ running: false, result })
      inputRef.current.blur();
      setWordList(getWordLine());
      setResult(undefined);
      setColorMap([]);
      setCurrentWordIndex(0)
      setInput("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState])



  const handleInput = (e: any) => {
    e.preventDefault();
    setStartTimer(true);
    setGameState({ running: true, result: undefined })
    if (e.target.value.endsWith(" ")) {
      setInput("");
      let newResult: any = [];
      if (result) newResult = result;

      newResult.push({ isMatching: isMatch, correctStr: wordList[0][currentWordIndex], givenStr: input });
      setResult(newResult);
      setIsMatch(false);
      if (wordList[0][currentWordIndex + 1]) {
        const newColorMap: any = colorMap;
        newColorMap.push({ index: currentWordIndex, corr: isMatch });
        setColorMap(newColorMap);
        setCurrentWordIndex(currentWordIndex + 1)
        setFirstMissedCharacterIdx(-1);
      } else {
        setColorMap([]);
        setCurrentWordIndex(0);
        wordList.shift();
        setFirstMissedCharacterIdx(-1);
        console.log(result)
      }
    } else {
      if (e.target.value.length - 1 < firstMissedCharacterIdx) setFirstMissedCharacterIdx(-1);
      const isMatchTmp = wordList[0][currentWordIndex].substring(0, e.target.value.length).includes(e.target.value, 0);
      setInput(e.target.value);
      setIsMatch(isMatchTmp)
      if (!isMatchTmp && firstMissedCharacterIdx === -1) setFirstMissedCharacterIdx(e.target.value.length - 1);
    }
  }
  return (
    <div className='bg-slate-300 p-4 mt-7 w-[100%]'>
      <div className='flex justify-start flex-col'>
        <code className='flex justify-between'>
          {wordList[0]?.map((w, i) =>
            <React.Fragment key={w}>
              <span
                className={
                  currentWordIndex === i ? "bg-slate-400" :
                    colorMap[i] ? colorMap[i]?.corr ? "bg-green-500" : "bg-red-500" : ""
                }>
                {currentWordIndex === i ?
                  w.split("").map((c, $i) =>
                    <span key={`${c}-${$i}`}
                      className={
                        (input.length > $i && isMatch) || (input.length > $i && firstMissedCharacterIdx > $i) ? "font-medium text-cyan-100 underline" :
                          !isMatch && input.length > $i && $i === firstMissedCharacterIdx ? "text-red-500" : ""} >
                      {c}
                    </span>)
                  : w}
              </span>
            </React.Fragment>
          )}
        </code>
        <br />
        <code className='flex justify-between'>
          {wordList[1]?.map(w => <><span>{w}</span></>)}</code>
      </div>
      <div className='mt-4 w-[100%] border flex justify-between'>
        <input ref={inputRef} className='w-[70%] h-8 p-1' type="text" value={input} name="input" id="" onChange={handleInput} />
        <input type="hidden" name="" />
        <Timer startTimerBoolean={startTimer} setTimerState={setTimerState} inputRef={inputRef} />
      </div>
    </div>);
}

export default WordList;