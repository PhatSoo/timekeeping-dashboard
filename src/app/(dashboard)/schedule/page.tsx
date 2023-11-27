'use client';
import TableLoading from '@/components/Component.TableLoading';
import { IEmployee, ISchedule, IShift } from '@/types/types';
import React, { SetStateAction, useEffect, useState } from 'react';
import { Accordion, Badge, Button, Col, Container, FloatingLabel, Form, Row, Stack, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const tableColumns = ['#', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

const Schedule = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');
  const [parttimeData, setParttimeData] = useState<IEmployee[]>([]);
  const [workData, setWorkData] = useState<ISchedule[]>([]);
  const [days, setDays] = useState<Date[]>([]);
  const [sPd, setsPd] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Set date for next week
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // next Monday
    // date.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) - 7); // last Monday

    const newDays = Array(7)
      .fill(0)
      .map((_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + i);
        return newDate;
      });

    setDays(newDays);
  }, []);

  // Get all part-time employees
  useEffect(() => {
    fetch('/api/employee/part-time')
      .then((res) => res.json())
      .then((data) => setParttimeData(data.data));
  }, []);

  // Get all schedules
  useEffect(() => {
    fetch('/api/schedule')
      .then((res) => res.json())
      .then((data) => setWorkData(data.data))
      .finally(() => setIsLoading(false));
  }, []);

  const clearFilter = () => {
    setFilterDate('');
    setFilterStatus('');
    setFilterName('');
  };

  const handleFilterDateChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterDate(e.target.value);
  };

  const handleFilterStatusChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterNameChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterName(e.target.value);
  };

  const shiftColors = ['danger', 'warning', 'info', 'primary', 'secondary', 'success', 'light', 'dark'];

  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // const workData = [
  //   {
  //     _id: '6549aca0b4f04ebcde365500',
  //     employee: {
  //       _id: '652919565281b232096b3e8f',
  //       name: 'Tran Thi B',
  //     },
  //     workDate: '2023-11-13T00:00:00.000Z',
  //     workShift: [
  //       {
  //         _id: '6528ea8275292954d4e3f3f5',
  //         shiftName: 'Ca sáng',
  //       },
  //       {
  //         _id: '654891fb7ab62b993ca966e3',
  //         shiftName: 'Ca tối',
  //       },
  //     ],
  //     __v: 0,
  //     createdAt: '2023-11-07T03:18:56.681Z',
  //     updatedAt: '2023-11-07T03:18:56.681Z',
  //   },
  //   {
  //     _id: '6549aca0b4f04ebcde365502',
  //     employee: {
  //       _id: '652919565281b232096b3e8f',
  //       name: 'Tran Thi B',
  //     },
  //     workDate: '2023-11-16T00:00:00.000Z',
  //     workShift: [
  //       {
  //         _id: '652919d55281b232096b3e9e',
  //         shiftName: 'Ca chiều',
  //       },
  //       {
  //         _id: '654891fb7ab62b993ca966e3',
  //         shiftName: 'Ca tối',
  //       },
  //     ],
  //     __v: 0,
  //     createdAt: '2023-11-07T03:18:56.681Z',
  //     updatedAt: '2023-11-07T03:18:56.681Z',
  //   },
  //   {
  //     _id: '654c8fb1bbb4b04aeabeffb4',
  //     employee: {
  //       _id: '652919615281b232096b3e95',
  //       name: 'Pham Thi Test',
  //     },
  //     workDate: '2023-11-16T00:00:00.000Z',
  //     workShift: [
  //       {
  //         _id: '6528ea8275292954d4e3f3f5',
  //         shiftName: 'Ca sáng',
  //       },
  //       {
  //         _id: '652919d55281b232096b3e9e',
  //         shiftName: 'Ca chiều',
  //       },
  //       {
  //         _id: '654891fb7ab62b993ca966e3',
  //         shiftName: 'Ca tối',
  //       },
  //     ],
  //     __v: 0,
  //     createdAt: '2023-11-09T07:52:17.364Z',
  //     updatedAt: '2023-11-09T07:52:17.364Z',
  //   },
  //   {
  //     _id: '6552eced102b24e4e6e6e2e9',
  //     employee: {
  //       _id: '652919565281b232096b3e8f',
  //       name: 'Tran Thi B',
  //     },
  //     workDate: '2023-11-14T00:00:00.000Z',
  //     workShift: [
  //       {
  //         _id: '6528ea8275292954d4e3f3f5',
  //         shiftName: 'Ca sáng',
  //       },
  //     ],
  //     __v: 0,
  //     createdAt: '2023-11-14T03:43:41.618Z',
  //     updatedAt: '2023-11-14T03:43:41.618Z',
  //   },
  //   {
  //     _id: '6552eced102b24e4e6e6e2ea',
  //     employee: {
  //       _id: '652919565281b232096b3e8f',
  //       name: 'Tran Thi B',
  //     },
  //     workDate: '2023-11-16T00:00:00.000Z',
  //     workShift: [
  //       {
  //         _id: '652919d55281b232096b3e9e',
  //         shiftName: 'Ca chiều',
  //       },
  //       {
  //         _id: '654891fb7ab62b993ca966e3',
  //         shiftName: 'Ca tối',
  //       },
  //     ],
  //     __v: 0,
  //     createdAt: '2023-11-14T03:43:41.618Z',
  //     updatedAt: '2023-11-14T03:43:41.618Z',
  //   },
  // ];

  const handleSchedule = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: workData, num: sPd }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
  };

  const renderFilter = () => {
    return (
      <Row className='mb-3 d-flex justify-content-end'>
        <Col md={3}>
          <Form.Control type='date' placeholder='Filter by Date' value={filterDate} onChange={handleFilterDateChange} />
        </Col>
        <Col md={3}>
          <Form.Control as='select' value={filterStatus} onChange={handleFilterStatusChange}>
            <option value=''>Filter by Status</option>
            <option value='Present'>Present</option>
            <option value='Absent'>Absent</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Control type='text' placeholder='Filter by Employee Name' value={filterName} onChange={handleFilterNameChange} />
        </Col>
      </Row>
    );
  };

  const renderButton = () => {
    return (
      <Accordion onSelect={(key, event) => setsPd(0)}>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>Sắp xếp lịch làm việc</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSchedule}>
              <FloatingLabel label='Số lượng nhân viên cho mỗi ca' className='mb-3'>
                <Form.Control type='number' placeholder='1' min={1} value={sPd} onChange={(e) => setsPd(parseInt(e.target.value))} />
              </FloatingLabel>

              <Button variant='info' type='submit'>
                Sắp xếp
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const renderTable = () => {
    return (
      <Table striped bordered hover className='align-middle text-center mt-5' style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>#</th>
            {days.map((day, index) => (
              <th key={index}>
                {dayNames[day.getDay()]}
                <br />
                {day.getDate()}/{day.getMonth() + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parttimeData.length > 0 ? (
            parttimeData.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                {days.map((day, index) => {
                  const workDay = workData.find((data) => data.employee._id === employee._id && new Date(data.workDate).toDateString() === day.toDateString());
                  return (
                    <td key={index}>
                      <Stack gap={2}>
                        {workDay
                          ? workDay.workShift.map((shift, i) => (
                              <Badge key={i} bg={shiftColors[i]} pill>
                                {shift.shiftName}
                              </Badge>
                            ))
                          : 'N/A'}
                      </Stack>
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableColumns.length}>Chưa có dữ liệu để hiển thị</td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <Container fluid>
      {renderFilter()}
      {renderButton()}
      {isLoading ? <TableLoading columns={tableColumns} /> : renderTable()}
    </Container>
  );
};

export default Schedule;
