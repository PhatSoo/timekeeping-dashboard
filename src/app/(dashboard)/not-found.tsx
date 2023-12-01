import Link from 'next/link';
import { Container } from 'react-bootstrap';

export default function NotFound() {
  return (
    <Container fluid className='d-flex flex-column align-items-center justify-content-center h-100'>
      <h2>404 - Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href='/'>Return Home</Link>
    </Container>
  );
}
