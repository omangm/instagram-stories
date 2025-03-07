import { JSX } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="flex flex-col w-full backdrop-blur-3xl items-center justify-center h-screen" data-testid="loading-spinner">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className='text-white'>{message}</p>
    </div>
  );
}

export default LoadingSpinner;