'use client';

import { SetStateAction, cloneElement, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Pagination, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { BsFillPlayFill, BsFillStopFill } from 'react-icons/bs';
import { IEmployee, IFulltime, IPartTime } from '@/types/types';

type dataTest = {
  id: number;
  name: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
};

const Attendance = () => {
  const today = new Date().toISOString().split('T')[0];
  const [employeeFull, setEmployeeFull] = useState<IEmployee[]>([]);
  const [employeePart, setEmployeePart] = useState<IEmployee[]>([]);
  const [filterDate, setFilterDate] = useState(today);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');
  const [fulltimeAttendanceData, setFulltimeAttendanceData] = useState<IFulltime[]>([]);
  const [parttimeAttendanceData, setParttimeAttendanceData] = useState<IPartTime[]>([]);

  // Get all full-time employees
  useEffect(() => {
    fetch('api/employee/full-time')
      .then((response) => response.json())
      .then((result) => setEmployeeFull(result.data));
  }, []);

  // Get attendance of Full-time employee by Day
  useEffect(() => {
    fetch(`api/attendance/full?date=${filterDate}`)
      .then((response) => response.json())
      .then((result) => setFulltimeAttendanceData(result.data));
  }, [filterDate]);

  const attendanceFullMap = fulltimeAttendanceData.reduce<{ [key: string]: typeof fulltimeAttendanceData }>((map, attendance) => {
    if (!map[attendance.employeeId]) {
      map[attendance.employeeId] = [];
    }
    map[attendance.employeeId].push(attendance);
    return map;
  }, {});

  // Get all part-time employees
  useEffect(() => {
    fetch('api/employee/part-time')
      .then((response) => response.json())
      .then((result) => setEmployeePart(result.data));
  }, []);

  // Get attendance of Part-time employee by Day
  useEffect(() => {
    fetch(`api/attendance/shift?date=${filterDate}`)
      .then((response) => response.json())
      .then((result) => setParttimeAttendanceData(result.data));
  }, [filterDate]);

  const attendanceShiftMap = parttimeAttendanceData.reduce<{ [key: string]: typeof parttimeAttendanceData }>((map, attendance) => {
    if (!map[attendance.employee]) {
      map[attendance.employee] = [];
    }
    map[attendance.employee].push(attendance);
    return map;
  }, {});

  // const filteredData = fulltimeAttendanceData.filter((attendance) => {
  //   const matchDate = filterDate === '' || attendance.date === filterDate;
  //   const matchStatus = filterStatus === '' || attendance.status === filterStatus;
  //   const matchName = filterName === '' || attendance.name.toLowerCase().includes(filterName.toLowerCase());

  //   return matchDate && matchStatus && matchName;
  // });

  const clearFilter = () => {
    setFilterDate(today);
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
            {employeeFull.length > 0 ? (
              employeeFull.map((employee) => {
                const attendances = attendanceFullMap[employee._id] || [];
                if (attendances.length === 0) {
                  // Nếu nhân viên không có bản ghi điểm danh, hiển thị một hàng với thông tin nhân viên
                  return (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td colSpan={5}>No attendance data</td>
                    </tr>
                  );
                } else {
                  // Nếu nhân viên có bản ghi điểm danh, hiển thị một hàng cho mỗi bản ghi
                  return attendances.map((attendance) => (
                    <tr key={attendance._id}>
                      <td>{employee.name}</td>
                      <td>{new Date(attendance.workDate).toLocaleDateString()}</td>
                      <td>{new Date(attendance.checkInTime).toLocaleTimeString()}</td>
                      <td>{new Date(attendance.checkOutTime).toLocaleTimeString()}</td>
                      <td>{attendance.status}</td>
                      <td>{/* Thêm các hành động của bạn ở đây */}</td>
                    </tr>
                  ));
                }
              })
            ) : (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            )}
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
            {employeePart.length > 0 ? (
              employeePart.map((employee) => {
                const attendances = attendanceShiftMap[employee._id] || [];
                if (attendances.length === 0) {
                  return (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td colSpan={6}>No attendance data</td>
                    </tr>
                  );
                } else {
                  return attendances.map((attendance) => (
                    <tr key={attendance._id}>
                      <td>{employee.name}</td>
                      <td>{new Date(attendance.workDate).toLocaleDateString()}</td>
                      <td>{attendance.workShift.shiftName}</td>
                      <td>{new Date(attendance.checkInTime).toLocaleTimeString()}</td>
                      <td>{new Date(attendance.checkOutTime).toLocaleTimeString()}</td>
                      <td>{attendance.status}</td>
                    </tr>
                  ));
                }
              })
            ) : (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
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
          <Tab eventKey='profile' title='Part-time' onSelect={() => console.log('>>?')}>
            {renderPartTime()}
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
