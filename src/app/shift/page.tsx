'use client';
import NavbarComponent from '@/components/App.Navbar';
import { IShift } from '@/types/types';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card, FloatingLabel, Form, useAccordionButton } from 'react-bootstrap';

const Shift = () => {
  const [data, setData] = useState<IShift[]>([]);
  const [selectedItem, setSelectedItem] = useState<IShift>();
  const [isAddNew, setIsAddNew] = useState(false);
  const [editableCardIdx, setEditableCardIdx] = useState(-1);
  const [formData, setFormData] = useState<IShift>({
    _id: '',
    shiftName: '',
    startTime: '',
    endTime: '',
  });

  // Get all shifts
  useEffect(() => {
    fetch('api/shift')
      .then((response) => response.json())
      .then((result) => setData(result.data));
  }, []);

  function CustomToggle({ eventKey }: any) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setFormData({
        _id: '',
        shiftName: '',
        startTime: '',
        endTime: '',
      });
      setIsAddNew(!isAddNew);
      if (editableCardIdx > -1) {
        setEditableCardIdx(-1);
      }
    });

    return (
      <Button variant={isAddNew ? 'secondary' : 'info'} onClick={decoratedOnClick}>
        {isAddNew ? 'Cancel' : 'New'}
      </Button>
    );
  }

  const handleChangeFormData = (event: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddNew = () => {};

  const renderAddNew = () => {
    return (
      <div className='my-2 text-end'>
        <Accordion>
          <Card>
            <Card.Header>
              <CustomToggle eventKey='0' />
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <div className='d-flex w-100 justify-content-between align-items-center'>
                  <FloatingLabel label='Tên ca làm' className='mb-3'>
                    <Form.Control type='text' name='shiftName' placeholder='name@example.com' value={formData?.shiftName} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <FloatingLabel label='Giờ bắt đầu' className='mb-3'>
                    <Form.Control type='time' name='startTime' placeholder='12:00' value={formData?.startTime} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <FloatingLabel label='Giờ kết thúc'>
                    <Form.Control type='time' name='endTime' placeholder='08:00' value={formData?.endTime} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <Button variant='success' onClick={handleAddNew}>
                    Create
                  </Button>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  };

  const renderCard = () => {
    const handleEditClick = (idx: number) => {
      setEditableCardIdx(idx); // Xác định card đang được chỉnh sửa
      if (data) {
        setSelectedItem(data[idx]);
      }
    };

    const handleDeleteClick = (idx: number) => {
      // Handle delete functionality here
    };

    const handleSaveChanges = () => {
      setEditableCardIdx(-1);
    };

    const handleCancelChange = () => {
      setEditableCardIdx(-1);
    };

    return (
      <div className='d-flex gap-5 mt-5 flex-wrap justify-content-center align-items-center'>
        {data?.map((item, idx) => (
          <Card key={idx}>
            {editableCardIdx === idx ? ( // Kiểm tra xem card có đang được chỉnh sửa hay không
              <Card.Body>
                {/* Giao diện chỉnh sửa */}
                <div>
                  <FloatingLabel label='Tên ca làm' className='mb-3'>
                    <Form.Control type='text' name='shiftName' placeholder='name@example.com' value={selectedItem?.shiftName} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <FloatingLabel label='Giờ bắt đầu' className='mb-3'>
                    <Form.Control type='time' name='startTime' placeholder='12:00' value={selectedItem?.startTime} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <FloatingLabel label='Giờ kết thúc' className='mb-3'>
                    <Form.Control type='time' name='endTime' placeholder='17:00' value={selectedItem?.endTime} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  {/* Thêm các trường thông tin chỉnh sửa khác tương tự */}
                </div>
                <div className='mt-4 d-flex gap-2'>
                  <Button variant='success' onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                  <Button variant='secondary' onClick={handleCancelChange}>
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            ) : (
              // Hiển thị thông tin card bình thường nếu không đang chỉnh sửa
              <Card.Body>
                <Card.Header as='h5'>{item.shiftName}</Card.Header>
                <Card.Title>Thông tin ca làm việc</Card.Title>
                <Card.Text className='d-flex flex-column'>
                  <span>
                    <i>Giờ bắt đầu:</i> <b>{item.startTime}</b>
                  </span>
                  <span>
                    <i>Giờ kết thúc:</i> <b>{item.endTime}</b>
                  </span>
                </Card.Text>
                <div className='d-flex justify-content-center gap-2'>
                  <Button variant='warning' onClick={() => handleEditClick(idx)}>
                    Edit
                  </Button>
                  <Button variant='danger' onClick={() => handleDeleteClick(idx)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <NavbarComponent />

      {renderAddNew()}

      {data?.length > 0 ? renderCard() : 'Loading...'}
    </>
  );
};

export default Shift;
