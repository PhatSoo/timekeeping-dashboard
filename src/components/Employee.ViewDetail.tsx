'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import avatarDefault from '@/../public/avatar.jpg';
import { IEmployee, IRole } from '@/types/types';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Webcam from 'react-webcam';

interface IProp {
  showModal: boolean;
  handleCloseModal: () => void;
  formData: IEmployee;
  handleChangeFormData: (event: React.ChangeEvent<any>) => void;
}

const EmployeeViewDetail = ({ showModal, handleCloseModal, formData, handleChangeFormData }: IProp) => {
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const [srcValue, setSrcValue] = useState(formData.avatar ? formData.avatar : avatarDefault);
  const [isSelectedFile, setIsSelectedFile] = useState<File>();
  const [resetLoading, setResetLoading] = useState(false);
  const [checkImage, setCheckImage] = useState<{ pass: boolean; message: string } | null>();
  const [isLoading, setLoading] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const isAddNew = formData._id === '';

  const webcamRef = useRef<Webcam>(null);

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
    setCheckImage(null);

    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('File không phải ảnh!');
      } else if (file.size > 10485760) {
        toast.error('File ảnh quá lớn!');
      } else {
        setSrcValue(URL.createObjectURL(event.target.files[0]));
        setIsSelectedFile(event.target.files[0]);
      }
    }
  };

  const handleChangeImage = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isSelectedFile) {
      const data = new FormData();
      data.append('_id', formData._id);
      data.append('avatar', isSelectedFile);

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
    } else {
      toast.error('Bạn chưa chọn ảnh ');
    }
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

  const checkImageQuality = () => {
    setLoading(true);
    setCheckImage(null);
    if (isSelectedFile) {
      const data = new FormData();
      data.append('_id', formData._id);
      data.append('avatar', isSelectedFile);
      fetch('api/upload?checkImage', {
        method: 'POST',
        body: data,
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success) {
            setCheckImage({ pass: true, message: 'Ảnh hợp lệ!' });
          } else {
            setCheckImage({ pass: false, message: 'Ảnh không hợp lệ!' });
          }
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra!');
        })
        .finally(() => setLoading(false));
    } else {
      toast.error('Bạn chưa chọn ảnh!');
    }
  };

  const handleShowCam = () => {
    return (
      <>
        <Webcam />
      </>
    );
  };

  const renderCamera = () => {
    const offCam = () => {
      setShowCam(false);
    };

    const capture = () => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setSrcValue(imageSrc);
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((r) => {
            const file = new File([r], 'image.jpg', { type: 'image/jpeg' });
            setIsSelectedFile(file);
          });
      }
      setShowCam(false);
    };

    return (
      <>
        <Webcam ref={webcamRef} screenshotFormat='image/jpeg' />
        <Container className='d-flex justify-content-center gap-5'>
          <Button className='w-50' variant='info' onClick={capture}>
            Chụp
          </Button>
          <Button className='w-50' variant='danger' onClick={offCam}>
            Hủy
          </Button>
        </Container>
      </>
    );
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

        <Row className='align-items-end gap-1'>
          <Col className='border-end border-3'>
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
                  <Form.Label>SDT</Form.Label>
                  <Form.Control name='phone' type='text' max={10} pattern='\d{10}' required value={formData.phone} onChange={handleChangeFormData} placeholder='Nhập số điện thoại...' />
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
                <Button className='m-auto w-50 mt-3' variant='primary' type='submit'>
                  {isAddNew ? 'Thêm mới' : 'Cập nhật'}
                </Button>
              </Container>
            </Form>
          </Col>

          {!isAddNew && (
            <Col>
              <Form encType='multipart/form-data' onSubmit={handleChangeImage} className='d-flex flex-column justify-content-center align-items-center gap-3'>
                <Container className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                  {showCam ? (
                    renderCamera()
                  ) : (
                    <>
                      <Image src={srcValue} alt='Ảnh' width={350} height={450} />
                      <Form.Control required type='file' accept='image/jpeg, image/png' name='avatar' onChange={handleFileChange} />
                      <Button className='w-100' variant='light' onClick={() => setShowCam(true)}>
                        Chụp ảnh
                      </Button>
                    </>
                  )}
                </Container>
                {isSelectedFile && (
                  <Button onClick={!isLoading ? checkImageQuality : () => {}} variant='secondary'>
                    {isLoading ? 'Loading…' : 'Kiểm tra chất lượng ảnh'}
                  </Button>
                )}
                {checkImage && (
                  <>
                    <p className={`${checkImage.pass ? 'text-success' : 'text-danger'}`}>{checkImage.message}</p>
                    {checkImage.pass && (
                      <Button className='m-auto w-50 mt-3' variant='success' type='submit'>
                        Thay đổi ảnh
                      </Button>
                    )}
                  </>
                )}
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
