'use client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import avatarDefault from '@/../public/avatar.jpg';
import { IEmployee, IRole } from '@/types/types';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface IProp {
  showModal: boolean;
  handleCloseModal: () => void;
  formData: IEmployee;
  handleChangeFormData: (event: React.ChangeEvent<any>) => void;
}

const EmployeeViewDetail = ({ showModal, handleCloseModal, formData, handleChangeFormData }: IProp) => {
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const avatarLink = `${process.env.API_SERVER}/${process.env.AVATAR_STORE}/${formData.avatar}`;
  const [srcValue, setSrcValue] = useState(formData.avatar ? avatarLink : avatarDefault);
  const [isSelectedFile, setIsSelectedFile] = useState<File>();
  const [resetLoading, setResetLoading] = useState(false);
  const isAddNew = formData._id === '';

  useEffect(() => {
    fetch('api/role')
      .then((response) => response.json())
      .then((result) => setRoleList(result.data));
  }, []);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const data = isAddNew ? (({ _id, ...rest }) => rest)(formData) : formData;
    const method = isAddNew ? 'POST' : 'PUT';

    fetch('api/employee', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          handleCloseModal();
        } else {
          toast.error(result.message);
        }
      });
  };

  const handleDeleteClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const confirmation = confirm('Bạn có chắc muốn xóa không?');
    if (confirmation) {
      fetch('api/employee', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [formData._id],
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            toast.success(result.message);
            handleCloseModal();
          } else {
            toast.error(result.message);
          }
        });
    }
  };

  const handleFileChange = (event: { target: any; preventDefault: () => void }) => {
    if (event.target.files && event.target.files[0]) {
      setSrcValue(URL.createObjectURL(event.target.files[0]));
      setIsSelectedFile(event.target.files[0]);
    }
  };

  const handleChangeImage = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const data = new FormData();

    data.append('_id', formData._id);

    if (isSelectedFile) {
      data.append('avatar', isSelectedFile);
    }

    fetch('api/upload', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          handleCloseModal();
        } else {
          toast.error(result.message);
        }
      });
  };

  const handleResetPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setResetLoading(true);
    fetch('api/employee', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: formData._id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      })
      .finally(() => setResetLoading(false));
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered {...(!isAddNew && { size: 'lg' })}>
      <Modal.Header closeButton>
        <Modal.Title>{isAddNew ? 'Thêm mới nhân viên' : 'Cập nhật thông tin nhân viên'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isAddNew && (
          <Container className='text-center'>
            <Container>Mã nhân viên</Container>
            <Container className='fw-bold'>{formData._id}</Container>
          </Container>
        )}

        <Row className='align-items-end'>
          <Col>
            <Form onSubmit={handleSubmit}>
              <Container className='d-flex flex-column'>
                <Form.Group className='mb-3'>
                  <Form.Label>Họ Tên</Form.Label>
                  <Form.Control name='name' type='text' required value={formData.name} onChange={handleChangeFormData} placeholder='Nhập họ và tên nhân viên...' />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name='email' type='email' required value={formData.email} onChange={handleChangeFormData} placeholder='Nhập email...' />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Check name='isPartTime' type='switch' label='Làm việc part-time' checked={formData.isPartTime} onChange={handleChangeFormData} />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>CCCD</Form.Label>
                  <Form.Control name='CCCD' type='text' max={12} pattern='\d{12}' required value={formData.CCCD} onChange={handleChangeFormData} placeholder='Nhập số căn cước công dân...' />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select name='sex' required value={formData.sex ? 1 : 0} onChange={handleChangeFormData}>
                    <option value=''>Chọn...</option>
                    <option value={1}>Nam</option>
                    <option value={0}>Nữ</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select name='role' required value={formData.role._id} onChange={handleChangeFormData}>
                    <option value=''>Chọn...</option>
                    {roleList &&
                      roleList.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.typeName}
                        </option>
                      ))}
                  </Form.Select>
                  {isAddNew ? (
                    <span className='text-danger fst-italic'>* Chú ý: Mật khẩu mặc định là `123456789`</span>
                  ) : (
                    <Container className='mt-3 d-flex justify-content-center'>
                      {resetLoading ? (
                        <Button variant='info' disabled>
                          <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
                          Loading...
                        </Button>
                      ) : (
                        <Button variant='info' onClick={handleResetPassword}>
                          Reset Password!
                        </Button>
                      )}
                    </Container>
                  )}
                </Form.Group>
                <Button onClick={handleResetPassword} className='m-auto w-50 mt-3' variant='primary' type='submit'>
                  {isAddNew ? 'Thêm mới' : 'Cập nhật'}
                </Button>
              </Container>
            </Form>
          </Col>

          {!isAddNew && (
            <Col>
              <Form encType='multipart/form-data' onSubmit={handleChangeImage} className='d-flex flex-column justify-content-center align-items-center gap-3'>
                <Container className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                  <Image src={srcValue} alt='Ảnh' width={300} height={400} />

                  <Form.Control required type='file' name='avatar' onChange={handleFileChange} />
                </Container>
                <Button className='m-auto w-50 mt-3' variant='warning' type='submit'>
                  Thay đổi ảnh
                </Button>
              </Form>
            </Col>
          )}
        </Row>
      </Modal.Body>

      <Modal.Footer>
        {!isAddNew && (
          <Button variant='danger' onClick={handleDeleteClick}>
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
