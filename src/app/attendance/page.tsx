'use client';

import { SetStateAction, cloneElement, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';
import { IFulltime, IPartTime } from '@/types/types';

type dataTest = {
  id: number;
  name: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
};

const Attendance = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');
  const [fulltimeAttendanceData, setFulltimeAttendanceData] = useState<dataTest[]>([]);
  const [parttimeData, setParttimeData] = useState([]);
  const [days, setDays] = useState<Date[]>([]);

  // Set date for next week
  useEffect(() => {
    const date = new Date();
    // date.setDate(date.getDate() + 7 - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // next Monday
    date.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) - 7); // last Monday

    const newDays = Array(7)
      .fill(0)
      .map((_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + i);
        return newDate;
      });

    setDays(newDays);
    console.log('====================================');
    console.log('newDays', newDays);
    console.log('====================================');
  }, []);
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // Get employees full-time attendance
  useEffect(() => {
    const dataAPI = [
      {
        id: 1,
        name: 'John Doe',
        date: '2023-11-15',
        clockIn: '08:00',
        clockOut: '17:00',
        status: 'Present',
      },
      {
        id: 2,
        name: 'Alice Smith',
        date: '2023-11-15',
        clockIn: '08:30',
        clockOut: '16:45',
        status: 'Present',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        date: '2023-11-15',
        clockIn: '09:00',
        clockOut: '17:30',
        status: 'Present',
      },
      {
        id: 4,
        name: 'Emily Davis',
        date: '2023-11-16',
        clockIn: '08:15',
        clockOut: '17:15',
        status: 'Present',
      },
      // Thêm dữ liệu cho các nhân viên khác nếu cần
    ];

    setFulltimeAttendanceData(dataAPI);
  }, []);

  // Get all part-time employees
  useEffect(() => {
    const parttimeAPI = [
      { name: 'Nguyễn Văn A', _id: '652919565281b232096b3e8f' },
      { name: 'Trần Thị B', _id: '652919615281b232096b3e95' },
      { name: 'Lê Văn C', _id: '' },
      { name: 'Phạm Thị D', _id: '' },
      { name: 'Hoàng Văn E', _id: '' },
    ];
    setParttimeData(parttimeAPI);
  }, []);

  const filteredData = fulltimeAttendanceData.filter((attendance) => {
    const matchDate = filterDate === '' || attendance.date === filterDate;
    const matchStatus = filterStatus === '' || attendance.status === filterStatus;
    const matchName = filterName === '' || attendance.name.toLowerCase().includes(filterName.toLowerCase());

    return matchDate && matchStatus && matchName;
  });

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

  const renderCurrentShift = () => {
    const MyCol = ({ icon, time, label, color, bgColor }: any) => {
      return (
        <Col className='d-flex flex-column align-items-center my-3 gap-2'>
          <Row className='d-flex justify-content-center align-items-center' style={{ backgroundColor: bgColor, borderRadius: '50%', width: '50px', height: '50px' }}>
            {cloneElement(icon, { color })}
          </Row>
          <Row className='fw-bold'>{time}</Row>
          <Row className='text-secondary'>{label}</Row>
        </Col>
      );
    };

    return (
      <Container fluid className='border mb-3 rounded'>
        <Row>
          <MyCol icon={<FaCalendarAlt />} time='Ca sáng' label='Ca hiện tại' color='#FF6347' bgColor='#FFDAB9' />
          <MyCol icon={<BsFillPlayFill />} time='08:00' label='Giờ bắt đầu' color='#6A5ACD' bgColor='#E6E6FA' />
          <MyCol icon={<BsFillStopFill />} time='12:00' label='Giờ kết thúc' color='#2E8B57' bgColor='#98FB98' />
        </Row>
      </Container>
    );
  };

  const renderFullTime = () => {
    return (
      <Container fluid>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fulltimeAttendanceData.map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.name}</td>
                <td>{attendance.date}</td>
                <td>{attendance.clockIn}</td>
                <td>{attendance.clockOut}</td>
                <td>{attendance.status}</td>
                <td>
                  <Button variant='primary'>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  };

  const renderPartTime = () => {
    return (
      <Container fluid>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Shift</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fulltimeAttendanceData.map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.name}</td>
                <td>{attendance.date}</td>
                <td>Ca chiều</td>
                <td>{attendance.clockIn}</td>
                <td>{attendance.clockOut}</td>
                <td>{attendance.status}</td>
                <td>
                  <Button variant='primary'>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  };

  const workData = [
    {
      _id: '6549aca0b4f04ebcde365500',
      employee: {
        _id: '652919565281b232096b3e8f',
        name: 'Tran Thi B',
      },
      workDate: '2023-11-13T00:00:00.000Z',
      workShift: [
        {
          _id: '6528ea8275292954d4e3f3f5',
          shiftName: 'Ca sáng',
        },
        {
          _id: '654891fb7ab62b993ca966e3',
          shiftName: 'Ca tối',
        },
      ],
      __v: 0,
      createdAt: '2023-11-07T03:18:56.681Z',
      updatedAt: '2023-11-07T03:18:56.681Z',
    },
    {
      _id: '6549aca0b4f04ebcde365502',
      employee: {
        _id: '652919565281b232096b3e8f',
        name: 'Tran Thi B',
      },
      workDate: '2023-11-16T00:00:00.000Z',
      workShift: [
        {
          _id: '652919d55281b232096b3e9e',
          shiftName: 'Ca chiều',
        },
        {
          _id: '654891fb7ab62b993ca966e3',
          shiftName: 'Ca tối',
        },
      ],
      __v: 0,
      createdAt: '2023-11-07T03:18:56.681Z',
      updatedAt: '2023-11-07T03:18:56.681Z',
    },
    {
      _id: '654c8fb1bbb4b04aeabeffb4',
      employee: {
        _id: '652919615281b232096b3e95',
        name: 'Pham Thi Test',
      },
      workDate: '2023-11-16T00:00:00.000Z',
      workShift: [
        {
          _id: '6528ea8275292954d4e3f3f5',
          shiftName: 'Ca sáng',
        },
        {
          _id: '652919d55281b232096b3e9e',
          shiftName: 'Ca chiều',
        },
        {
          _id: '654891fb7ab62b993ca966e3',
          shiftName: 'Ca tối',
        },
      ],
      __v: 0,
      createdAt: '2023-11-09T07:52:17.364Z',
      updatedAt: '2023-11-09T07:52:17.364Z',
    },
    {
      _id: '6552eced102b24e4e6e6e2e9',
      employee: {
        _id: '652919565281b232096b3e8f',
        name: 'Tran Thi B',
      },
      workDate: '2023-11-14T00:00:00.000Z',
      workShift: [
        {
          _id: '6528ea8275292954d4e3f3f5',
          shiftName: 'Ca sáng',
        },
      ],
      __v: 0,
      createdAt: '2023-11-14T03:43:41.618Z',
      updatedAt: '2023-11-14T03:43:41.618Z',
    },
    {
      _id: '6552eced102b24e4e6e6e2ea',
      employee: {
        _id: '652919565281b232096b3e8f',
        name: 'Tran Thi B',
      },
      workDate: '2023-11-16T00:00:00.000Z',
      workShift: [
        {
          _id: '652919d55281b232096b3e9e',
          shiftName: 'Ca chiều',
        },
        {
          _id: '654891fb7ab62b993ca966e3',
          shiftName: 'Ca tối',
        },
      ],
      __v: 0,
      createdAt: '2023-11-14T03:43:41.618Z',
      updatedAt: '2023-11-14T03:43:41.618Z',
    },
  ];

  const shiftColors = {
    'Ca sáng': 'lightblue',
    'Ca chiều': 'lightgreen',
    'Ca tối': 'lightcoral',
  };

  const renderSchedule = () => {
    return (
      <Container fluid>
        <Table striped bordered hover className='align-middle text-center' style={{ tableLayout: 'fixed' }}>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parttimeData.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                {days.map((day, index) => {
                  const workDay = workData.find((data) => data.employee._id === employee._id && new Date(data.workDate).toDateString() === day.toDateString());
                  return (
                    <td key={index}>
                      {workDay
                        ? workDay.workShift.map((shift, i) => (
                            <Container key={i} style={{ backgroundColor: shiftColors[shift.shiftName] }} className='rounded my-2'>
                              {shift.shiftName}
                            </Container>
                          ))
                        : 'N/A'}
                    </td>
                  );
                })}
                <td>
                  <Button variant='primary'>Action 1</Button> <Button variant='secondary'>Action 2</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  };

  return (
    <Container fluid className='d-flex flex-column justify-content-between w-100' style={{ minHeight: '100%' }}>
      <div className='py-4'>
        {renderFilter()}

        {renderCurrentShift()}

        <Tabs defaultActiveKey='home' id='justify-tab-example' className='mb-3' justify onSelect={clearFilter}>
          <Tab eventKey='home' title='Full-time'>
            {renderFullTime()}
          </Tab>
          <Tab eventKey='profile' title='Part-time'>
            {renderPartTime()}
          </Tab>
          <Tab eventKey='longer-tab' title='Schedule'>
            {renderSchedule()}
          </Tab>
        </Tabs>
      </div>

      <Pagination className='d-flex justify-content-end'>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Ellipsis />

        <Pagination.Item>{10}</Pagination.Item>
        <Pagination.Item>{11}</Pagination.Item>
        <Pagination.Item active>{12}</Pagination.Item>
        <Pagination.Item>{13}</Pagination.Item>
        <Pagination.Item disabled>{14}</Pagination.Item>

        <Pagination.Ellipsis />
        <Pagination.Item>{20}</Pagination.Item>
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    </Container>
  );
};

export default Attendance;
