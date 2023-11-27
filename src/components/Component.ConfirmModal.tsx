import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface IProp {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  handleConfirmModal: () => void;
}

const ConfirmModal = ({ showModal, setShowModal, handleConfirmModal }: IProp) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>Bạn có chắc chắn muốn xóa? Hành động này sẽ không thể hoàn tác.</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => setShowModal(false)}>
          Hủy
        </Button>
        <Button variant='danger' onClick={handleConfirmModal}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
