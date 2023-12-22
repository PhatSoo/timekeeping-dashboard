'use client';
import TableLoading from '@/components/Component.TableLoading';
import { IEmployee, ISchedule, IShift } from '@/types/types';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { Accordion, Badge, Button, Col, Container, FloatingLabel, Form, ListGroup, ListGroupItem, Overlay, Row, Stack, Table, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import type { Value } from 'react-multi-date-picker';
import en from 'react-date-object/locales/gregorian_en';
import { FaCalendarCheck } from 'react-icons/fa';

const tableColumns = ['#', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
const today = new Date();
const nextMonday = new Date(today.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7))).toISOString().split('T')[0];
const nextSunday = new Date(today.setDate(today.getDate() + ((0 + 7 - today.getDay()) % 7))).toISOString().split('T')[0];

const shiftColors = ['danger', 'warning', 'info', 'primary', 'secondary', 'success', 'light', 'dark'];
const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const Schedule = () => {
  const [weekRange, setWeekRange] = useState([new DateObject(nextMonday), new DateObject(nextSunday)]);
  const [filterDate, setFilterDate] = useState(nextMonday);
  const [parttimeData, setParttimeData] = useState<IEmployee[]>([]);
  const [workData, setWorkData] = useState<ISchedule[]>([]);
  const [days, setDays] = useState<Date[]>([]);
  const [sPd, setsPd] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowToolTip] = useState(false);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [holidayValue, setHolidayValue] = useState<Value>([]);
  const [shiftColorMap, setShiftColorMap] = useState<{ [key: string]: string }>({});

  const target = useRef(null);

  // Set date for next week
  useEffect(() => {
    let date: Date;
    if (weekRange.length === 0) {
      date = new Date(nextMonday);
    } else {
      date = new Date(weekRange[0].format('YYYY-MM-DD'));
    }
    // const date = new Date(filterDate);
    const monday = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    date.setDate(monday);

    const newDays = Array(7)
      .fill(0)
      .map((_, i) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + i);
        return newDate;
      });

    setDays(newDays);
  }, [weekRange]);

  // Get all part-time employees
  useEffect(() => {
    const now = new Date();
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
    const nextSunday = new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate() + 7);

    setMinDate(nextMonday);
    setMaxDate(nextSunday);

    fetch('/api/employee?isPartTime=1')
      .then((response) => response.json())
      .then((result) => setParttimeData(result.data));

    fetch('/api/shift')
      .then((r) => r.json())
      .then((res) => {
        const data = res.data as IShift[];
        const newShiftColorMap: { [key: string]: string } = {};
        data.forEach((shift, i) => {
          if (!newShiftColorMap[shift._id]) {
            newShiftColorMap[shift._id] = shiftColors[i % shiftColors.length];
          }
        });
        setShiftColorMap(newShiftColorMap);
      });
  }, []);

  // Get all schedules
  useEffect(() => {
    fetch(`/api/schedule?date=${filterDate}`)
      .then((response) => response.json())
      .then((result) => setWorkData(result.data))
      .finally(() => setIsLoading(false));
  }, [filterDate]);

  const handleFilterDateChange = (e: DateObject[]) => {
    const first = new Date(e[0].format('YYYY-MM-DD'));
    first.setDate(first.getDate() + 1);
    const end = new Date(e[1].format('YYYY-MM-DD'));
    end.setDate(end.getDate() + 1);

    e[0].setDate(first);
    e[1].setDate(end);
    setWeekRange(e);
    setFilterDate(e[0].format('YYYY-MM-DD'));
  };

  const handleSchedule = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Kiểm tra xem đến giờ được phép xếp ca chưa ?
    const now = new Date();

    const checkTime = now.getDay() === 0 && now.getHours() >= 16 && now.getMinutes() >= 30;
    // const checkTime = true;

    let holiday: string[] = [];
    if (holidayValue && holidayValue.toString()) {
      holiday = holidayValue.toString().split(',');
    }

    if (filterDate < nextMonday) {
      setShowToolTip(true);
      return;
    }

    if (checkTime) {
      fetch('api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: workData, num: sPd, holidays: holiday }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        });
    } else {
      setShowToolTip(true);
    }
  };

  const renderFilter = () => {
    const renderButton = (value: any, openCalendar: () => void) => {
      return (
        <>
          <Container className='border rounded p-3' onClick={openCalendar}>
            <h5>{value.toString()}</h5>
          </Container>
        </>
      );
    };

    return (
      <Row className='mb-3 d-flex justify-content-center'>
        <Col className='text-center'>
          <DatePicker weekPicker format='MM-DD-YYYY' value={weekRange} onChange={handleFilterDateChange} locale={en} weekStartDayIndex={1} render={renderButton} />
        </Col>
      </Row>
    );
  };

  const renderCalendarButton = (value: any, openCalendar: any) => {
    return (
      <>
        <Button className='ms-3' onClick={openCalendar}>
          <FaCalendarCheck />
        </Button>
      </>
    );
  };

  const renderButton = () => {
    return (
      <Accordion
        onSelect={(key, event) => {
          setsPd(0);
          setShowToolTip(false);
          setHolidayValue([]);
        }}
      >
        <Accordion.Item eventKey='0'>
          <Accordion.Header>Sắp xếp lịch làm việc</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSchedule}>
              <FloatingLabel label='Số lượng nhân viên cho mỗi ca' className='mb-3'>
                <Form.Control type='number' placeholder='1' min={1} value={sPd} onChange={(e) => setsPd(parseInt(e.target.value))} />
              </FloatingLabel>
              <Container>
                <Container className='mb-3'>
                  Chọn ngày nghỉ (nếu có):
                  <DatePicker sort multiple minDate={minDate} maxDate={maxDate} onChange={setHolidayValue} format='MM/DD/YYYY' render={renderCalendarButton} />
                </Container>

                <Container className='p-2 mb-3 border rounded'>
                  <Row>
                    <Col>
                      <h6>Ngày đã chọn:</h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {holidayValue &&
                        holidayValue
                          .toString()
                          .split(',')
                          .map((date, index) => (
                            <Badge key={index} pill bg='danger' className='mx-1'>
                              {date}
                            </Badge>
                          ))}
                    </Col>
                  </Row>
                </Container>
              </Container>
              {showTooltip && (
                <Container className='mb-3'>
                  <span className='text-danger fst-italic'>
                    Thời gian xếp lịch là từ 16h30 ngày Chủ Nhật, và ngày cần xếp lịch phải {'>'}= {nextMonday}
                  </span>
                </Container>
              )}
              <Button ref={target} variant='info' type='submit'>
                Sắp xếp
              </Button>
              <Overlay target={target.current} show={showTooltip} placement='bottom'>
                {(props) => <Tooltip {...props}>Chưa đạt đúng yêu cầu!</Tooltip>}
              </Overlay>
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
                              <Badge key={i} bg={shiftColorMap[shift._id]} pill>
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
