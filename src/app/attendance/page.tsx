'use client';

import { SetStateAction, cloneElement, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';

const Attendance = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');
  // Giả sử dữ liệu chấm công của tất cả nhân viên
  const employeeAttendanceData = [
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

  const filteredData = employeeAttendanceData.filter((attendance) => {
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
      <Container className='border mb-3 rounded'>
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
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeAttendanceData.map((attendance) => (
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
    return <Container>Part Time Attendance</Container>;
  };

  const renderSchedule = () => {
    return <Container>Part Time Schedule</Container>;
  };

  return (
    <div className='d-flex flex-column justify-content-between' style={{ minHeight: '100%' }}>
      <Container className='py-4'>
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
      </Container>

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
    </div>
  );
};

export default Attendance;
