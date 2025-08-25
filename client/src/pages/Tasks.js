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
  Row,
  Col,
  Card,
} from 'antd';
import api from '../api';
import dayjs from 'dayjs';

const { Option } = Select;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');

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
      status: 'pending',
    });
    setIsModalOpen(false);
    form.resetFields();
    fetchTasks();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const handleSearch = async () => {
    if (search.trim() === '') fetchTasks();
    else {
      const res = await api.get(`/tasks/search?q=${search}`);
      setTasks(res.data);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', responsive: ['xs', 'sm', 'md', 'lg'] },
    { title: 'Description', dataIndex: 'description', responsive: ['md', 'lg'] },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (d) => dayjs(d).format('YYYY-MM-DD'),
      responsive: ['sm', 'md', 'lg'],
    },
    { title: 'Importance', dataIndex: 'importance', responsive: ['sm', 'md', 'lg'] },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          style={{ width: '100%' }}
        >
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
        </Select>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
  ];

  return (
    <div className="tasks-container">
      <Row gutter={[16, 16]} justify="center" align="middle">
        {/* Search input */}
        <Col xs={24} sm={16} md={18} lg={18}>
          <Input.Search
            placeholder="Search tasks by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            enterButton
            className="tasks-search"
          />
        </Col>

        {/* Add Task button */}
        <Col xs={24} sm={8} md={6} lg={6} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={() => setIsModalOpen(true)} className="tasks-add-btn">
            Add Task
          </Button>
        </Col>

        {/* Task Table */}
        <Col xs={24}>
          <Card className="tasks-table-card">
            <Table
              dataSource={tasks}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Add Task Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        title="Add Task"
        destroyOnClose
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Task title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Task description" rows={3} />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="importance" label="Importance (1–10)" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
