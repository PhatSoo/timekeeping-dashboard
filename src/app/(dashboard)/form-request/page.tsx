'use client';
import TableLoading from '@/components/Component.TableLoading';
import { FormRequestContext } from '@/context/FormRequest';
import { IFormRequest } from '@/types/types';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Form, Offcanvas, Row, Table } from 'react-bootstrap';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

const tableColumns = ['#', 'Nhân viên', 'Từ ngày', 'Đến ngày', 'Số ngày nghỉ', 'Trạng thái', 'Lý do'];
const badgeColors = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  DENIED: 'danger',
};

const FormRequest = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState<IFormRequest[]>([]);
  const [filterData, setFilterData] = useState<IFormRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [updateSuccess, setUpdateSuccess] = useState(0);
  const [filter, setFilter] = useState(false);

  const formContext = useContext(FormRequestContext);

  // Get all form-request
  useEffect(() => {
    fetch('api/form-request')
      .then((response) => response.json())
      .then((result) => setData(result.data))
      .finally(() => setIsLoading(false));
  }, [updateSuccess]);

  useEffect(() => {
    const filter = data.filter((item) => item.status === filterStatus);
    setFilterData(filter);
    setFilter(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const countDate = (time1: Date, time2: Date) => {
    const date1 = new Date(time1);
    const date2 = new Date(time2);

    // Đặt thời gian của cả hai ngày về 0:00:00
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    let dayCount = 0;

    if (date1.toDateString() === date2.toDateString()) {
      dayCount = 1;
    } else {
      const timestamp1 = date1.getTime();
      const timestamp2 = date2.getTime();

      const oneDay = 24 * 60 * 60 * 1000; // Số mili giây trong một ngày
      dayCount = Math.abs((timestamp2 - timestamp1) / oneDay) + 1;
    }

    return dayCount;
  };

  const handleFilterChange = (e: { target: { value: string; name: string } }) => {
    const { value, name } = e.target;

    let newFilterStatus = filterStatus;
    let newFilterName = filterName;
    let newFilterDate = filterDate;

    if (name === 'status') {
      newFilterStatus = value;
      setFilterStatus(value);
    } else if (name === 'name') {
      newFilterName = value;
      setFilterName(value);
    } else if (name === 'date') {
      newFilterDate = value;
      setFilterDate(value);
    }

    let filteredData = data;

    if (newFilterStatus !== '') {
      filteredData = filteredData.filter((item) => item.status === newFilterStatus);
    }

    if (newFilterName !== '') {
      filteredData = filteredData.filter((item) => item.employee.name.toLowerCase().includes(newFilterName.toLowerCase()));
    }

    if (newFilterDate !== '') {
      const date = new Date(newFilterDate);
      filteredData = filteredData.filter((item) => {
        const dateStart = new Date(item.startDate);
        dateStart.setHours(0, 0, 0);
        const dateEnd = new Date(item.endDate);
        dateEnd.setHours(23, 59, 59);
        return date >= dateStart && date <= dateEnd;
      });
    }

    setFilterData(filteredData);
    setFilter(true);
  };

  const handleShowInfo = (id: number) => {
    setShowInfo(true);
    setSelectedIdx(id);
  };

  const handleClearFilter = () => {
    setFilter(false);
    setFilterStatus('');
    setFilterDate('');
    setFilterName('');
    setFilterData(data);
  };

  const handleFormRequest = (status: string, id: string) => {
    fetch('api/form-request', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setShowInfo(false);
          toast.success(result.message);
          setUpdateSuccess(updateSuccess + 1);
          setSelectedIdx(-1);
          formContext && formContext.checkPending();
        } else {
          toast.error(result.message);
        }
      });
  };

  const renderFilter = () => {
    return (
      <Row className='mb-3 d-flex justify-content-end align-items-center'>
        <Col md={3}>
          {filter && (
            <Button variant='dark' onClick={handleClearFilter}>
              Clear
            </Button>
          )}
        </Col>
        <Col md={3}>
          <Form.Label>Ngày nghỉ</Form.Label>
          <Form.Control type='date' placeholder='Filter by Date From' name='date' value={filterDate} onChange={handleFilterChange} />
        </Col>

        <Col md={3}>
          <Form.Label>Trạng thái</Form.Label>
          <Form.Control as='select' name='status' value={filterStatus} onChange={handleFilterChange}>
            <option value=''>ALL</option>
            <option value='PENDING'>PENDING</option>
            <option value='ACCEPTED'>ACCEPTED</option>
            <option value='DENIED'>DENIED</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Label>Tên nhân viên</Form.Label>
          <Form.Control type='text' placeholder='Input name here...' name='name' value={filterName} onChange={handleFilterChange} />
        </Col>
      </Row>
    );
  };

  const renderOffCanvas = () => {
    const handleClose = () => {
      setSelectedIdx(-1);
      setShowInfo(false);
    };
    const selectForm = filterData[selectedIdx];

    const remainingRequest = () => {
      return 10 - data.filter((item) => item.employee._id === selectForm.employee._id && item.status === 'ACCEPTED').length;
    };

    return (
      <Offcanvas show={showInfo} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Phê duyệt lịch nghỉ</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='d-flex flex-column justify-content-between'>
          <Container className='d-flex flex-column gap-5'>
            <Container className='border rounded p-3'>
              <h5>Thông tin nhân viên</h5>
              <div className='ms-3'>
                <span className='fw-bold'>Tên: </span>
                {selectForm.employee.name}
              </div>
              <div className='ms-3'>
                <span className='fw-bold'>Email: </span>
                {selectForm.employee.email}
              </div>
            </Container>

            <Container className='border rounded p-3'>
              <h5>Thời gian nghỉ</h5>
              <div className='ms-3'>
                <span className='fw-bold'>Ngày bắt đầu: </span>
                {new Date(selectForm.startDate).toLocaleDateString()}
              </div>
              <div className='ms-3'>
                <span className='fw-bold'>Ngày kết thúc: </span>
                {new Date(selectForm.endDate).toLocaleDateString()}
              </div>
              <div className='ms-3'>
                <span className='fw-bold'>Thời gian nghỉ: </span>
                {countDate(selectForm.startDate, selectForm.endDate)}
              </div>
            </Container>

            <Container className='border rounded p-3'>
              <h5>Thông tin liên quan</h5>
              <div className='ms-3'>
                <span className='fw-bold'>Lý do nghỉ: </span>
                {selectForm.reason}
              </div>
              <div className='ms-3'>
                <span className='fw-bold'>Tổng thời gian đã nghỉ: </span>
                {data.filter((item) => item.employee._id === selectForm.employee._id && item.status === 'ACCEPTED').length}
              </div>
              <div className='ms-3'>
                <span className='fw-bold'>Số ngày phép còn lại: </span>
                {10 - data.filter((item) => item.employee._id === selectForm.employee._id && item.status === 'ACCEPTED').length}
              </div>
            </Container>

            <Container className='text-end'>
              <div>
                <span className='text-primary fs-5'>
                  Tình trạng: <span className='text-danger fst-italic'>{remainingRequest() >= 0 ? 'Có thể nghỉ' : 'Quá ngày phép'}</span>
                </span>
              </div>

              <div>
                <span className='text-dark fw-bold'>Số ngày nghỉ còn lại (nếu được duyệt): {remainingRequest() - countDate(selectForm.startDate, selectForm.endDate)}</span>
              </div>
            </Container>
          </Container>

          <Container className='d-flex flex-column gap-4 my-5'>
            {selectForm.status && (
              <Container className='text-center p-2 rounded' style={{ backgroundColor: 'ButtonHighlight' }}>
                <span className='fw-bold fs-5'>
                  Trạng thái:{' '}
                  <span className='fst-italic' style={selectForm.status === 'ACCEPTED' ? { color: 'green' } : selectForm.status === 'DENIED' ? { color: 'red' } : { color: 'yellow' }}>
                    {selectForm.status}
                  </span>
                </span>
              </Container>
            )}

            <Container className='d-flex gap-3'>
              {new Date(selectForm.startDate) < new Date() ? (
                <Button className='w-100' variant='info' onClick={handleClose}>
                  Đóng
                </Button>
              ) : (
                <>
                  <Button className='w-50' variant='success' onClick={() => handleFormRequest('ACCEPTED', selectForm._id)}>
                    Chấp nhận
                  </Button>
                  <Button className='w-50' variant='danger' onClick={() => handleFormRequest('DENIED', selectForm._id)}>
                    Từ chối
                  </Button>
                </>
              )}
            </Container>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  const renderTable = () => {
    return (
      <Table className='align-middle'>
        <thead>
          <tr>
            <th>#</th>
            <th>Nhân viên</th>
            <th>Từ ngày</th>
            <th>Đến ngày</th>
            <th>Số ngày nghỉ</th>
            <th>Trạng thái</th>
            <th>Lý do</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filterData.length > 0 ? (
            filterData.map((form, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{form.employee.name}</td>
                <td>{new Date(form.startDate).toLocaleDateString()}</td>
                <td>{new Date(form.endDate).toLocaleDateString()}</td>
                <td>{countDate(form.startDate, form.endDate)}</td>
                <td>
                  <Badge bg={badgeColors[form.status as keyof typeof badgeColors]}>{form.status}</Badge>
                </td>
                <td>{form.reason}</td>
                <td>
                  <Button variant='info' onClick={() => handleShowInfo(idx)}>
                    Action <FaArrowAltCircleRight />
                  </Button>
                </td>
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
    <Container>
      <h4 className='text-primary mb-4'>Danh sách các đơn xin nghỉ</h4>
      {renderFilter()}

      {isLoading ? <TableLoading columns={tableColumns} /> : renderTable()}

      {selectedIdx >= 0 && renderOffCanvas()}
    </Container>
  );
};

export default FormRequest;
