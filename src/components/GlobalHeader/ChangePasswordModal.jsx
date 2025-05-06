import { Button, Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { history } from 'umi';
import { intl } from '@/utils/utils'

const ChangePasswordModal = ({ dispatch, onCancel }) => {
    const [form] = Form.useForm();

    const onFinish = () => {
        form.validateFields().then(async (values, error) => {
            if (error) {
                return;
            }
            if (values.newPwd !== values.confirmPwd) {
                message.error('两次密码不一致');
                return;
            }
            const res = await dispatch({
                type: 'user/changePwd',
                payload: values,
            });
            if (res?.success) {
                message.success('修改成功，请重新登录');
                history.push('/user/login');
            }

        });
    };

    return (
        <Modal
            className="mm-yellow-modal"
            footer={false}
            visible={true}
            onCancel={onCancel}
            title={intl("修改密码")}
            bodyStyle={{
                backgroundColor: '#F0F0F0',
            }}
            width="400px"
        >
            <Form onFinish={onFinish} form={form}>
                <Form.Item
                    label={intl("旧密码")}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password',
                        },
                    ]}
                >
                    <Input type="password" />
                </Form.Item>
                <Form.Item
                    label={intl("新密码")}
                    name="newPwd"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password',
                        },
                    ]}
                >
                    <Input type="password" />
                </Form.Item>
                <Form.Item
                    label={intl("确认新密码")}
                    name="confirmPwd"
                    rules={[
                        {
                            required: true,
                            message: 'Please input confirm new password',
                        },
                    ]}
                >
                    <Input type="password" />
                </Form.Item>
                <Form.Item>
                    <Button type="default" htmlType="submit">
                        {intl("确认")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default connect(({ user = { info: {} } }) => ({ currentUser: user.info }))(ChangePasswordModal);