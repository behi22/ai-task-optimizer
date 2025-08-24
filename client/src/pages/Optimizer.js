import React, { useState } from 'react';
import { Button, List, Card } from 'antd';
import api from '../api';
import dayjs from 'dayjs';

export default function Optimizer() {
  const [optimized, setOptimized] = useState([]);

  const runOptimizer = async () => {
    try {
      const res = await api.post('/optimize');
      setOptimized(res.data.optimized || []);
    } catch (err) {
      console.error('Optimizer failed:', err);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={runOptimizer}>
        Run Optimizer
      </Button>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={optimized}
        renderItem={(task) => (
          <List.Item>
            <Card title={task.title}>
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
    </div>
  );
}
