import Link from 'next/link';
import { Container, Image } from 'react-bootstrap';

const InfoBottom = () => {
  return (
    <>
      <Link href={'login'} className='btn btn-danger'>
        Logout
      </Link>

      <Container className='d-flex justify-content-between px-4'>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='border rounded-circle'>
            <Image alt='avatar' src='https://cdn-icons-png.flaticon.com/512/103/103945.png' width='50' height='50' />
          </div>
        </div>
        <div className='px-2 w-100 text-center'>
          <div className='text-wrap'>Lê Trung Phát</div>
          <div className='d-none d-lg-block'>phat.ltrung@mail.com</div>
        </div>
      </Container>
    </>
  );
};

export default InfoBottom;
