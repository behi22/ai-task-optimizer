import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
} from 'antd';
import api from '../api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data);
  };

  const handleAdd = async (values) => {
    await api.post('/tasks', {
      ...values,
      deadline: values.deadline.toISOString(),
      status: 'pending', // default status
    });
    setIsModalOpen(false);
    form.resetFields();
    fetchTasks();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (d) => dayjs(d).format('YYYY-MM-DD'),
    },
    { title: 'Importance', dataIndex: 'importance' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          style={{ width: 120 }}
        >
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Task
      </Button>
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="_id"
        style={{ marginTop: 20 }}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        title="Add Task"
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="importance"
            label="Importance (1–10)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
