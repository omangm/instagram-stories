import { StoriesData } from '../types';

// This is a mock API service - in a real app, this would fetch from a real API
export const fetchStories = async (): Promise<StoriesData> => {
  // In a real app, this would be a fetch call to your API
  return {
    "users": [
      {
        "id": "1",
        "username": "user1",
        "profilePicture": "https://i.pravatar.cc/150",
        "stories": [
          {
            "id": "s1",
            "imageUrl": "https://picsum.photos/id/101/1080/1920?1",
            "username": "user1",
            "timestamp": "2025-02-15T10:30:00Z"
          },
          {
            "id": "s2",
            "imageUrl": "https://picsum.photos/id/102/1080/1920?2",
            "username": "user1",
            "timestamp": "2025-02-15T11:30:00Z"
          }
        ]
      },
      {
        "id": "2",
        "username": "user2",
        "profilePicture": "https://i.pravatar.cc/200",
        "stories": [
          {
            "id": "s3",
            "imageUrl": "https://picsum.photos/id/103/1080/1920?11",
            "username": "user2",
            "timestamp": "2025-02-15T09:30:00Z"
          },
          {
            "id": "s12",
            "imageUrl": "https://picsum.photos/id/112/1080/1920?12",
            "username": "user2",
            "timestamp": "2025-02-15T09:30:00Z"
          },
          {
            "id": "s345",
            "imageUrl": "https://picsum.photos/id/115/1080/1920?13",
            "username": "user2",
            "timestamp": "2025-02-15T09:30:00Z"
          }
        ]
      },
      {
        "id": "3",
        "username": "user3",
        "profilePicture": "https://i.pravatar.cc/250",
        "stories": [
          {
            "id": "s4",
            "imageUrl": "https://picsum.photos/id/106/1080/1920?4",
            "username": "user3",
            "timestamp": "2025-02-15T12:30:00Z"
          },
          {
            "id": "s5",
            "imageUrl": "https://picsum.photos/id/107/1080/1920?5",
            "username": "user3",
            "timestamp": "2025-02-15T13:30:00Z"
          },
          {
            "id": "s6",
            "imageUrl": "https://picsum.photos/id/108/1080/1920?6",
            "username": "user3",
            "timestamp": "2025-02-15T14:30:00Z"
          }
        ]
      }
    ]
  };
};
