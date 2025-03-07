import React, { JSX, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStories } from '../services/api';
import { User } from '../types';
import StoryProgress from './StoryProgress';
import { OptimizedImage } from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';

function StoryViewer(): JSX.Element {
  const { userId, storyId } = useParams<{ userId: string; storyId: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Load story data
  useEffect(() => {
    const loadStories = async (): Promise<void> => {
      try {
        const data = await fetchStories();
        setUsers(data.users);

        // Find initial indexes based on URL params
        if (userId && storyId) {
          const userIndex = data.users.findIndex(user => user.id === userId);
          if (userIndex !== -1) {
            setCurrentUserIndex(userIndex);
            const storyIndex = data.users[userIndex].stories.findIndex(story => story.id === storyId);
            if (storyIndex !== -1) {
              setCurrentStoryIndex(storyIndex);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading stories:', error);
        setLoading(false);
      }
    };

    loadStories();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [userId, storyId]);

  // Start timer after image is loaded
  useEffect(() => {
    if (!loading && users.length > 0 && isImageLoaded) {
      timeoutRef.current = setTimeout(() => {
        goToNextStory();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentUserIndex, currentStoryIndex, loading, users, isImageLoaded]);

  // Reset image loaded state when story changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [currentUserIndex, currentStoryIndex]);

  // Navigate to next story
  const goToNextStory = (): void => {
    if (!users.length) return;

    const currentUser = users[currentUserIndex];
    const isLastStory = currentStoryIndex >= currentUser.stories.length - 1;

    if (isLastStory) {
      // Go to next user's first story
      if (currentUserIndex < users.length - 1) {
        const nextUser = users[currentUserIndex + 1];
        navigate(`/stories/${nextUser.id}/${nextUser.stories[0].id}`);
      } else {
        // End of all stories, go back to home
        navigate('/');
      }
    } else {
      // Go to next story of current user
      const nextStory = currentUser.stories[currentStoryIndex + 1];
      navigate(`/stories/${currentUser.id}/${nextStory.id}`);
    }
  };

  // Navigate to previous story
  const goToPrevStory = (): void => {
    if (!users.length) return;

    const isFirstStory = currentStoryIndex === 0;

    if (isFirstStory) {
      // Go to previous user's last story
      if (currentUserIndex > 0) {
        const prevUser = users[currentUserIndex - 1];
        const lastStoryIndex = prevUser.stories.length - 1;
        navigate(`/stories/${prevUser.id}/${prevUser.stories[lastStoryIndex].id}`);
      }
    } else {
      // Go to previous story of current user
      const prevStory = users[currentUserIndex].stories[currentStoryIndex - 1];
      navigate(`/stories/${users[currentUserIndex].id}/${prevStory.id}`);
    }
  };

  // Handle click events for navigation
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    // Reset timeout on any click
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Left side click (previous)
    if (clickX < screenWidth / 3) {
      goToPrevStory();
    }
    // Right side click (next)
    else if (clickX > (screenWidth / 3) * 2) {
      goToNextStory();
    }
    // Middle click does nothing
  };

  // Close story viewer
  const handleClose = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate('/');
  };

  // Handle image load
  const handleImageLoad = (): void => {
    setIsImageLoaded(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading story..." />;
  }

  if (!users.length || currentUserIndex >= users.length) {
    return <div className="flex items-center justify-center h-screen">Story not found</div>;
  }

  const currentUser = users[currentUserIndex];
  const currentStory = currentUser.stories[currentStoryIndex];

  if (!currentStory) {
    return <div className="flex items-center justify-center h-screen">Story not found</div>;
  }

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col"
      onClick={handleScreenClick}
      data-testid="story-viewer-container"
    >
      {/* Story progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 p-2">
        <div className="flex space-x-1">
          {currentUser.stories.map((story, index) => (
            <StoryProgress
              key={story.id}
              active={index === currentStoryIndex && isImageLoaded}
              completed={index < currentStoryIndex}
              paused={!isImageLoaded}
            />
          ))}
        </div>
      </div>

      {/* Story header */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        <div className="flex items-center">
          <OptimizedImage
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-8 h-8 rounded-full mr-2"
            width={32}
            height={32}
            priority={true}
          />
          <span className="text-white font-medium">{currentUser.username}</span>
          <span className="text-white text-xs ml-2 opacity-70">
            {new Date(currentStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            className="ml-auto text-white text-2xl"
            onClick={handleClose}
            data-testid="close-button"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-5">
          <LoadingSpinner message="Loading image..." />
        </div>
      )}

      {/* Story image */}
      <OptimizedImage
        key={`story-${currentStory.id}`} // forces remount on story change
        src={currentStory.imageUrl}
        alt={currentUser.username}
        onLoad={handleImageLoad}
        className={`transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        width={1080}
        height={1920}
        priority={true}
      />
    </div>
  );
}

export default StoryViewer;