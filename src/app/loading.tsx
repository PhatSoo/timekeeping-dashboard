import Layout from '@/components/App.Layout';
import { Container, Spinner } from 'react-bootstrap';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Layout>
      <Container fluid className='d-flex flex-column gap-2 justify-content-center align-items-center h-100'>
        <Spinner animation='border' variant='info' />
        Loading....
      </Container>
    </Layout>
  );
}
