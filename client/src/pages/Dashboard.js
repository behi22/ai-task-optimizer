import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Form, Input, Button, DatePicker, InputNumber } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../api';
import dayjs from 'dayjs';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [latestTasks, setLatestTasks] = useState([]);
  const [lastOptimized, setLastOptimized] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
    fetchLatestTasks();
    fetchLastOptimized();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchLatestTasks = async () => {
    try {
      const res = await api.get('/tasks/latest');
      setLatestTasks(res.data);
    } catch (err) {
      console.error('Error fetching latest tasks:', err);
    }
  };

  const fetchLastOptimized = async () => {
    try {
      const res = await api.get('/optimize/last');
      // Sort by importance descending and take top 3
      const top3 = (res.data.optimized || [])
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3);
      setLastOptimized(top3);
    } catch (err) {
      console.error('Failed to fetch last optimization:', err);
    }
  };

  const handleAdd = async (values) => {
    try {
      await api.post('/tasks', {
        ...values,
        deadline: values.deadline.toISOString(),
        status: 'pending',
      });
      form.resetFields();
      fetchTasks();
      fetchLatestTasks();
      fetchLastOptimized();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = pendingTasks.filter(
    (t) => new Date(t.deadline) < new Date()
  );

  const statusData = [
    { name: 'Pending', value: pendingTasks.length },
    { name: 'Completed', value: completedTasks.length },
    { name: 'Overdue', value: overdueTasks.length },
  ];

  return (
    <div>
      {/* Stats Row */}
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

      {/* Row: Last Optimizer Result (Top 3) */}
      {lastOptimized.length > 0 && (
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card title="Top 3 Prioritized Tasks (Last Optimization)">
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={lastOptimized}
                renderItem={(task) => (
                  <List.Item>
                    <Card title={task.title}>
                      <p>{task.description}</p>
                      <p><b>Deadline:</b> {dayjs(task.deadline).format('YYYY-MM-DD')}</p>
                      <p><b>Importance:</b> {task.importance}</p>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Row: Task Status + Upcoming Deadlines */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Task Status">
            <BarChart width={400} height={300} data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1890ff" />
            </BarChart>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Upcoming Deadlines (by due date)">
            <List
              dataSource={pendingTasks
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5)}
              renderItem={(task) => (
                <List.Item>
                  <b>{task.title}</b> - {dayjs(task.deadline).format('YYYY-MM-DD')}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Row: Last Added Tasks + Quick Add */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Last 5 Added Tasks">
            <List
              dataSource={latestTasks}
              renderItem={(task) => (
                <List.Item>
                  <b>{task.title}</b> - {dayjs(task.deadline).format('YYYY-MM-DD')}
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Quick Add Task">
            <Form form={form} onFinish={handleAdd} layout="inline">
              <Form.Item name="title" rules={[{ required: true, message: 'Title required' }]}>
                <Input placeholder="Title" />
              </Form.Item>
              <Form.Item name="deadline" rules={[{ required: true, message: 'Deadline required' }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name="importance" rules={[{ required: true, message: 'Importance required' }]}>
                <InputNumber min={1} max={10} placeholder="Importance" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Add</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
