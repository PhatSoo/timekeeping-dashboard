'use client';
import { IRole } from '@/types/types';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card, Container, FloatingLabel, Form, Toast, ToastContainer, useAccordionButton } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Role = () => {
  const [isAddNew, setIsAddNew] = useState(false);
  const [formDataAdd, setFormDataAdd] = useState('');
  const [formDataEdit, setFormDataEdit] = useState<IRole>({
    _id: '',
    typeName: '',
  });
  const [listData, setListData] = useState<IRole[]>([]);
  const [activeKey, setActiveKey] = useState(null);
  const [success, setSuccess] = useState(0);

  // Get all roles
  useEffect(() => {
    fetch('api/role')
      .then((response) => response.json())
      .then((result) => setListData(result.data));
  }, [success]);

  function CustomToggle({ eventKey }: any) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setFormDataAdd('');
      setIsAddNew(!isAddNew);
    });

    return (
      <Button variant={isAddNew ? 'secondary' : 'info'} onClick={decoratedOnClick}>
        {isAddNew ? 'Cancel' : 'New'}
      </Button>
    );
  }

  const handleSelectedItem = (key: any, event: any) => {
    setActiveKey(key);
    setFormDataEdit(listData[key]);
  };

  const handleChangeFormDataAdd = (event: { target: { name: any; value: any } }) => {
    setFormDataAdd(event.target.value);
  };

  const handleChangeFormDataEdit = (event: { target: { name: any; value: any } }) => {
    setFormDataEdit({ ...formDataEdit, [event.target.name]: event.target.value });
  };

  const handleAddNew = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/role', {
      method: 'POST',
      body: JSON.stringify({ typeName: formDataAdd }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          setFormDataAdd('');
          setSuccess(success + 1);
        } else {
          toast.error(result.message);
        }
      });
  };

  const handleEdit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: formDataEdit }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          setSuccess(success + 1);
          setActiveKey(null);
        } else {
          toast.error(result.message);
        }
      });
  };

  const handleDelete = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    fetch('api/role', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: formDataEdit._id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success(result.message);
          setSuccess(success + 1);
          setActiveKey(null);
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
                <Form onSubmit={handleAddNew} className='d-flex w-100 justify-content-between align-items-center gap-4'>
                  <FloatingLabel label='Tên ca làm' className='w-100'>
                    <Form.Control type='text' required name='typeName' placeholder='Admin' value={formDataAdd} onChange={handleChangeFormDataAdd} />
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

  const renderData = () => {
    return (
      <Accordion activeKey={activeKey} onSelect={handleSelectedItem}>
        {listData.length > 0
          ? listData.map((role, idx) => (
              <Accordion.Item key={idx} eventKey={idx.toString()}>
                <Accordion.Header>{role.typeName}</Accordion.Header>
                <Accordion.Body>
                  <Form className='d-flex gap-4 align-items-center'>
                    <FloatingLabel label='Tên ca làm' className='w-100'>
                      <Form.Control type='hidden' name='_id' value={role._id} />
                      <Form.Control type='text' name='typeName' placeholder='Admin' value={formDataEdit?.typeName} onChange={handleChangeFormDataEdit}></Form.Control>
                    </FloatingLabel>
                    <Button variant='warning' type='submit' onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button variant='danger' type='submit' onClick={handleDelete}>
                      Delete
                    </Button>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            ))
          : 'Loading'}
      </Accordion>
    );
  };

  return (
    <Container>
      {renderAddNew()}
      <h1 className='my-5 text-info'>Danh sách Roles</h1>
      {renderData()}
    </Container>
  );
};

export default Role;
