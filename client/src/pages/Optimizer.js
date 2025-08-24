import React, { useState } from 'react';
import { Button, List, Card } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

export default function Optimizer() {
  const [optimized, setOptimized] = useState([]);

  const runOptimizer = async () => {
    const res = await axios.post('http://localhost:5000/optimize');
    setOptimized(res.data.optimized);
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
