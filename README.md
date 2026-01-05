# Instagram Stories Clone

This project is an Instagram Stories clone built with React and TypeScript. It simulates the Instagram stories feature with a focus on performance and user experience.

## Deployment

The application is deployed at [https://instagram-stories-pink.vercel.app/](https://instagram-stories-pink.vercel.app/). Visit this link to access the live application.

## Features

- View stories from multiple users
- Navigate between stories with intuitive tap gestures
- Automatic progression through stories
- Visual progress indicators
- Optimized image loading
- Loading indicators with fallbacks

## Setup and Running the Application

### Prerequisites

- Node.js and npm (Node Package Manager)
- Git (optional, for cloning the repository)

### Installation

1. Clone the repository or download the source code:

   ```bash
   git clone https://github.com/omangm/instagram-stories
   cd instagram-stories
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm run dev
   ```

   This will run the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Running Tests

To run the end-to-end tests with Cypress:

```bash
pnpm dlx cypress open
```

## Design Choices and Technical Implementation

### Performance Optimizations

#### 1. Image Optimization

The `OptimizedImage` component improves performance in several ways:

- **Lazy loading**: Images load only when needed using the `loading="lazy"` attribute
- **Priority loading**: Critical images can use `priority="true"` to load eagerly
- **Placeholder display**: Shows a pulsing gray placeholder while images load
- **Fallbacks**: Handles loading errors gracefully with placeholder images
- **Dynamic resizing**: Adds width/height parameters to image URLs for optimal delivery
- **Efficient reflow**: Maintains layout dimensions during loading to prevent layout shifts

```typescript
// OptimizedImage component optimizes image loading and handling
const getOptimizedSrc = (): string => {
  try {
    const url = new URL(src);
    // Add dimension parameters for CDN optimization
    if (width) url.searchParams.append("w", width.toString());
    if (height) url.searchParams.append("h", height.toString());
    return url.toString();
  } catch (e) {
    return src;
  }
};
```

#### 2. Progressive Loading and User Feedback

- **Loading spinners**: Clear loading states with `LoadingSpinner` component
- **Smooth transitions**: Opacity transitions make loading appear seamless
- **Progress indicators**: Visual feedback shows story progression with `StoryProgress`

#### 3. Efficient State Management

- Careful state design with specific, granular states (e.g., `isImageLoaded`)
- Logical separation of concerns into focused components
- React's built-in hooks for state management without excess libraries

### Scalability Considerations

#### 1. Component Architecture

The application uses a modular component structure:

- **StoryOverview**: Displays user thumbnails in the story feed
- **StoriesList**: Container for the story thumbnails
- **StoryViewer**: Main viewing component for individual stories
- **StoryProgress**: Visual progress tracking component
- **OptimizedImage**: Reusable optimized image component
- **LoadingSpinner**: Reusable loading indicator

This separation allows for easier maintenance and extension.

#### 2. Navigation and Routing

The application uses React Router for navigation:

- URL-driven state allows for deep linking, sharing, and browser navigation
- Routes reflect resource IDs (user ID, story ID) in a RESTful manner
- History-based navigation maintains expected back/forward functionality

#### 3. Timeout and Memory Management

The application carefully manages resources:

- Proper cleanup of timers and intervals to prevent memory leaks
- References maintained with `useRef` for efficient cleanup
- Effect dependencies properly managed to prevent stale closures

#### 5. User Experience Optimizations

- Gesture-based navigation (left/right tapping)
- Visual feedback for loading and progress
- Automatic progression with the ability to manually navigate
- Smooth transitions between stories

## Testing Strategy

The application includes comprehensive end-to-end tests with Cypress that verify:

- Story list display
- Navigation between stories
- Loading states
- Progress indicators
- Automatic navigation
