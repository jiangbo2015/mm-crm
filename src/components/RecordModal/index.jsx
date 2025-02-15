import { Modal, Table } from 'antd';

export default ({list, onCancel}) => {
    const columns = [{
        title: '修改人',
        dataIndex: 'value',
        key: 'value',
    },{
        title: '修改人',
        dataIndex: 'value',
        key: 'value',
    },{
        title: '修改内容',
        dataIndex: 'value',
        key: 'value',
    }]
    return (
        <Modal title="修改记录" visible={true} width="800px" footer={false} onCancel={onCancel}>
            <Table columns={columns} dataSource={list?.data} />
        </Modal>
    );
};
