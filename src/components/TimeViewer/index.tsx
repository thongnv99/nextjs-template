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
  setTime(minutes: number): void;
}

const TimeViewer = forwardRef((props: { initTime: number }, ref) => {
  const [seconds, setSeconds] = useState(props.initTime * 60); // giây;
  const timer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    startCount();
    return () => {
      endCount();
    };
  }, []);

  useEffect(() => {
    setSeconds(props.initTime * 60);
  }, [props.initTime]);

  useEffect(() => {
    if (seconds === 0) {
      endCount();
    }
  }, [seconds]);

  const setTime = (minutes: number) => {
    setSeconds(minutes * 60);
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
