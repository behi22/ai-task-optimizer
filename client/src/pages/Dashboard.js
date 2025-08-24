import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import api from '../api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(res.data));
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
