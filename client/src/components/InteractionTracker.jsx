import React, { useEffect, useState } from 'react';
import axios from 'axios';

const elementsToTrack = [
  { id: 'product1', label: 'Product 1' },
  { id: 'product2', label: 'Product 2' },
  { id: 'product3', label: 'Product 3' },
  { id: 'product4', label: 'Product 4' },
  { id: 'product5', label: 'Product 5' },
  { id: 'product6', label: 'Product 6' },
];

export default function InteractionTracker({ onInteraction }) {
  const [counts, setCounts] = useState({});
  const [hoverTimers, setHoverTimers] = useState({});

  // Load initial interaction data on mount
  useEffect(() => {
    axios
      .get('http://localhost:5050/api/interactions')
      .then((res) => setCounts(res.data))
      .catch((err) => console.error('Failed to load interaction data:', err));
  }, []);

  const handleInteraction = async (elementId, type) => {
    try {
      await axios.post('http://localhost:5050/api/interactions', {
        elementId,
        type,
      });

      if (onInteraction) onInteraction(); // trigger chart update in parent

      // Update local count display immediately
      setCounts((prev) => ({
        ...prev,
        [elementId]: {
          clicks: (prev[elementId]?.clicks || 0) + (type === 'click' ? 1 : 0),
          hovers: (prev[elementId]?.hovers || 0) + (type === 'hover' ? 1 : 0),
        },
      }));
    } catch (error) {
      console.error('Failed to send interaction:', error);
    }
  };

  const handleMouseEnter = (elementId) => {
    // Clear any existing timer for this element
    if (hoverTimers[elementId]) {
      clearTimeout(hoverTimers[elementId]);
    }

    // Set a new timer
    const timer = setTimeout(() => {
      handleInteraction(elementId, 'hover');
    }, 1000); 

    setHoverTimers(prev => ({
      ...prev,
      [elementId]: timer
    }));
  };

  const handleMouseLeave = (elementId) => {
    // Clear the timer when mouse leaves
    if (hoverTimers[elementId]) {
      clearTimeout(hoverTimers[elementId]);
      setHoverTimers(prev => ({
        ...prev,
        [elementId]: null
      }));
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {elementsToTrack.map(({ id, label }) => {
        const clickCount = counts[id]?.clicks || 0;
        const hoverCount = counts[id]?.hovers || 0;

        return (
          <div
            key={id}
            id={id}
            onClick={() => handleInteraction(id, 'click')}
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={() => handleMouseLeave(id)}
            className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition-colors duration-200 bg-white shadow-sm hover:shadow-md"
          >
            <div className="font-semibold text-lg mb-2">{label}</div>
            <div className="text-sm text-gray-600">
              <div>Clicks: {clickCount}</div>
              <div>Hovers: {hoverCount}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
