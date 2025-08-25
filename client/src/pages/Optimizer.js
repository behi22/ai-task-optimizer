import React, { useState, useEffect } from 'react';
import { Button, List, Card, Typography } from 'antd';
import api from '../api';
import dayjs from 'dayjs';

const { Paragraph, Title } = Typography;

export default function Optimizer() {
  const [optimized, setOptimized] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await api.get('/tasks');
        setTasks(tasksRes.data);

        const lastOptRes = await api.get('/optimize/last');
        setOptimized(lastOptRes.data.optimized || []);
      } catch (err) {
        console.error('Failed fetching tasks or optimizer history:', err);
      }
    };
    fetchData();
  }, []);

  const runOptimizer = async () => {
    try {
      setLoading(true);
      const cleanedTasks = tasks.map((t) => ({
        title: t.title,
        description: t.description || '',
        deadline: t.deadline,
        importance: t.importance,
        status: t.status,
      }));

      const res = await api.post('/optimize', cleanedTasks);
      setOptimized(res.data.optimized || []);
    } catch (err) {
      console.error('Optimizer failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="optimizer-container">
      <Paragraph style={{ maxWidth: 800, margin: '0 30px 30px 30px', textAlign: 'center', fontSize: 18 }}>
        The optimizer calculates the priority of your pending tasks based on importance and urgency.
        Tasks closer to their deadline and higher in importance are ranked higher to help you focus
        on what matters most.
      </Paragraph>

      <Button
        type="primary"
        onClick={runOptimizer}
        loading={loading}
        className="optimizer-button"
      >
        Run Optimizer
      </Button>

      {optimized.length === 0 ? (
        <Paragraph style={{ textAlign: 'center', marginTop: 20 }}>
          No optimization results yet.
        </Paragraph>
      ) : (
        <>
          <Title level={4} style={{ textAlign: 'center', marginTop: 30, marginBottom: 30 }}>
            Last Optimization Results
          </Title>
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
            dataSource={optimized}
            renderItem={(task) => (
              <List.Item>
                <Card title={task.title} bordered className="optimizer-card">
                  <p>{task.description}</p>
                  <p>
                    <b>Deadline:</b> {dayjs(task.deadline).format('YYYY-MM-DD')}
                  </p>
                  <p>
                    <b>Importance:</b> {task.importance}
                  </p>
                </Card>
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
}
