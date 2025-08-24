import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List } from 'antd';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import api from '../api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(res.data));
  }, []);

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = pendingTasks.filter(
    (t) => new Date(t.deadline) < new Date()
  );

  const statusData = [
    { name: 'Pending', value: pendingTasks.length },
    { name: 'Completed', value: completedTasks.length },
  ];
  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Tasks" value={tasks.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pending" value={pendingTasks.length} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Overdue" value={overdueTasks.length} />
          </Card>
        </Col>
      </Row>

      <Card title="Task Status" style={{ marginTop: 20 }}>
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

      <Card title="Upcoming Deadlines" style={{ marginTop: 20 }}>
        <List
          dataSource={pendingTasks
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5)}
          renderItem={(task) => (
            <List.Item>
              <b>{task.title}</b> -{' '}
              {new Date(task.deadline).toLocaleDateString()}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
