// src/components/ChartDisplay.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function ChartDisplay({ refresh }) {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:5050/api/interactions')
        .then(res => {
          const rawData = res.data;
          const formatted = Object.entries(rawData)
            .map(([elementId, counts]) => ({
              name: elementId.replace('product', 'Product '),
              productNumber: parseInt(elementId.replace('product', '')),
              Clicks: counts.clicks,
              Hovers: counts.hovers,
            }))
            .sort((a, b) => a.productNumber - b.productNumber);
          setData(formatted);
        })
        .catch(err => console.error('Failed to fetch data:', err));
    }, [refresh]);
  
    return (
      <div className="w-full h-96 mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Interaction Analytics</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px'
              }}
            />
            <Legend />
            <Bar dataKey="Clicks" fill="#8884d8" name="Clicks" />
            <Bar dataKey="Hovers" fill="#82ca9d" name="Hovers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  