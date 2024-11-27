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
  const [timerValue, setTimerValue] = useState<number>(0); // Timer in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [countdownTime, setCountdownTime] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countdownActive, setCountdownActive] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false); // Tracks client-side rendering

  // Ensure the component renders only after mounting
  useEffect(() => {
    setIsMounted(true);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Add event listener for fullscreen change
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Effect to update the current time
  useEffect(() => {
    if (mode === "current-time" && isMounted) {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [mode, isMounted]);

  // Effect to handle countdown
  useEffect(() => {
    if (mode === "countdown" && countdownActive && remainingTime > 0) {
      const interval = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (remainingTime === 0 && countdownActive) {
      setCountdownActive(false);
      alert("Countdown finished!");
    }
  }, [mode, countdownActive, remainingTime]);

  // Effect to handle timer
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
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!isMounted) {
    // Prevent rendering until after the client is mounted
    return <div className="h-screen w-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Mode Selector */}
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

      {/* Display Time, Timer, or Countdown */}
      <div className={`font-bold ${isFullscreen ? "text-[15vw]" : "text-[8vw]"}`}>
        {mode === "current-time" && time.toLocaleTimeString()}
        {mode === "timer" && formatTime(timerValue)}
        {mode === "countdown" && formatTime(remainingTime)}
      </div>

      {/* Timer Buttons */}
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

      {/* Countdown Input */}
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

      {/* Fullscreen Button */}
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
