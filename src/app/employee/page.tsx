'use client';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Button, Form, Table } from 'react-bootstrap';
import EmployeeViewDetail from '@/components/Employee.ViewDetail';
import { IEmployee } from '@/types/types';
import NavbarComponent from '@/components/App.Navbar';

const Employee = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<IEmployee[]>([]);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [formData, setFormData] = useState<IEmployee>({
    _id: '',
    name: '',
    email: '',
    isPartTime: false,
    CCCD: '',
    sex: false,
    roleId: {
      _id: '',
      typeName: '',
    },
    avatar: '',
  });

  // Get data all employees
  useEffect(() => {
    fetch('api/employee')
      .then((response) => response.json())
      .then((result) => setData(result.data));
  }, []);

  const handleShowModal = (idx?: number) => {
    if (data && idx !== undefined) {
      setFormData(data[idx]);
      setShowModal(true);
    } else {
      setFormData({
        _id: '',
        name: '',
        email: '',
        isPartTime: false,
        CCCD: '',
        sex: false,
        roleId: {
          _id: '',
          typeName: '',
        },
        avatar: '',
      });
      setShowModal(true);
      // Logic to prepare modal for adding a new employee
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChangeFormData = (event: React.ChangeEvent<any>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    console.log(e);

    e.preventDefault();
  };

  const handleSelectMultiple = () => {
    if (selectMultiple) {
      setSelectAll(false);
      setSelectedRows([]);
    }
    setSelectMultiple(!selectMultiple);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allRowIndices = data ? data.map((_item, idx) => idx) : [];
      setSelectedRows(allRowIndices);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (idx: number) => {
    if (selectedRows.includes(idx)) {
      setSelectedRows((prevRows) => prevRows.filter((rowIdx) => rowIdx !== idx));
      setSelectAll(false);
    } else {
      setSelectedRows((prevRows) => {
        const updatedRows = [...prevRows, idx];
        if (updatedRows.length === (data ? data.length : 0)) {
          setSelectAll(true);
        } else {
          setSelectAll(false);
        }
        return updatedRows;
      });
    }
  };

  const handleDeleteMultiple = () => {};

  return (
    <>
      <NavbarComponent />

      <div className='my-2 d-flex align-items-center justify-content-between'>
        <Form.Check checked={selectMultiple} type='checkbox' label={'Chọn nhiều'} onChange={handleSelectMultiple} />

        {selectMultiple && selectedRows.length > 0 ? (
          <Button variant='warning' onClick={handleDeleteMultiple}>
            Xóa
          </Button>
        ) : (
          <Button variant='info' onClick={() => handleShowModal()}>
            New
          </Button>
        )}
      </div>

      <Table striped hover className='table-secondary'>
        <thead>
          <tr>
            {selectMultiple && (
              <th>
                <Form.Check checked={selectAll} type='checkbox' onChange={() => handleSelectAll()} />
              </th>
            )}
            <th>#</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Chức vụ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0
            ? data.map((item, idx) => (
                <tr key={idx}>
                  {selectMultiple && (
                    <td>
                      <Form.Check checked={selectedRows.includes(idx)} id={`check-item-${idx}`} type='checkbox' onChange={() => handleSelectRow(idx)} />
                    </td>
                  )}
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.roleId.typeName}</td>
                  <td className='text-end'>
                    <BsThreeDotsVertical onClick={() => handleShowModal(idx)} />
                  </td>
                </tr>
              ))
            : 'Loading...'}
        </tbody>
      </Table>

      <EmployeeViewDetail formData={formData} handleChangeFormData={handleChangeFormData} showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
};

export default Employee;
