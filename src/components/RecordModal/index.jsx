import { Modal, Table } from 'antd';

export default ({list, onCancel}) => {
    console.log(list, 'list')
    const columns = [{
        title: '修改人',
        dataIndex: 'changedBy',
        key: 'changedBy',
        render: (d) => d.name
    },{
        title: '修改时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    },{
        title: '修改内容',
        dataIndex: 'changes',
        key: 'changes',
        render: (d) => d.map(x => `${x.field}: ${x.oldValue} -> ${x.newValue}`).join('；')
    }]
    return (
        <Modal title="修改记录" visible={true} width="800px" footer={false} onCancel={onCancel}>
            <Table columns={columns} dataSource={list} />
        </Modal>
    );
};
