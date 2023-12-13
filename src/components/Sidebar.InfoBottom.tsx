'use client';
import { IEmployee } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import avatar_icon from '@/../public/avatar-icon.jpg';
import Image from 'next/image';

const InfoBottom = () => {
  const [userInfo, setUserInfo] = useState<IEmployee | null>();
  const [loading, setLoading] = useState(false);

  // GET CURRENT LOGIN INFO
  useEffect(() => {
    fetch('api/auth/me')
      .then((response) => response.json())
      .then((result) => setUserInfo(result.data))
      .finally(() => setLoading(true));
  }, []);

  const router = useRouter();
  const handleLogout = () => {
    fetch('api/auth/logout')
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          router.push('login');
        }
      });
  };

  return (
    <>
      <Button className='btn btn-danger' onClick={handleLogout}>
        Logout
      </Button>

      {loading ? (
        <Container className='d-flex justify-content-between px-4'>
          <div className='d-flex justify-content-center align-items-center'>
            <div>
              <Image alt='avatar' src={userInfo?.avatar ? userInfo.avatar : avatar_icon} width='50' height='50' />
            </div>
          </div>
          <div className='px-2 w-100 text-center'>
            <div className='text-wrap'>{userInfo?.name}</div>
            <div className='d-none d-lg-block'>{userInfo?.email}</div>
          </div>
        </Container>
      ) : (
        <Spinner className='m-auto' animation='grow' />
      )}
    </>
  );
};

export default InfoBottom;
