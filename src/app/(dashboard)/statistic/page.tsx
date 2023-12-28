'use client';

import { IAttendance, IStatistic } from '@/types/types';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import { FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import { toast } from 'react-toastify';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useDownloadExcel } from 'react-export-table-to-excel';

// const currentDate = new Date();
// const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const today = new Date().toISOString().split('T')[0];

const currentDate = new Date();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

const Statistic = () => {
  const [data, setData] = useState<IStatistic[]>([]);
  const [range, setRange] = useState('');
  const [notify, setNotify] = useState(false);
  const [selectedDate, setSelectedDate] = useState([new DateObject(firstDayOfMonth), new DateObject(lastDayOfMonth)]);
  const [selectedMonth, setSelectedMonth] = useState([new DateObject()]);

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `TimeTracking_${new Date(today).toLocaleDateString()}`,
    sheet: 'Thông tin chấm công',
  });

  useEffect(() => {
    const filterType = selectedDate.length > 0 ? 'date' : 'month';
    let start, end;

    if (filterType === 'date') {
      if (selectedDate.length === 2) {
        start = selectedDate[0].format('DD-MM-YYYY');
        end = selectedDate[1].format('DD-MM-YYYY');
      } else if (selectedDate.length === 1) {
        start = end = selectedDate[0].format('DD-MM-YYYY');
      }
    } else {
      if (selectedMonth.length === 2) {
        start = selectedMonth[0].format('MM-YYYY');
        end = selectedMonth[1].format('MM-YYYY');
      } else if (selectedMonth.length === 1) {
        start = end = selectedMonth[0].format('MM-YYYY');
      }
    }

    setRange(`${start} --- ${end}`);
    setNotify(false);

    fetch(`api/statistic?from=${start}&to=${end}&filterType=${filterType}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          toast.error('Some thing went wrong!');
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const calculateStats = (attendance: IAttendance[]) => {
    let totalHours = 0;
    let daysNotWorked = 0;
    let daysOffWithPermission = 0;
    let lateArrivals = 0;
    let earlyDepartures = 0;

    attendance.forEach((record: IAttendance) => {
      // Count total work hours
      if (record.checkIn.time && record.checkOut.time) {
        const workHours = (new Date(record.checkOut.time).getTime() - new Date(record.checkIn.time).getTime()) / (1000 * 60 * 60);

        totalHours += workHours;
      }

      // Count days not work
      if (record.status === 'NULL') {
        daysNotWorked += 1;
      }

      // Count days leave with permission
      if (record.status === 'ON LEAVE') {
        daysOffWithPermission += 1;
      }

      // Count days come late
      if (record.workShift) {
        // Chuyển đổi chuỗi ISO thành đối tượng Date
        const checkInTime = new Date(record.checkIn.time);
        const checkOutTime = new Date(record.checkOut.time);

        // Tạo một đối tượng Date mới từ chuỗi thời gian workShift.startTime
        const workShiftStartTime = new Date();
        workShiftStartTime.setHours(Number(record.workShift.startTime.split(':')[0]));
        workShiftStartTime.setMinutes(Number(record.workShift.startTime.split(':')[1]));

        const workShiftEndTime = new Date();
        workShiftEndTime.setHours(Number(record.workShift.endTime.split(':')[0]));
        workShiftEndTime.setMinutes(Number(record.workShift.endTime.split(':')[1]));

        // So sánh hai thời gian
        if (checkInTime.getHours() > workShiftStartTime.getHours() || (checkInTime.getHours() === workShiftStartTime.getHours() && checkInTime.getMinutes() > workShiftStartTime.getMinutes())) {
          lateArrivals += 1;
        }

        if (checkOutTime.getHours() < workShiftEndTime.getHours() || (checkOutTime.getHours() === workShiftEndTime.getHours() && checkOutTime.getMinutes() < workShiftEndTime.getMinutes())) {
          earlyDepartures += 1;
        }
      }
    });

    // Change type of total work hours
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    const totalWorkingHours = `${hours}h:${minutes < 10 ? '0' : ''}${minutes}m`;

    // Trả về một object chứa các chỉ số tính toán được
    return {
      totalWorkingHours,
      daysNotWorked,
      daysOffWithPermission,
      lateArrivals,
      earlyDepartures,
    };
  };

  const countDateInMonth = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const handleExcelClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // if (new Date(today).getMonth() === new Date().getMonth()) {
    //   setNotify(true);
    // } else {
    //   onDownload();
    // }
    onDownload();
  };

  const renderFilterDate = () => {
    const renderCalendarButtonDateRange = (value: any, openCalendar: any) => {
      return (
        <>
          <Button className='ms-3' variant='warning' onClick={openCalendar}>
            Chọn ngày <FaCalendarCheck />
          </Button>
        </>
      );
    };

    const renderCalendarButtonMonthRange = (value: any, openCalendar: any) => {
      return (
        <>
          <Button className='ms-3' variant='danger' onClick={openCalendar}>
            Chọn tháng <FaCalendarAlt />
          </Button>
        </>
      );
    };

    const handleDateChange = (date: DateObject[]) => {
      setSelectedMonth([]);
      setSelectedDate(date);
      setRange(date ? date.map((d) => d.format('DD-MM-YYYY')).join(' --- ') : '');
    };

    const handleMonthChange = (date: DateObject[]) => {
      setSelectedDate([]);
      setSelectedMonth(date);
      setRange(date ? date.map((d) => d.format('MM-YYYY')).join(' --- ') : '');
    };

    return (
      <Container className='my-3 d-flex'>
        <Container className='d-flex align-items-center justify-content-center'>
          <h5>Chọn ngày để xem</h5>

          <Container>
            <DatePicker render={renderCalendarButtonDateRange} value={selectedDate} onChange={handleDateChange} format='YYYY-MM-DD' calendarPosition='bottom-right' range rangeHover />
            <DatePicker render={renderCalendarButtonMonthRange} value={selectedMonth} onChange={handleMonthChange} format='YYYY-MM' calendarPosition='bottom-right' onlyMonthPicker range />
          </Container>
        </Container>
        <Container className='text-center border rounded border-5 p-3'>
          <h3 className='text-primary fw-bold'>{range}</h3>
        </Container>
      </Container>
    );
  };

  const renderContent = () => {
    return (
      <Container className='border rounded'>
        <Container className='py-3 d-flex justify-content-end align-items-center gap-5'>
          {notify && <Alert variant='danger'>Thông tin tháng này chưa đầy đủ</Alert>}

          <Button variant='success' className='d-flex align-items-center gap-3' onClick={handleExcelClick}>
            <SiMicrosoftexcel size={20} />
            Xuất file Excel
          </Button>
        </Container>
        <Container>
          <Table ref={tableRef}>
            <thead>
              <tr>
                <th className='d-none'>Mã nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Tổng số giờ làm</th>
                <th>Số ngày không đi làm</th>
                <th>Số ngày nghỉ (có phép)</th>
                <th>Số ngày đến trễ</th>
                <th>Số ngày về sớm</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => {
                  const calculate = calculateStats(item.attendances);
                  return (
                    <tr key={idx}>
                      <td className='d-none'>{item.employee._id}</td>
                      <td>{item.employee.name}</td>
                      <td>{calculate.totalWorkingHours}</td>
                      <td>{calculate.daysNotWorked}</td>
                      <td>{calculate.daysOffWithPermission}</td>
                      <td>{calculate.lateArrivals}</td>
                      <td>{calculate.earlyDepartures}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No data loading...</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </Container>
    );
  };

  return (
    <Container className='d-flex flex-column gap-3'>
      {renderFilterDate()}

      {renderContent()}
    </Container>
  );
};

export default Statistic;
