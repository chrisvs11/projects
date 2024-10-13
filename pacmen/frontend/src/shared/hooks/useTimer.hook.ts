import { useRef, useState } from "react";

export const useTimer = (WaitingTime: number=60) => {
  const [timer, setTimer] = useState<number>(WaitingTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if(intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  };

  return {
    timer,
    startTimer,
    clearTimer,
  };
};

