import { Button, Col, Form, Row, Navbar } from 'react-bootstrap';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';

const NavbarComponent = () => {
  return (
    <>
      <Navbar className='bg-body-tertiary justify-content-end mb-5 p-2'>
        <Form>
          <Row>
            <Col xs='auto'>
              <Form.Control type='text' placeholder='Search' className=' mr-sm-2' />
            </Col>
            <Col xs='auto'>
              <Button type='submit'>
                <HiMiniMagnifyingGlass />
              </Button>
            </Col>
          </Row>
        </Form>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
