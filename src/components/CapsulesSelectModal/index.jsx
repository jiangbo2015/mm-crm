import { useState, useEffect } from 'react';
import { Modal, Pagination, Tooltip,Tag, Input, Drawer } from 'antd';
import {
    DeleteOutlined,
    SearchOutlined,
    CheckOutlined
} from '@ant-design/icons';
// <AppstoreOutlined />
import { filterImageUrl } from '@/utils/utils'
import { connect } from 'dva';
import { get, map, toInteger, includes , filter, findIndex } from 'lodash';

import { CapsuleItem } from '@/components/CapsuleItem'
import { useDispatch, useSelector } from '@/hooks/useDvaTools';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 50

// const CapsuleItem = ({item, checked, onClick }) => (
//     <div className={styles['relative']} onClick={onClick}>
//         <img src={filterImageUrl(item.imgUrl || 
//                     get(item, 'capsuleItems.0.fileUrl') || 
//                     get(item, 'capsuleItems.0.finishedStyleColorsList.0.imgUrlFront'))
//                 } 
//             alt="" style={{minHeight: 100}}
//         />
//         <CheckOutlined className={checked ? styles['grid-seletor-item-selected-icon'] : styles['grid-seletor-item-icon']} />
//     </div>
// )

const CapsulesSelectModal = ({modalProps = {},onCapsulesSelectModalOk, initSelectedCapsules = []}) => {
  const dispatch = useDispatch()

  const {docs: sourceList, total, limit, page} = useSelector(state => get(state, 'capsule.publishedList' , {}))
  const [selectedItemList, setSelectedItemList] = useState([]);

  const selectedList = map(selectedItemList, ({_id}) => _id)
  const SelectedDrawerOpen = modalProps?.visible && selectedList.length > 0;

  useEffect(() => {
    setSelectedItemList(initSelectedCapsules)
  }, [initSelectedCapsules])
  

  useEffect(() => {
    handleFetch({ limit: 5, page: 1})
  }, [])

  
  const handleFetch = (params) => {
    dispatch({
        type: 'capsule/getPublishedList',
        payload: params,
    });
  }
  
  const onChange = (page, pageSize) => {
    handleFetch({ limit: pageSize, page})
  }

  const onSearch = (input) => {
    handleFetch({ limit, page, code: input })
  }

  const handleOk = () => {
    onCapsulesSelectModalOk(selectedItemList)
  };

  const handleSelect = (item = {}) => {
    console.log("handleSelect", item)
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

  return (
    <>    
        <Modal
        {...modalProps}
        closable={false}
        width={1000}
        style={{ top: 130 }}
            //   visible={visible}
            onOk={handleOk}
            //   onCancel={hideModal}
        >
            <div className={styles['selector-tools']}>
                <Search 
                    prefix={<SearchOutlined />}  
                    bordered={false} 
                    addonAfter={null} 
                    placeholder="胶囊"
                    allowClear 
                    onSearch={onSearch} 
                    style={{ width: 200 }} 
                />
                <CheckableTag onClick={isCheckedAll ? handleSelectUnAll : handleSelectAll} checked={isCheckedAll}>全选</CheckableTag>
            </div>      

            <div className={styles['grid-seletor-capsule']}>
                {map(sourceList, (item) => {
                    const { _id } = item
                    return (
                        <div key={_id} className={styles['grid-seletor-item']}>
                            <CapsuleItem
                                item={item}
                                onClick={() => handleSelect(item)}
                            >
                                <CheckOutlined className={includes(selectedList, _id) ? styles['grid-seletor-item-selected-icon'] : styles['grid-seletor-item-icon']} />
                            </CapsuleItem>
                        </div>
                    )}
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
                height={120} placement="top" mask={false} closable={false} open>
                <div className={styles['flex-selected-box']}>
                    {map(selectedItemList, (item) => {
                        return (
                        <div key={`s-${item._id}`} className={styles['grid-seletor-item']}>
                            <CapsuleItem
                                item={item}
                                onClick={() => handleSelect(item)}
                                width="58px"
                                className={styles['drawer-seleted-item']}
                                valClassName={styles['drawer-seleted-item-val']}
                            >
                                    <div className={styles['selected-delete-icon']}>
                                        <DeleteOutlined /> 
                                    </div>
                            </CapsuleItem>
                            
                        </div>)}
                    )}
                </div>

            </Drawer>}
    </>

  );
};

export default connect(({  loading, style }) => ({
    fetching: loading.effects['capsule/getPublishedList'],
}))(CapsulesSelectModal);
