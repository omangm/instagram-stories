import { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoriesHome from './components/StoriesList';
import StoryViewer from './components/StoryViewer';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoriesHome />} />
        <Route path="/stories/:userId/:storyId" element={<StoryViewer />} />
      </Routes>
    </Router>
  );
}

export default App;