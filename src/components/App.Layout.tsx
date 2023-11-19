import React from 'react';
import { Col, Container } from 'react-bootstrap';
import Sidebar from './App.Sidebar';
import Header from './App.Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container fluid className='p-2 d-flex vh-100 gap-3'>
      <Col xs={3} className='bg-white rounded shadow-5'>
        <Sidebar />
      </Col>
      <Col className='d-flex flex-column gap-2'>
        <div className='d-flex bg-white justify-content-center align-items-center rounded border border-gray-500' style={{ height: '70px' }}>
          <Header />
        </div>
        <div className='flex-grow-1 bg-white p-3 rounded shadow-5 overflow-auto'>{children}</div>
      </Col>
    </Container>
  );
};

export default Layout;
