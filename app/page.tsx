"use client";

import React, { useState, useEffect } from "react";

type Mode = "current-time" | "timer" | "countdown";

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

const TimerApp: React.FC = () => {
  const [mode, setMode] = useState<Mode>("current-time");
  const [time, setTime] = useState<Date>(new Date());
  const [timerValue, setTimerValue] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [countdownTime, setCountdownTime] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countdownActive, setCountdownActive] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (mode === "current-time" && isMounted) {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [mode, isMounted]);

  useEffect(() => {
    if (mode === "countdown" && countdownActive && remainingTime > 0) {
      const interval = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (remainingTime === 0 && countdownActive) {
      setCountdownActive(false);
      alert("Countdown finished!");
    }
  }, [mode, countdownActive, remainingTime]);

  useEffect(() => {
    if (mode === "timer" && timerActive && timerValue >= 0) {
      const interval = setInterval(() => setTimerValue((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [mode, timerActive, timerValue]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCountdownStart = () => {
    const totalSeconds =
      countdownTime.hours * 3600 +
      countdownTime.minutes * 60 +
      countdownTime.seconds;
    setRemainingTime(totalSeconds);
    setCountdownActive(true);
  };

  const toggleFullscreen = () => {
    const elem: HTMLElement = document.documentElement;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ("webkitRequestFullscreen" in elem) {
        (elem as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ("msRequestFullscreen" in elem) {
        (elem as HTMLElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ("webkitExitFullscreen" in document) {
        (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ("msExitFullscreen" in document) {
        (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
    }
  };

  if (!isMounted) {
    return <div className="h-screen w-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center">
      {!isFullscreen && (
        <div className="mb-4">
          <label htmlFor="mode" className="mr-2 text-lg">
            Mode:
          </label>
          <select
            id="mode"
            className="bg-black text-white border border-white p-2 rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            <option value="current-time">Current Time</option>
            <option value="timer">Timer</option>
            <option value="countdown">Countdown</option>
          </select>
        </div>
      )}

      <div className={`font-bold ${isFullscreen ? "text-[15vw]" : "text-[8vw]"}`}>
        {mode === "current-time" && time.toLocaleTimeString()}
        {mode === "timer" && formatTime(timerValue)}
        {mode === "countdown" && formatTime(remainingTime)}
      </div>

      {mode === "timer" && !isFullscreen && (
        <div className="mt-4">
          <button
            className="bg-black text-white border border-white px-4 py-2 rounded mr-2 hover:bg-gray-800"
            onClick={() => setTimerActive(true)}
          >
            Start Timer
          </button>
          <button
            className="bg-black text-white border border-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => setTimerActive(false)}
          >
            Stop Timer
          </button>
        </div>
      )}

      {mode === "countdown" && !isFullscreen && (
        <div className="mt-4 flex flex-col items-center">
          <div className="flex space-x-2">
            <input
              type="number"
              className="bg-black text-white border border-white p-2 rounded w-16 text-center"
              placeholder="HH"
              min={0}
              max={23}
              value={countdownTime.hours}
              onChange={(e) =>
                setCountdownTime({
                  ...countdownTime,
                  hours: parseInt(e.target.value, 10) || 0,
                })
              }
            />
            <span className="text-2xl">:</span>
            <input
              type="number"
              className="bg-black text-white border border-white p-2 rounded w-16 text-center"
              placeholder="MM"
              min={0}
              max={59}
              value={countdownTime.minutes}
              onChange={(e) =>
                setCountdownTime({
                  ...countdownTime,
                  minutes: parseInt(e.target.value, 10) || 0,
                })
              }
            />
            <span className="text-2xl">:</span>
            <input
              type="number"
              className="bg-black text-white border border-white p-2 rounded w-16 text-center"
              placeholder="SS"
              min={0}
              max={59}
              value={countdownTime.seconds}
              onChange={(e) =>
                setCountdownTime({
                  ...countdownTime,
                  seconds: parseInt(e.target.value, 10) || 0,
                })
              }
            />
          </div>
          <button
            className="bg-black text-white border border-white px-4 py-2 mt-4 rounded hover:bg-gray-800"
            onClick={handleCountdownStart}
          >
            Start Countdown
          </button>
        </div>
      )}

      {!isFullscreen && (
        <button
          className="absolute bottom-4 right-4 bg-black text-white border border-white px-4 py-2 rounded hover:bg-gray-800 flex items-center space-x-2"
          onClick={toggleFullscreen}
        >
          <span>Fullscreen</span>
          <span className="text-lg">&#x26F6;</span>
        </button>
      )}
    </div>
  );
};

export default TimerApp;
