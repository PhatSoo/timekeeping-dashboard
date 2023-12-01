'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/App.CardItem';
import CardLoading from '@/components/Component.CardLoading';

const App = () => {
  const [data, setData] = useState<{ title: string; total: number; link: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('api/employee').then((response) => response.json()),
      fetch('api/shift').then((response) => response.json()),
      fetch('api/form-request').then((response) => response.json()),
      fetch('api/role').then((response) => response.json()),
    ])
      .then(([employeeResult, shiftResult, formResult, roleResult]) => {
        setData([
          { title: 'Employees', total: employeeResult.total, link: 'employee' },
          { title: 'Shifts', total: shiftResult.total, link: 'shift' },
          { title: 'Form Request', total: formResult.total, link: 'form-request' },
          { title: 'Roles', total: roleResult.total, link: 'role' },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const date = new Date();

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('vi-VN', options as Intl.DateTimeFormatOptions);

  return (
    <>
      <div className='fs-4 fw-bold text-dark text-center p-4 bg-light border border-2 border-secondary rounded-3'>{formattedDate}</div>

      <div className='d-flex justify-content-center p-5 gap-5 flex-wrap'>
        {isLoading ? <CardLoading /> : data.length > 0 ? data.map((item, idx) => <Card key={idx} Title={item.title} Content={item.total} Href={item.link} />) : <div>Chưa có dữ liệu để hiển thị</div>}
      </div>
    </>
  );
};

export default App;
