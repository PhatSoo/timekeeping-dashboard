'use client';
import NavbarComponent from '@/components/App.Navbar';
import CardLoading from '@/components/Component.CardLoading';
import ConfirmModal from '@/components/Component.ConfirmModal';
import { IShift } from '@/types/types';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card, FloatingLabel, Form, useAccordionButton } from 'react-bootstrap';
import { toast } from 'react-toastify';

const nullData = {
  shiftName: '',
  startTime: '',
  endTime: '',
};

const Shift = () => {
  const [data, setData] = useState<IShift[]>([]);
  const [selectedItem, setSelectedItem] = useState<IShift>({
    _id: '',
    shiftName: '',
    startTime: '',
    endTime: '',
  });
  const [isAddNew, setIsAddNew] = useState(false);
  const [editableCardIdx, setEditableCardIdx] = useState(-1);
  const [formDataAdd, setFormDataAdd] = useState(nullData);
  const [success, setSuccess] = useState(0);
  const [deleteItemId, setDeleteItemId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleConfirmModal = () => {
    fetch('api/shift', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteItemId }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          setSuccess(success + 1);
          setShowModal(false);
        } else {
          toast.error(result.message);
        }
      });
  };

  // Get all shifts
  useEffect(() => {
    fetch('api/shift')
      .then((response) => response.json())
      .then((result) => setData(result.data))
      .finally(() => setIsLoading(false));
  }, [success]);

  function CustomToggle({ eventKey }: any) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setFormDataAdd(nullData);
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
    setFormDataAdd({
      ...formDataAdd,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeFormEdit = (event: { target: { name: any; value: any } }) => {
    setSelectedItem({
      ...selectedItem,
      [event?.target.name]: event?.target.value,
    });
  };

  const handleAddNew = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/shift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataAdd),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          setFormDataAdd(nullData);
          setSuccess(success + 1);
        } else {
          toast.error(result.message);
        }
      });
  };

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
                <Form onSubmit={handleAddNew} className='d-flex w-100 justify-content-between align-items-center'>
                  <FloatingLabel label='Tên ca làm' className='mb-3'>
                    <Form.Control required type='text' name='shiftName' placeholder='name@example.com' value={formDataAdd?.shiftName} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <FloatingLabel label='Giờ bắt đầu' className='mb-3'>
                    <Form.Control required type='time' name='startTime' placeholder='12:00' value={formDataAdd?.startTime} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <FloatingLabel label='Giờ kết thúc'>
                    <Form.Control required type='time' name='endTime' placeholder='08:00' value={formDataAdd?.endTime} onChange={handleChangeFormData} />
                  </FloatingLabel>
                  <Button variant='success' type='submit'>
                    Create
                  </Button>
                </Form>
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

    const handleDeleteClick = (idx: string) => {
      setDeleteItemId(idx);
      setShowModal(true);
    };

    const handleSaveChanges = () => {
      fetch('api/shift', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedItem),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            toast.success(result.message);
            setSuccess(success + 1);
            setEditableCardIdx(-1);
          } else {
            toast.error(result.message);
          }
        });
    };

    const handleCancelChange = () => {
      setEditableCardIdx(-1);
    };

    return (
      <>
        {data.map((item, idx) => (
          <Card key={idx}>
            {editableCardIdx === idx ? ( // Kiểm tra xem card có đang được chỉnh sửa hay không
              <Card.Body>
                <Form>
                  <div>
                    <FloatingLabel label='Tên ca làm' className='mb-3'>
                      <Form.Control required type='text' name='shiftName' placeholder='name@example.com' value={selectedItem?.shiftName} onChange={handleChangeFormEdit} />
                    </FloatingLabel>
                    <FloatingLabel label='Giờ bắt đầu' className='mb-3'>
                      <Form.Control required type='time' name='startTime' placeholder='12:00' value={selectedItem?.startTime} onChange={handleChangeFormEdit} />
                    </FloatingLabel>
                    <FloatingLabel label='Giờ kết thúc' className='mb-3'>
                      <Form.Control required type='time' name='endTime' placeholder='17:00' value={selectedItem?.endTime} onChange={handleChangeFormEdit} />
                    </FloatingLabel>
                  </div>
                  <div className='mt-4 d-flex gap-2'>
                    <Button variant='success' type='submit' onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                    <Button variant='secondary' type='submit' onClick={handleCancelChange}>
                      Cancel
                    </Button>
                  </div>
                </Form>
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
                  <Button variant='danger' onClick={() => handleDeleteClick(item._id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            )}
          </Card>
        ))}
      </>
    );
  };

  return (
    <>
      {renderAddNew()}
      <h1 className='text-info'>Danh sách các ca làm việc</h1>
      <div className='d-flex gap-5 mt-5 flex-wrap justify-content-center align-items-center'>{isLoading ? <CardLoading /> : data.length > 0 ? renderCard() : 'Chưa có dữ liệu để hiển thị'}</div>
      <ConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirmModal={handleConfirmModal} />
    </>
  );
};

export default Shift;
