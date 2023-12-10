'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/App.CardItem';
import CardLoading from '@/components/Component.CardLoading';
import { Accordion, Button, Container, FloatingLabel, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const App = () => {
  const [data, setData] = useState<{ title: string; total: number; link: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [checkedDays, setCheckedDays] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('api/employee').then((response) => response.json()),
      fetch('api/shift').then((response) => response.json()),
      fetch('api/form-request').then((response) => response.json()),
      fetch('api/role').then((response) => response.json()),
      fetch('api/settings').then((response) => response.json()),
    ])
      .then(([employeeResult, shiftResult, formResult, roleResult, settingsResult]) => {
        setData([
          { title: 'Employees', total: employeeResult.total, link: 'employee' },
          { title: 'Shifts', total: shiftResult.total, link: 'shift' },
          { title: 'Form Request', total: formResult.total, link: 'form-request' },
          { title: 'Roles', total: roleResult.total, link: 'role' },
        ]);

        console.log('====================================');
        console.log(settingsResult);
        console.log('====================================');

        if (settingsResult.success) {
          setCheckedDays(settingsResult.data.workDays);
          setStartTime(settingsResult.data.workHours.startTime);
          setEndTime(settingsResult.data.workHours.endTime);
        }
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

  const handleCheckChange = (day: string) => {
    if (checkedDays.includes(day)) {
      setCheckedDays(checkedDays.filter((d) => d !== day));
    } else {
      setCheckedDays([...checkedDays, day]);
    }
  };

  const handleSubmitTime = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workHours: { startTime, endTime } }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
  };

  const handleSubmitWorkDays = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workDays: checkedDays }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
  };

  return (
    <>
      <Container className='fs-4 fw-bold text-center p-4 border border-2 border-secondary rounded-3'>{formattedDate}</Container>

      <Container className='border rounded p-3 mt-3 border-2 border-secondary rounded-3'>
        <Accordion>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Ngày làm trong tuần</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleSubmitWorkDays} className='d-flex align-items-center'>
                <Container>
                  {daysOfWeek.map((day, index) => (
                    <Form.Check inline key={index} type='checkbox' label={day} checked={checkedDays.includes(day)} onChange={() => handleCheckChange(day)} />
                  ))}
                </Container>
                <Button variant='info' type='submit'>
                  Submit
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='1'>
            <Accordion.Header>Giờ làm trong một ngày</Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleSubmitTime} className='d-flex justify-content-center gap-5'>
                <FloatingLabel className='w-50' label='Giờ bắt đầu'>
                  <Form.Control type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </FloatingLabel>

                <FloatingLabel className='w-50' label='Giờ bắt đầu'>
                  <Form.Control type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </FloatingLabel>

                <Button variant='info' type='submit'>
                  Submit
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>

      <Container className='d-flex justify-content-center p-5 gap-5 flex-wrap'>
        {isLoading ? <CardLoading /> : data.length > 0 ? data.map((item, idx) => <Card key={idx} Title={item.title} Content={item.total} Href={item.link} />) : <div>Chưa có dữ liệu để hiển thị</div>}
      </Container>
    </>
  );
};

export default App;
