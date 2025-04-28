import { Form, Button, Input, Col, Row, message } from 'antd';
import { isFunction } from 'lodash'
import { useDispatch } from '@/hooks/useDvaTools'
import { fullIntl } from '@/utils/utils'

export const InputBottomBorder = props => <Input style={{ border: 'none', borderBottom: '1px solid #000' }} {...props} />;

export const TextAreaBottomBorder = props => (
    <Input.TextArea style={{ border: 'none', borderBottom: '1px solid #000' }} {...props} />
);

export const ContactUs = ({callback}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const onFinish = () => {
        form.validateFields().then(async (values, error) => {
            // console.log(values);
            const res = await dispatch({
                type: 'user/feedback',
                payload: values,
            });
            if(res?.success) {
                message.info('发送成功');
                form.resetFields();
                if(isFunction(callback)) {
                    callback()
                }
            }
            
        });
    };
    return <Form onFinish={onFinish} form={form}>
    <Row>
        <Col span={11}>
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input your name',
                    },
                ]}
            >
                <InputBottomBorder placeholder={fullIntl({
            id: 'your_name',
            defaultMessage: '您的姓名',
        })} />
            </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email',
                    },
                ]}
            >
                <InputBottomBorder placeholder={fullIntl({
            id: 'your_email',
            defaultMessage: '您的邮箱',
        })} />
            </Form.Item>
        </Col>
    </Row>

    <Form.Item
        name="subject"
        rules={[
            {
                required: true,
                message: 'Please input your subject',
            },
        ]}
    >
        <InputBottomBorder placeholder={fullIntl({
            id: 'subject',
            defaultMessage: '主题',
        })} />
    </Form.Item>
    <Form.Item
        name="mensaje"
        rules={[
            {
                required: true,
                message: 'Please input your mensaje',
            },
        ]}
    >
        <TextAreaBottomBorder rows={8} placeholder={fullIntl({
            id: 'mensaje',
            defaultMessage: '请描述您的问题',
        })} />
    </Form.Item>
    <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '200px', backgroundColor: '#000', borderColor: '#000', }}>
            {fullIntl({
                id: 'send',
                defaultMessage: '发送',
            })}
        </Button>
    </Form.Item>
    <p>
    {fullIntl({
            id: 'can_help_you',
            defaultMessage: '需要帮助吗？',
        })}
        <br />
        {fullIntl({
            id: 'from_here_we',
            defaultMessage: '请填写以上表格，让我们来解答您的疑问。',
        })}
    </p>
</Form>
}