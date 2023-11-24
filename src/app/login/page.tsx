'use client';
// import { login } from '@/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleEmailChange = (e: { target: { value: SetStateAction<string> } }) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: { target: { value: SetStateAction<string> } }) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // const res = await login({ email, password });
    // if (res.success) {
    //   router.push('/');
    // } else {
    //   setError(res.message);
    // }
  };

  return (
    <Container fluid className='d-flex align-items-center justify-content-center'>
      <Row>
        <Col md={6} lg={6}>
          <Image src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg' priority alt='Company Image' width={500} height={500} />
        </Col>

        <Col md={6} lg={6}>
          <Form className='mb-4' onSubmit={handleSubmit}>
            <Form.Group className='mb-4' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control type='email' placeholder='Enter email' size='lg' onChange={handleEmailChange} required />
            </Form.Group>

            <Form.Group className='mb-4' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control required minLength={8} type='password' placeholder='Password' size='lg' onChange={handlePasswordChange} />
            </Form.Group>
            {error && <Alert variant='danger'>{error}</Alert>}

            <div className='d-flex justify-content-between mx-4 mb-4'>
              <Form.Check type='checkbox' id='flexCheckDefault' label='Remember me' />
              <a href='!#'>Forgot password?</a>
            </div>

            <Button className='mb-4 w-100' variant='primary' size='lg' type='submit'>
              Sign in
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
