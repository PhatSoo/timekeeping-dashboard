'use client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import avatar from '@/../public/avatar.jpg';
import Image from 'next/image';
import { IEmployee } from '@/types/types';

interface IProp {
  showModal: boolean;
  handleCloseModal: () => void;
  formData: IEmployee;
  handleChangeFormData: (event: { target: { name: any; value: any } }) => void;
}

const EmployeeViewDetail = ({ showModal, handleCloseModal, formData, handleChangeFormData }: IProp) => {
  const isAddNew = formData._id === '';

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý dữ liệu form tại đây
  };

  const handleDelete = () => {
    alert('Bạn có chắc muốn xóa không?');
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>{isAddNew ? 'Thêm mới nhân viên' : 'Cập nhật thông tin nhân viên'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className='d-flex'>
          <Col className='flex-grow-1'>
            <Form onSubmit={handleSubmit} className='d-flex flex-column'>
              <Form.Group className='mb-3'>
                <Form.Label>Họ Tên</Form.Label>
                <Form.Control name='name' type='text' required value={formData.name} onChange={handleChangeFormData} placeholder='Nhập họ và tên nhân viên...' />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control name='email' type='email' required value={formData.email} onChange={handleChangeFormData} placeholder='Nhập email...' />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Check // prettier-ignore
                  name='isPartTime'
                  type='switch'
                  id='isPartTime'
                  label='Nhân viên part-time'
                  checked={formData.isPartTime}
                  onChange={handleChangeFormData}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>CCCD</Form.Label>
                <Form.Control name='CCCD' type='text' pattern='\d{12}' required value={formData.CCCD} onChange={handleChangeFormData} placeholder='Nhập số căn cước công dân...' />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Giới tính</Form.Label>
                <Form.Select name='sex' required value={formData.sex ? '1' : '0'} onChange={handleChangeFormData}>
                  <option value=''>Chọn...</option>
                  <option value='1'>Nam</option>
                  <option value='0'>Nữ</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>Vai trò</Form.Label>
                <Form.Select name='roleId' required>
                  <option value=''>Chọn...</option>
                  {/* Thêm các tùy chọn cho các vai trò khác nhau tại đây */}
                </Form.Select>
              </Form.Group>

              <Button variant='primary' type='submit'>
                {isAddNew ? 'Thêm mới' : 'Cập nhật'}
              </Button>
            </Form>
          </Col>
          <Col className='d-flex flex-column justify-content-center align-items-center gap-3'>
            {!isAddNew && (
              <div className='text-center'>
                <div>Mã nhân viên</div>
                <div className='fw-bold'>{formData._id}</div>
              </div>
            )}
            <div>
              <Image src={formData.avatar ? avatar : avatar} alt='Ảnh' width={300} height={400} />
            </div>
            <div>
              <Button variant='dark'>Thay đổi ảnh</Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {!isAddNew && (
          <Button variant='danger' onClick={handleDelete}>
            Xóa
          </Button>
        )}
        <Button variant='secondary' onClick={handleCloseModal}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeViewDetail;
