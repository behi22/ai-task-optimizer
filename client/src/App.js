import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Optimizer from './pages/Optimizer';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/tasks">Tasks</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/optimizer">Optimizer</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/optimizer" element={<Optimizer />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
