import { useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import { useSelector } from 'dva';

const usePlainColorsModal = (modalProps, selectPlainColors) => {
  const dispatch = useSelector()
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
        type: '',
        
    })
  }, [])
  

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    form.resetFields(); // 关闭模态框时重置表单
  };

  const handleOk = () => {

  };

  const FormModal = ({ children }) => (
    <Modal
      {...modalProps}
      visible={visible}
      onOk={handleOk}
      onCancel={hideModal}
    >

    </Modal>
  );

  return [FormModal, showModal, hideModal];
};

export default usePlainColorsModal;