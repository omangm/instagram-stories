import { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoriesHome from './components/StoriesList';
import StoryViewer from './components/StoryViewer';
import NotFound from './components/NotFound';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoriesHome />} />
        <Route path="/stories/:userId/:storyId" element={<StoryViewer />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;