import { Modal, Table } from 'antd';
import { get } from 'lodash';
import moment from 'moment';

const style = {
    'name': '名称',
    'namecn': '中文名',
    'nameen': '英文名',
    'value': '数据',
    'styleName': '款式名名称',
    'size': '尺码',
    'imgUrl': '款式图',
    'svgUrl': '正面轮廓图',
    'svgUrlBack': '背面轮廓图',
    'shadowUrl': '正面阴影图',
    'shadowUrlBack': '背面阴影图',
    'styleBackSize': '款式背面宽',
    'styleNo': "款式编号",
    'styleSize': "款式正面宽",
    'tags': '标签',
    'vposition': "正背面对齐方式",
    'weight': '重量',
    'categoryId': '商品分类II',
    'goodsId': '商品分类I',
}

const color = {
    'code': '编号',
    'name': '名称',
    'namecn': '中文名',
    'nameen': '英文名',
    'value': '颜色值',
    'colorSystem': '色系',
    'categoryId': '商品分类II',
    'goodsId': '商品分类I',
}

const flower = {
    'code': '开发编号',
    'flowerCode': '印花编号',
    'size': '单循环宽度',
    'name': '名称',
    'namecn': '中文名',
    'nameen': '英文名',
    'value': '画布图',
    'colorSystem': '色系',
    'categoryId': '商品分类II',
    'goodsId': '商品分类I',
}
const FieldToTextMap = {
    style,
    color,
    flower
}

export default ({list, onCancel, modelName = 'style'}) => {
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
        render: (updatedAt) => moment(updatedAt).format('YYYY-MM-DD hh:mm:ss')
    },{
        title: '修改内容',
        dataIndex: 'changes',
        key: 'changes',
        render: (d) => d.map(x => <div>{`${get(FieldToTextMap,`${modelName}.${x.field}`) ?? x.field}: ${x.oldValue} -> ${x.newValue}`}</div>)
    }]
    return (
        <Modal title="修改记录" visible={true} width="800px" footer={false} onCancel={onCancel}>
            <Table columns={columns} dataSource={list} />
        </Modal>
    );
};
