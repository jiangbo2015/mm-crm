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

import { ColorItem } from '@/components/ColorItem'
import { useDispatch, useSelector } from '@/hooks/useDvaTools';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 50
const ColorTypeToPlaceholder = {
    0: "颜色",
    1: "花布"
}

const ColorsModal = ({modalProps = {},onColorsModalOk, initSelectedColors, colorType}) => {
  const dispatch = useDispatch()

  const {docs: sourceList, total, limit, page} = useSelector(state => get(state, colorType === 0 ? 'style.colorList' : 'style.colorListFlower' , {}))
  const [selectedItemList, setSelectedItemList] = useState([]);

  const selectedList = map(selectedItemList, ({_id}) => _id)
  const SelectedDrawerOpen = modalProps?.visible && selectedList.length > 0;

  useEffect(() => {
    setSelectedItemList(initSelectedColors)
  }, [initSelectedColors])
  

  useEffect(() => {
    handleFetch({ limit: 30, page: 1})
  }, [])

  
  const handleFetch = (params) => {
    dispatch({
        type: 'style/getColorList',
        payload: {...params, type: colorType},
    });
  }
  
  const onChange = (page, pageSize) => {
    handleFetch({ limit: pageSize, page})
  }

  const onSearch = (input) => {
    handleFetch({ limit, page, code: input })
  }

  const handleOk = () => {
    onColorsModalOk(selectedItemList)
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
    <>    <Modal
      {...modalProps}
      closable={false}
      top={112}
        //   visible={visible}
        onOk={handleOk}
        //   onCancel={hideModal}
    >
        <div className={styles['selector-tools']}>
            <Search 
                prefix={<SearchOutlined />}  
                bordered={false} 
                addonAfter={null} 
                placeholder={ColorTypeToPlaceholder[colorType]} 
                allowClear 
                onSearch={onSearch} 
                style={{ width: 200 }} 
            />
            <CheckableTag onClick={isCheckedAll ? handleSelectUnAll : handleSelectAll} checked={isCheckedAll}>全选</CheckableTag>
        </div>      

        <div className={styles['grid-seletor']}>
            {map(sourceList, (item) => {
                const { _id } = item
                return (
                    <div key={_id} className={styles['grid-seletor-item']}>
                        <ColorItem
                            
                            className={styles['relative']}
                            item={item}
                            onClick={() => handleSelect(item)}
                            size={size}
                        >
                            <CheckOutlined className={includes(selectedList, _id) ? styles['grid-seletor-item-selected-icon'] : styles['grid-seletor-item-icon']} />
                        </ColorItem>
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
            height={100} placement="top" mask={false} closable={false} open>
            <div className={styles['flex-selected-box']}>
                {map(selectedItemList, (item) => {
                    return (
                    <div key={`s-${item._id}`} className={styles['grid-seletor-item']}>
                            <ColorItem
                                
                                item={item}
                                onClick={() => handleSelect(item)}
                                
                                className={styles['drawer-seleted-item-val']}
                                size={30}
                            >
                                <div className={styles['selected-delete-icon']}>
                                    <DeleteOutlined /> 
                                </div>
                                
                
                        </ColorItem>
                        
                    </div>)}
                )}
            </div>

        </Drawer>}
    </>

  );
};

export default connect(({  loading, style }) => ({
    fetching: loading.effects['color/getList'],
}))(ColorsModal);
