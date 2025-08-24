import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center', marginTop: 40 }}>
      AI Task Optimizer ©{new Date().getFullYear()} Created by Behbod Babai
    </AntFooter>
  );
}
