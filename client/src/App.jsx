import React, { useState } from 'react';
import InteractionTracker from './components/InteractionTracker';
import ChartDisplay from './components/ChartDisplay';

function App() {
  const [updateChart, setUpdateChart] = useState(false);

  const handleInteraction = () => {
    setUpdateChart(prev => !prev); // toggle to trigger useEffect
  };

  return (
    <div className="p-10 font-sans">
      <h1 className="text-3xl font-bold mb-6">User Interaction Tracker</h1>
      <InteractionTracker onInteraction={handleInteraction} />
      <ChartDisplay refresh={updateChart} />
    </div>
  );
}

export default App;
