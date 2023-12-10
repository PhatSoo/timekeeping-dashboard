import { IAttendance } from '@/types/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import { FaArrowCircleRight } from 'react-icons/fa';
import ImageDefault from '@/../public/avatar.jpg';

interface IProps {
  data: IAttendance;
}

const ViewDetailButton = ({ data }: IProps) => {
  const [show, setShow] = useState(false);

  const renderContent = () => {
    return (
      <Container>
        <Container className='border rounded p-5'>
          <h4 className='text-center fw-bold'>Thông tin liên quan</h4>
          <Container className='d-flex gap-5 border-bottom pt-4 ps-5'>
            <h5 className='w-50'>Nhân viên: </h5>
            <h6>{data.employee.name}</h6>
          </Container>
          <Container className='d-flex gap-5 border-bottom pt-4 ps-5'>
            <h5 className='w-50'>Ca làm: </h5>
            <h6>{data.workShift?.shiftName ? data.workShift.shiftName : 'FULL'}</h6>
          </Container>
          <Container className='d-flex gap-5 border-bottom pt-4 ps-5'>
            <h5 className='w-50'>Ngày làm: </h5>
            <h6>{new Date(data.workDate).toLocaleDateString()}</h6>
          </Container>
          <Container className='d-flex gap-5 border-bottom pt-4 pb-3 align-items-center ps-5'>
            <h5 className='w-50'>Ảnh nhân viên:</h5>
            <Image className='rounded-circle border border-5 border-info' src={data.employee.avatar} alt='employee image' width={200} height={200} />
          </Container>
        </Container>

        <Container className='d-flex flex-column mt-5 gap-3 border rounded'>
          <Container className='d-flex'>
            <Container className='d-flex flex-column border-end'>
              <Container className='border-bottom p-3'>
                <h4 className='text-center fw-bold'>Thông tin Check in</h4>
              </Container>
              <Container className='my-3 p-3 text-center'>
                <h5>Ảnh chấm công</h5>
                <Image src={data.checkIn?.image ? data.checkIn.image : ImageDefault} alt='Check in image' width={250} height={400} />
                <h6 className='mt-3 fst-italic'>
                  Score: <span className='text-danger'>{data.checkIn?.score ? data.checkIn.score.toString() : 'Chưa chấm công'}</span>
                </h6>
              </Container>
            </Container>

            <Container className='d-flex flex-column'>
              <Container className='border-bottom p-3 text-center'>
                <h4 className='text-center fw-bold'>Thông tin Check Out</h4>
              </Container>
              <Container className='mt-3 p-3 text-center'>
                <h5>Ảnh chấm công</h5>
                <Image src={data.checkOut.image ? data.checkOut.image : ImageDefault} alt='Check in image' width={250} height={400} />
                <h6 className='mt-3 fst-italic'>
                  Score: <span className='text-danger'>{data.checkOut?.score ? data.checkOut.score.toString() : 'Chưa chấm công'}</span>
                </h6>
              </Container>
            </Container>
          </Container>

          <h6 className='text-center fst-italic'>
            Lưu ý: <span className='text-danger fw-bold'>Điểm số tiến dần về 0, hình ảnh càng trở nên tương đồng. Ngược lại, khi điểm số tiến về 1, hình ảnh càng trở nên khác biệt.</span>
          </h6>
        </Container>
      </Container>
    );
  };

  const renderModal = () => {
    return (
      <Modal show={show} onHide={() => setShow(false)} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>Chi tiết lịch chấm công: {data._id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderContent()}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <Button onClick={() => setShow(true)}>
        View <FaArrowCircleRight />
      </Button>
      {renderModal()}
    </>
  );
};

export default ViewDetailButton;
