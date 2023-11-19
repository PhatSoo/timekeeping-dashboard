'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

const Header = () => {
  const pathname = usePathname();
  const header = pathname === '/' ? 'HOME' : pathname.slice(1);
  return (
    <div className='d-flex align-items-center justify-content-start w-100 p-2'>
      <div className='d-flex justify-content-center w-100'>
        <h1 className='fw-bold text-uppercase text-secondary' style={{ letterSpacing: 2 }}>
          {header}
        </h1>
      </div>
    </div>
  );
};

export default Header;
