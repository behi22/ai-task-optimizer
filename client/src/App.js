import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Optimizer from './pages/Optimizer';
import Footer from './components/Footer';

const { Header, Content } = Layout;

function App() {
  const menuItems = [
    {
      key: '1',
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '2',
      label: <Link to="/tasks">Tasks</Link>,
    },
    {
      key: '3',
      label: <Link to="/optimizer">Optimizer</Link>,
    },
  ];

  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" items={menuItems} />
        </Header>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/optimizer" element={<Optimizer />} />
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Router>
  );
}

export default App;
