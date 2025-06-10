import { useState, useEffect } from 'react';
import { Modal, Pagination, Spin,Tag, Input, Drawer, Button } from 'antd';
import {
    DeleteOutlined,
    SearchOutlined,
    CheckOutlined
} from '@ant-design/icons';
// <AppstoreOutlined />
import { connect } from 'dva';
import { get, map, toInteger, includes , filter, findIndex } from 'lodash';
import { intl } from '@/utils/utils'
import { ColorItem } from '@/components/ColorItem'
import SortSelect from '@/components/SortSelect'
import { useDispatch, useSelector } from '@/hooks/useDvaTools';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 50

const ColorsModal = ({
    modalProps = {},
    onColorsModalOk, 
    initSelectedColors, 
    colorType,
    limitNum = 30,
    fetching = false,
    isCustom = false,
    onAdd
}) => {
  const dispatch = useDispatch()
    const ColorTypeToPlaceholder = {
        0: intl("颜色"),
        1: intl("花布")
    }
  const {docs: sourceList, total=0, limit = 0, page = 0, code} = useSelector(state => get(state, colorType === 0 ? 'style.colorList' : 'style.colorListFlower' , {}))
  const [selectedItemList, setSelectedItemList] = useState([]);
  const [sort, setSort] = useState('time');

  const currentUser = useSelector(state => state?.user?.currentUser)
  const selectedList = map(selectedItemList, ({_id}) => _id)
  const SelectedDrawerOpen = modalProps?.visible && selectedList.length > 0;

  useEffect(() => {
    setSelectedItemList(initSelectedColors)
  }, [initSelectedColors])
  

  useEffect(() => {
    if(modalProps?.visible) {
        handleFetch({ limit: limitNum, page: 1})
    }
  }, [sort, modalProps?.visible])

  
  const handleFetch = (params) => {
    if (isCustom) {
        params.isCustom = 1
        params.creator = currentUser?._id
    }
    dispatch({
        type: 'style/getColorList',
        payload: {code, ...params, type: colorType, sort},
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

  const handleAdd = () => {
    onAdd()
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
        //   visible={visible}
        onOk={handleOk}
        style={{top: 52 }}
        //   onCancel={hideModal}
        destroyOnClose
        footer={<div style={{display: 'flex', justifyContent: 'space-between'}}>
            {isCustom?
                <Button onClick={handleAdd}>
                    {intl("添加")}
                </Button>
            :null}
            <div>
            <Button key="back" onClick={modalProps?.onCancel}>
                {intl("取消")}
            </Button>
            <Button key="submit" type="primary" onClick={handleOk}>
                {intl("确定")}
            </Button>
            </div>
        </div>}
    >
        <Spin spinning={fetching}>
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
                <div style={{display: 'flex'}}>
                    <CheckableTag onClick={isCheckedAll ? handleSelectUnAll : handleSelectAll} checked={isCheckedAll}>{intl("全选")}</CheckableTag>
                    <SortSelect
                        onSelect={val => {
                            if (val != sort) {
                                setSort(val);
                            }
                        }}
                        value={sort}
                        options={[
                            { label: 'Time', value: 'time' },
                            { label: 'Color', value: 'color' },
                        ]}
                    />
                </div>
            </div>      

            <div className={styles['grid-seletor']}>
                {map(sourceList, (item) => {
                    const { _id } = item
                    return (
                        <div key={_id} className={styles['grid-seletor-item']}>
                            <ColorItem
                                showTip={isCustom ? 'name' : 'code'}
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
            {limitNum<10000 && <div className={styles['selector-footer']}>
                <Pagination
                    onChange={onChange}
                    showSizeChanger={false}
                    size="small" total={total} pageSize={limit} current={toInteger(page)}
                />
            </div>}
        </Spin>

    </Modal>
    {SelectedDrawerOpen && <Drawer 
            className={styles['selected-drawer']}
            contentWrapperStyle={{padding: 0 }}
            height={50} 
            placement="top" 
            mask={false} 
            closable={false} 
            open>
            <div className={styles['flex-selected-box']}>
                {map(selectedItemList, (item) => {
                    return (
                    <div key={`s-${item._id}`} className={styles['grid-seletor-item']}>
                            <ColorItem
                                showTip={isCustom ? 'name' : 'code'}
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
    fetching: loading.effects['style/getColorList'],
}))(ColorsModal);
