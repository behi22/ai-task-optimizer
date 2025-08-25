import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, ConfigProvider } from 'antd';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Optimizer from './pages/Optimizer';
import Footer from './components/Footer';
import './App.css';

const { Header, Content } = Layout;

// A wrapper to sync Menu highlight with current route
function AppMenu() {
  const location = useLocation();

  // Map routes -> menu keys
  const pathToKey = {
    '/tasks': '1',
    '/': '2',
    '/optimizer': '3',
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathToKey[location.pathname] || '2']} // default to dashboard
      items={[
        { key: '1', label: <Link to="/tasks">Tasks</Link> },
        { key: '2', label: <Link to="/">Dashboard</Link> },
        { key: '3', label: <Link to="/optimizer">Optimizer</Link> },
      ]}
      className="app-menu"
    />
  );
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--accent)',
          borderRadius: 8,
        },
      }}
    >
      <Router>
        <Layout>
          <Header className="app-header">
            <AppMenu />
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
    </ConfigProvider>
  );
}

export default App;
