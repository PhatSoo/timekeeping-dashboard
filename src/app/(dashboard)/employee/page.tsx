'use client';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Button, Form, Table } from 'react-bootstrap';
import EmployeeViewDetail from '@/components/Employee.ViewDetail';
import { IEmployee } from '@/types/types';
import NavbarComponent from '@/components/App.Navbar';
import { toast } from 'react-toastify';
import TableLoading from '@/components/Component.TableLoading';

const nullData = {
  _id: '',
  name: '',
  email: '',
  isPartTime: false,
  phone: '',
  CCCD: '',
  sex: false,
  role: {
    _id: '',
    typeName: '',
  },
  avatar: '',
};

const tableColumns = ['#', 'Họ tên', 'Email', 'Chức vụ'];

const Employee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<IEmployee[]>([]);
  const [filteredData, setFilteredData] = useState<IEmployee[]>([]);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [formData, setFormData] = useState<IEmployee>(nullData);
  const [isSuccess, setIsSuccess] = useState(0);
  const [search, setSearch] = useState('');

  // Get data all employees
  useEffect(() => {
    fetch('api/employee')
      .then((response) => response.json())
      .then((result) => setData(result.data))
      .finally(() => setIsLoading(false));
  }, [showModal, isSuccess]);

  // Filtered employee by name
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        // Thay 'field' bằng trường bạn muốn tìm kiếm trong đối tượng shift
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [data, search]);

  const handleShowModal = (idx?: number) => {
    if (data && idx !== undefined) {
      setFormData(data[idx]);
      setShowModal(true);
    } else {
      setFormData(nullData);
      setShowModal(true);
      // Logic to prepare modal for adding a new employee
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChangeFormData = (event: React.ChangeEvent<any>) => {
    let value;
    if (event.target.name === 'sex') {
      value = event.target.value === '1';
    } else {
      value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }

    setFormData({
      ...formData,
      [event.target.name]: value,
    });
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

  const handleDeleteMultiple = () => {
    const confirmation = confirm('Bạn có chắc muốn xóa không?');
    if (confirmation) {
      const dataSelected = selectedRows.map((_, index) => data[index]._id);

      fetch('api/employee', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: dataSelected,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            toast.success(result.message);
            setSelectedRows([]);
            setSelectMultiple(false);
            setIsSuccess(isSuccess + 1);
          } else {
            toast.error(result.message);
          }
        });
    }
  };

  const renderTableData = () => {
    return (
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
          {filteredData.map((item, idx) => (
            <tr key={idx}>
              {selectMultiple && (
                <td>
                  <Form.Check checked={selectedRows.includes(idx)} id={`check-item-${idx}`} type='checkbox' onChange={() => handleSelectRow(idx)} />
                </td>
              )}
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role.typeName}</td>
              <td className='text-end'>
                <BsThreeDotsVertical onClick={() => handleShowModal(idx)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <NavbarComponent searchKey={search} setSearchKey={setSearch} />

      <h1 className='text-info mb-5'>Danh sách các nhân viên</h1>

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

      {isLoading ? <TableLoading columns={tableColumns} /> : data.length > 0 ? renderTableData() : 'Bạn không có dữ liệu'}

      {/* {data.length > 0 ? renderTableData() : <TableLoading columns={tableColumns} />} */}

      {showModal && <EmployeeViewDetail formData={formData} handleChangeFormData={handleChangeFormData} showModal={showModal} handleCloseModal={handleCloseModal} />}
    </>
  );
};

export default Employee;
