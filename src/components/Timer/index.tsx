import React, { useEffect, useState } from 'react';

export enum TimerState {
  STOPPED,
  RUNNING
}

const defaultTime = 60;

const Timer = ({ startTimerBoolean, setTimerState, inputRef }: { startTimerBoolean: boolean, setTimerState: any, inputRef: any }) => {
  const [state, setState] = useState(TimerState.STOPPED);
  const [time, setTime] = useState(defaultTime);
  const [timerIndex, setTimerIndex] = useState(0);

  useEffect(() => {
    if (startTimerBoolean) startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTimerBoolean])


  const startTimer = () => {
    let t = time;
    var index = setInterval(() => {
      if (t === 0) {
        clearInterval(index);
        stopTimer(); // this doesn't clear the interval for some unknown reason..
      } else {
        t--;
        setTime(t);
      }
    }, 1000)
    setTimerIndex(Number(index));
    setState(TimerState.RUNNING);
    setTimerState(TimerState.RUNNING)
    inputRef.current.focus();
  }

  const stopTimer = () => {
    clearInterval(timerIndex);
    setTime(defaultTime);
    setState(TimerState.STOPPED);
    setTimerState(TimerState.STOPPED)
  }



  return (<div className='flex'>
    {state === TimerState.STOPPED ?
      (<div className='text-white text-center w-16 h-8 bg-slate-500 cursor-pointer p-0 text-lg' onClick={startTimer}> START </div>) :
      (<div className='text-white text-center w-16 h-8 bg-slate-500 cursor-pointer text-lg' onClick={stopTimer}> STOP </div>)}
    <div className='text-center ml-2 w-12 h-8 bg-slate-500 text-white text-lg' >{time === 60 ? '1:00' : time < 10 ? `0:0${time}` : `0:${time}`}</div>
  </div>);
}

export default Timer;