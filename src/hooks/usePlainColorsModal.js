import { useState, useEffect } from 'react';
import { Modal, Pagination, Tooltip } from 'antd';
import {
    AppstoreOutlined,
} from '@ant-design/icons';
// <AppstoreOutlined />
import { get, map, toInteger } from 'lodash';

import {useDispatch, useSelector} from '@/hooks/useDvaTools';

import styles from './index.less'

const size = 50

const usePlainColorsModal = (modalProps = {}, selectPlainColors) => {
  const dispatch = useDispatch()
  const {docs: sourceList, total, limit, page} = useSelector(state => get(state, 'style.colorList', {}))
  console.log({total, limit, page})

  const [visible, setVisible] = useState(false);

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

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const handleOk = () => {

  };

  const Com = ({ children }) => (
    <Modal
      {...modalProps}
      visible={visible}
      onOk={handleOk}
      onCancel={hideModal}
    >
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
        <Pagination
            onChange={onChange}
            size="small" total={total} pageSize={limit} current={toInteger(page)}
        />
    </Modal>
  );

  return [Com, showModal, hideModal];
};

export default usePlainColorsModal;