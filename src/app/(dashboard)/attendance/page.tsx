'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import { IAttendance, IEmployee, ISettings } from '@/types/types';
import TableLoading from '@/components/Component.TableLoading';
import ViewDetailButton from '@/components/Attendance.ViewDetail';
import AttendanceItem from '@/components/Attendance.Percent';
import { toast } from 'react-toastify';

const tableColumns = ['Name', 'Date', 'Check In', 'Check Out', 'Status', 'Action'];
const today = new Date().toISOString().split('T')[0];

const Attendance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadImage, setLoadImage] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fulltimeEmployee, setFulltimeEmployee] = useState<IEmployee[]>([]);
  const [parttimeEmployee, setParttimeEmployee] = useState<IEmployee[]>([]);
  const [filterDate, setFilterDate] = useState(today);
  // const [filterStatus, setFilterStatus] = useState('');
  // const [filterName, setFilterName] = useState('');
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [settings, setSettings] = useState<ISettings>({
    workDate: [],
    workHours: {
      startTime: '',
      endTime: '',
    },
  });

  const [total, setTotal] = useState(0);
  const [countCheck, setCountCheck] = useState(0);
  const [countLate, setCountLate] = useState(0);
  const [countEarly, setCountEarly] = useState(0);
  const [countNone, setCountNone] = useState(0);
  const [countOnLeave, setCountOnLeave] = useState(0);

  // Get all full-time employees for first render
  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      fetch('api/employee?isPartTime=0').then((response) => response.json()),
      fetch('api/employee?isPartTime=1').then((response) => response.json()),
      fetch('api/settings').then((response) => response.json()),
    ])
      .then(([fulltimeResult, parttimeResult, settingsResult]) => {
        setFulltimeEmployee(fulltimeResult.data);
        setParttimeEmployee(parttimeResult.data);
        setSettings(settingsResult.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetch(`api/attendance?date=${filterDate}`)
      .then((r) => r.json())
      .then((res) => {
        setAttendanceData(res.data);
        setTotal(res.total);
        StatusClassification(res.data);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, loadImage]);

  const StatusClassification = (attendances: IAttendance[]) => {
    let check = 0,
      late = 0,
      early = 0,
      none = 0,
      onLeave = 0;

    attendances.forEach((attendance: IAttendance) => {
      let checkInTime = new Date(attendance.checkIn.time);
      let checkOutTime = new Date(attendance.checkOut.time);

      let startTime = attendance.workShift ? attendance.workShift.startTime : settings.workHours.startTime;
      let endTime = attendance.workShift ? attendance.workShift.endTime : settings.workHours.endTime;

      const startTimeDate = new Date(checkInTime.toDateString() + ' ' + startTime);
      const endTimeDate = new Date(checkInTime.toDateString() + ' ' + endTime);

      if (attendance.status === 'NULL') {
        none++;
      } else if (attendance.status === 'ON LEAVE') {
        onLeave++;
      } else {
        if (checkInTime > startTimeDate) {
          late++;
        }
        if (checkOutTime < endTimeDate) {
          early++;
        }
        check++;
      }
    });

    setCountCheck(check);
    setCountLate(late);
    setCountEarly(early);
    setCountNone(none);
    setCountOnLeave(onLeave);
  };

  const attendanceMap = attendanceData.reduce<{ [key: string]: typeof attendanceData }>((map, attendance) => {
    if (!map[attendance.employee._id]) {
      map[attendance.employee._id] = [];
    }
    map[attendance.employee._id].push(attendance);
    return map;
  }, {});

  const handleFilterDateChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterDate(e.target.value);
  };

  const handleLoadAttendanceImage = () => {
    setButtonLoading(true);

    fetch('api/upload')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          setLoadImage((prev) => prev + 1);
        } else {
          toast.error(res.message);
        }
      })
      .finally(() => setButtonLoading(false));
  };

  const renderFilter = () => {
    return (
      <Row className='mb-3 d-flex justify-content-center'>
        <Col md={3}>
          <Form.Control type='date' placeholder='Filter by Date' value={filterDate} onChange={handleFilterDateChange} />
        </Col>
      </Row>
    );
  };

  const renderFullTime = () => {
    return (
      <Container fluid>
        <Table striped bordered hover className='align-middle'>
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
            {fulltimeEmployee.length > 0 ? (
              fulltimeEmployee.map((employee) => {
                const attendances = attendanceMap[employee._id] || [];
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
                      <td>{attendance.checkIn.time ? new Date(attendance.checkIn.time).toLocaleTimeString() : 'N/A'}</td>
                      <td>{attendance.checkOut.time ? new Date(attendance.checkOut.time).toLocaleTimeString() : 'N/A'}</td>
                      <td>{attendance.status}</td>
                      <td className='text-center'>
                        <ViewDetailButton data={attendance} />
                      </td>
                    </tr>
                  ));
                }
              })
            ) : (
              <tr>
                <td colSpan={6}>Chưa có dữ liệu để hiển thị</td>
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
        <Table striped bordered hover className='align-middle'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Shift</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {parttimeEmployee.length > 0 && !isLoading ? (
              parttimeEmployee.map((employee) => {
                const attendances = attendanceMap[employee._id] || [];
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
                      <td>{attendance.workShift?.shiftName}</td>
                      <td>{attendance.checkIn.time ? new Date(attendance.checkIn.time).toLocaleTimeString() : 'N/A'}</td>
                      <td>{attendance.checkOut.time ? new Date(attendance.checkOut.time).toLocaleTimeString() : 'N/A'}</td>
                      <td>{attendance.status}</td>
                      <td className='text-center'>
                        <ViewDetailButton data={attendance} />
                      </td>
                    </tr>
                  ));
                }
              })
            ) : (
              <tr>
                <td colSpan={6}>Chưa có dữ liệu để hiển thị</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    );
  };

  const renderPercent = () => {
    return (
      <Container className='d-flex text-center p-4 border border-5 rounded-pill mb-3'>
        <AttendanceItem title='Đã chấm công' count={countCheck} total={total} color='#00C853' />
        <AttendanceItem title='Đến muộn' count={countLate} total={total} color='#FF9800' />
        <AttendanceItem title='Về sớm' count={countEarly} total={total} color='#F44336' />
        <AttendanceItem title='Nghỉ phép' count={countOnLeave} total={total} color='#87CEFA' />
        <AttendanceItem title='Không đến' count={countNone} total={total} color='#9E9E9E' />
      </Container>
    );
  };

  return (
    <Container fluid className='d-flex flex-column justify-content-between w-100' style={{ minHeight: '100%' }}>
      <div className='py-4'>
        {renderFilter()}

        {renderPercent()}

        <Container className='text-end mb-3 mt-5'>
          <Button onClick={!buttonLoading ? handleLoadAttendanceImage : () => {}} variant='info'>
            {buttonLoading ? (
              <>
                <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
                Loading…
              </>
            ) : (
              'Load ảnh chấm công'
            )}
          </Button>
        </Container>

        <Tabs defaultActiveKey='full-time' className='mb-3' justify>
          <Tab eventKey='full-time' title='Full-time'>
            {isLoading ? <TableLoading columns={tableColumns} /> : renderFullTime()}
          </Tab>
          <Tab eventKey='part-time' title='Part-time'>
            {isLoading ? <TableLoading columns={tableColumns} /> : renderPartTime()}
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default Attendance;
