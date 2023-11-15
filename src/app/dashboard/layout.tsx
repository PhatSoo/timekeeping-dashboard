'use client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Col, Container } from 'react-bootstrap';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container fluid className='p-2' style={{ display: 'flex', height: '100vh', gap: 40 }}>
      <Col xs={3} style={{ backgroundColor: '#fff', borderRadius: 10, boxShadow: '0px 0px 10px #000' }}>
        <Sidebar />
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', backgroundColor: '#fff', height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 10, border: '1px solid gray' }}>
          <Header />
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 10, boxShadow: '0px 0px 10px #000' }}>{children}</div>
      </Col>
    </Container>
  );
}
