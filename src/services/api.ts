import { StoriesData } from '../types';

// This is a mock API service - in a real app, this would fetch from a real API
export const fetchStories = async (): Promise<StoriesData> => {
  // In a real app, this would be a fetch call to your API
  const response = await fetch('/stories.json');
  const data = await response.json();

  return data;
};
