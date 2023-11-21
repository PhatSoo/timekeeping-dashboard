'use client';
import { SetStateAction, useState } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';

const FormRequest = () => {
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');

  const handleFilterDateFromChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterDateFrom(e.target.value);
  };

  const handleFilterDateToChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterDateTo(e.target.value);
  };

  const handleFilterStatusChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterNameChange = (e: { target: { value: SetStateAction<string> } }) => {
    setFilterName(e.target.value);
  };

  const renderFilter = () => {
    return (
      <Row className='mb-3 d-flex justify-content-end align-items-center'>
        <Col md={3}>
          <Form.Label>Từ ngày</Form.Label>
          <Form.Control type='date' placeholder='Filter by Date From' value={filterDateFrom} onChange={handleFilterDateFromChange} />
        </Col>
        <Col md={3}>
          <Form.Label>Đến ngày</Form.Label>
          <Form.Control type='date' placeholder='Filter by Date To' value={filterDateTo} onChange={handleFilterDateToChange} />
        </Col>
        <Col md={3}>
          <Form.Label>Trạng thái</Form.Label>
          <Form.Control as='select' value={filterStatus} onChange={handleFilterStatusChange}>
            <option value=''>Choose one</option>
            <option value='Present'>Present</option>
            <option value='Absent'>Absent</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Label>Tên nhân viên</Form.Label>
          <Form.Control type='text' placeholder='Input name here...' value={filterName} onChange={handleFilterNameChange} />
        </Col>
      </Row>
    );
  };

  const renderTable = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Từ ngày</th>
            <th>Đến ngày</th>
            <th>Số ngày nghỉ</th>
            <th>Trạng thái</th>
            <th>Lý do</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <h4 className='text-primary mb-4'>Danh sách các đơn xin nghỉ</h4>
      {renderFilter()}

      {renderTable()}
    </Container>
  );
};

export default FormRequest;
