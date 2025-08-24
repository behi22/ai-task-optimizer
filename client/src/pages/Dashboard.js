import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import axios from 'axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks').then((res) => setTasks(res.data));
  }, []);

  const statusData = [
    {
      name: 'Pending',
      value: tasks.filter((t) => t.status === 'pending').length,
    },
    {
      name: 'Completed',
      value: tasks.filter((t) => t.status === 'completed').length,
    },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <Card title="Task Overview">
      <PieChart width={400} height={300}>
        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {statusData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Card>
  );
}
