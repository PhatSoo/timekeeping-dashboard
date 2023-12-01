import { Button, Col, Form, Row, Navbar } from 'react-bootstrap';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';

interface IProps {
  searchKey: string;
  setSearchKey: (e: any) => void;
}

const NavbarComponent = ({ searchKey, setSearchKey }: IProps) => {
  return (
    <>
      <Navbar className='bg-body-tertiary justify-content-end mb-5 p-2'>
        <Form>
          <Row>
            <Col xs='auto'>
              <Form.Control value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type='text' placeholder='Search' className=' mr-sm-2' />
            </Col>
          </Row>
        </Form>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
