import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';

export interface TimeViewerHandle {
  startCount(): void;
  endCount(): void;
  setTime(seconds: number): void;
}

const TimeViewer = forwardRef((props, ref) => {
  const [seconds, setSeconds] = useState(120 * 60); // giây;
  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    startCount();
    return () => {
      endCount();
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      endCount();
    }
  }, [seconds]);

  const setTime = (seconds: number) => {
    setSeconds(seconds);
  };

  const startCount = () => {
    timer.current = setInterval(decrement, 1000);
  };

  const decrement = useCallback(() => {
    setSeconds(prev => prev - 1);
  }, []);

  const endCount = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  useImperativeHandle(ref, () => ({
    startCount,
    endCount,
    setTime,
  }));

  return (
    <div className=" w-full justify-center  flex font-bold text-[3rem] gap-2">
      <div>{Math.floor(seconds / 3600)}</div>
      <div>:</div>
      <div>{Math.floor((seconds % 3600) / 60)}</div>
      <div>:</div>
      <div>{Math.floor(seconds % 60)}</div>
    </div>
  );
});
TimeViewer.displayName = 'TimeViewer';
export default TimeViewer;
