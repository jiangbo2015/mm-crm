import { useState, useEffect } from 'react';
import { Form, Modal } from 'antd';

const useFormModal = (formProps, modalProps, editData) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  // 当 editData 变化时，设置表单的值
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      form.resetFields(); // 如果没有 editData，重置表单
    }
  }, [editData, form]);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    form.resetFields(); // 关闭模态框时重置表单
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        modalProps.onOk(values);
        hideModal();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const FormModal = ({ children }) => (
    <Modal
      {...modalProps}
      visible={visible}
      onOk={handleOk}
      onCancel={hideModal}
      
    >
      <Form form={form} {...formProps}>
        {children}
      </Form>
    </Modal>
  );

  return [FormModal, showModal, hideModal];
};

export default useFormModal;