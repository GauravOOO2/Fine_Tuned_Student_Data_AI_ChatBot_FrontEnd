import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change Switch to Routes
import ChatbotUI from './ChatbotUI';
import Help from './components/ui/Help'; // Import the Help component
import History from './components/ui/History'; // Import the History component

function App() {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<ChatbotUI />} /> {/* Use element prop instead of component */}
        <Route path="/help" element={<Help />} /> {/* Define the Help route */}
        <Route path="/history" element={<History />} /> {/* Define the History route */}
      </Routes>
    </Router>
  );
}

export default App;