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

const TimeViewer = forwardRef(
  (props: { initTime: number; onExp(): void }, ref) => {
    const [state, setState] = useState({});
    const seconds = useRef(0);
    const timer = useRef<NodeJS.Timeout>();
    useEffect(() => {
      startCount();
      return () => {
        endCount();
      };
    }, []);

    const setTime = (minutes: number) => {
      seconds.current = minutes * 60;
    };

    const startCount = () => {
      if (props.initTime) {
        seconds.current = props.initTime * 60;
      }
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(decrement, 1000);
    };

    const decrement = () => {
      seconds.current -= 1;
      setState({});
      if (seconds.current <= 0) {
        endCount();
        props.onExp();
      }
    };

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
      <div
        className={`w-full justify-center  flex font-bold text-[3rem] gap-2 ${
          seconds.current < 60 ? 'text-red-500' : ''
        }`}
      >
        <div>{Math.floor(seconds.current / 3600)}</div>
        <div>:</div>
        <div>{Math.floor((seconds.current % 3600) / 60)}</div>
        <div>:</div>
        <div>{Math.floor(seconds.current % 60)}</div>
      </div>
    );
  },
);
TimeViewer.displayName = 'TimeViewer';
export default TimeViewer;
