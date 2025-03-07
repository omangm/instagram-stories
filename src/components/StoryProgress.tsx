import { JSX, useEffect, useState, useRef } from 'react';

interface StoryProgressProps {
  active: boolean;
  completed: boolean;
  paused?: boolean;
}

function StoryProgress({ active, completed, paused = false }: StoryProgressProps): JSX.Element {
  const [progress, setProgress] = useState(completed ? 100 : 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (completed) {
      setProgress(100);
      return;
    }

    if (!active || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (active && !paused) {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 100;
          }
          return prev + 2; // Increment to complete in 5 seconds
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, completed, paused]);

  return (
    <div
      className="h-0.5 bg-gray-600 flex-1 rounded-full overflow-hidden"
      data-testid={`progress-bar-${active ? 'active' : completed ? 'completed' : 'inactive'}`}
    >
      <div
        className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default StoryProgress;