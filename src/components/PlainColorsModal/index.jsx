import { useState, useEffect } from 'react';
import { Modal, Pagination, Tooltip,Tag, Input, Drawer } from 'antd';
import {
    DeleteOutlined,
    SearchOutlined,
    CheckOutlined
} from '@ant-design/icons';
// <AppstoreOutlined />
import { connect } from 'dva';
import { get, map, toInteger, includes , filter, findIndex } from 'lodash';

import { useDispatch, useSelector } from '@/hooks/useDvaTools';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 50

const PlainColorsModal = ({modalProps = {} }) => {
    console.log("modalProps.visible:", modalProps.visible)
  const dispatch = useDispatch()

  const {docs: sourceList, total, limit, page} = useSelector(state => get(state, 'style.colorList', {}))

//   const [selectedList, setSelectedList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);

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
    handleFetch({ limit, page, type: 0, code: input })
  }

  const handleOk = () => {

  };

  const handleSelect = (item) => {
    const { _id: id } = item;
    setSelectedItemList((prevSelectedItemList) => {
      if (findIndex(prevSelectedItemList, (item) => item._id === id) >= 0) {
        // 如果 id 已存在，则删除它
        return filter(prevSelectedItemList, (item) => item._id !== id);
      } else {
        // 如果 id 不存在，则添加它
        return [...prevSelectedItemList, item];
      }
    });
  };

  const isCheckedAll = filter(sourceList, (item) => findIndex(selectedItemList, (sourceItem) => sourceItem._id === item._id) >= 0)?.length === sourceList?.length

  const handleSelectAll = () => {
    setSelectedItemList((prevSelectedItemList) => {
        const insertItmes = filter(sourceList, (item) => findIndex(prevSelectedItemList, (preItem) => preItem._id === item._id) < 0) 
        return [...prevSelectedItemList, ...insertItmes];
    });
  };

  const handleSelectUnAll = () => {
    setSelectedItemList((prevSelectedItemList) => {
        const filterItmes = filter(prevSelectedItemList, (item) => findIndex(sourceList, (sourceItem) => sourceItem._id === item._id) < 0) 
        return filterItmes;
    });
  };
  const selectedList = map(selectedItemList, ({_id}) => _id)

  const SelectedDrawerOpen = modalProps?.visible && selectedList.length > 0;
  console.log("SelectedDrawerOpen", SelectedDrawerOpen)
  return (
    <>    <Modal
      {...modalProps}
      closable={false}
      centered={true}
        //   visible={visible}
        //   onOk={handleOk}
        //   onCancel={hideModal}
    >
        <div className={styles['selector-tools']}>
            <Search prefix={<SearchOutlined />}  bordered={false} addonAfter={null} placeholder="颜色" allowClear onSearch={onSearch} style={{ width: 200 }} />
            {/* <Input size="large" /> */}
            <CheckableTag onClick={isCheckedAll ? handleSelectUnAll : handleSelectAll} checked={isCheckedAll}>全选</CheckableTag>
        </div>      

        <div className={styles['grid-seletor']}>
            {map(sourceList, (item) => {
                const {value, code, _id} = item
                return (
                <div className={styles['grid-seletor-item']}>
                    <Tooltip title={code}>
                        <div
                            onClick={() => handleSelect(item)}
                            className={styles['grid-seletor-item-val']}
                            style={{ backgroundColor: value , width: size, height: size}}
                        >
                            <CheckOutlined className={includes(selectedList, _id) ? styles['grid-seletor-item-selected-icon'] : styles['grid-seletor-item-icon']} />
                        </div>
                    </Tooltip>
                </div>)}
            )}
        </div>
        <div className={styles['selector-footer']}>
            <Pagination
                onChange={onChange}
                showSizeChanger={false}
                size="small" total={total} pageSize={limit} current={toInteger(page)}
            />
        </div>
    </Modal>
    {SelectedDrawerOpen && <Drawer 
            className={styles['selected-drawer']}
            contentWrapperStyle={{padding: 0 }}
            height={100} placement="top" mask={false} closable={false} open>
            <div className={styles['flex-selected-box']}>
                {map(selectedItemList, (item) => {
                    const {value, code, _id} = item
                    return (
                    <div className={styles['grid-seletor-item']}>
                        <Tooltip title={code}>
                            <div
                                onClick={() => handleSelect(item)}
                                className={styles['grid-seletor-item-val']}
                                style={{ backgroundColor: value , width: 30, height: 30, marginLeft: 10, marginTop: 10}}
                            >
                                <div className={styles['selected-delete-icon']}>
                                    <DeleteOutlined /> 
                                </div>
                                
                                {/* <CheckOutlined className={includes(selectedList, _id) ? styles['grid-seletor-item-selected-icon'] : styles['grid-seletor-item-icon']} /> */}
                            </div>
                        </Tooltip>
                        
                    </div>)}
                )}
            </div>

        </Drawer>}
    </>

  );
};

export default connect(({  loading, style }) => ({
    colorList: get(style, "colorList"),
    fetching: loading.effects['color/getList'],
}))(PlainColorsModal);
