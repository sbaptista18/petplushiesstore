import { useState, useEffect } from "react";
import { Modal, Button } from "antd";

const ModalMessage = ({ status, message, isVisible, onClose }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // If the modal is open, set confirm loading to true (loading state)
    if (status == "error") {
      setConfirmLoading(true);
    } else {
      // If the modal is closed, set confirm loading to false after a delay
      setTimeout(() => {
        onClose();
        setConfirmLoading(false);
      }, 2000);
    }
  }, [status, onClose]);

  // Handle OK button click
  const handleOk = () => {
    // Set confirm loading to true (loading state)
    setConfirmLoading(true);
    // Close the modal after a delay
    setTimeout(() => {
      onClose(); // Call the onClose prop to close the modal
      setConfirmLoading(false);
    }, 100);
  };

  return (
    <Modal
      title={status == "success" ? "Successo!" : "Erro"}
      open={isVisible} // Use the visible prop to control the modal's visibility
      onOk={handleOk}
      confirmLoading={confirmLoading}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
        >
          Ok
        </Button>,
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ModalMessage;
