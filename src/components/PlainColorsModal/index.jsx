import { useState, useEffect } from 'react';
import { Modal, Pagination, Tooltip,Tag, Input } from 'antd';
import {
    AppstoreOutlined,
    SearchOutlined
} from '@ant-design/icons';
// <AppstoreOutlined />
import { connect } from 'dva';
import { get, map, toInteger } from 'lodash';

import {useDispatch, useSelector} from '@/hooks/useDvaTools';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 50

const PlainColorsModal = ({modalProps = {}}) => {
  const dispatch = useDispatch()
  const {docs: sourceList, total, limit, page} = useSelector(state => get(state, 'style.colorList', {}))
  console.log({total, limit, page})

//   const [visible, setVisible] = useState(false);

  useEffect(() => {
    handleFetch({ limit: 30, page: 1, type: 0 })
  }, [])

  
  const handleFetch = (params) => {
    dispatch({
        type: 'style/getColorList',
        payload: params,
    });
  }
  
  const onChange = (page, pageSize) => {
    console.log("page", page)
    console.log("pageSize", pageSize)
    handleFetch({ limit: pageSize, page, type: 0 })

  }

  const onSearch = (input) => {
    console.log("input", input)
  }

  const handleOk = () => {

  };

  return (
    <Modal
      {...modalProps}
      closable={false}
        //   visible={visible}
        //   onOk={handleOk}
        //   onCancel={hideModal}
    >
        <div className={styles['selector-tools']}>
            <Search prefix={<SearchOutlined />}  bordered={false} addonAfter={null} placeholder="颜色" allowClear onSearch={onSearch} style={{ width: 200 }} />
            {/* <Input size="large" /> */}
            <CheckableTag>全选</CheckableTag>
        </div>      

        <div className={styles['grid-seletor']}>
            {map(sourceList, ({value, code}) => (
            <div className={styles['grid-seletor-item']}>
                <Tooltip title={code}>
                    <div
                        className={styles['grid-seletor-item-val']}
                        style={{ backgroundColor: value , width: size, height: size}}
                    />
                </Tooltip>
                
            </div>))}
        </div>
        <div className={styles['selector-footer']}>
            <Pagination
                onChange={onChange}
                showSizeChanger={false}
                size="small" total={total} pageSize={limit} current={toInteger(page)}
            />
        </div>
    </Modal>
  );
};

export default connect(({  loading, style }) => ({
    colorList: get(style, "colorList"),
    fetching: loading.effects['color/getList'],
}))(PlainColorsModal);
