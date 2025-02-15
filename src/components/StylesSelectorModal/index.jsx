import { useState, useEffect } from 'react';
import { Modal, Pagination, Menu,Tag, Input, Drawer, Radio } from 'antd';
import {
    DeleteOutlined,
    SearchOutlined,
    CheckOutlined
} from '@ant-design/icons';
// <AppstoreOutlined />
import { connect } from 'dva';
import { get, map, toInteger, includes , filter, findIndex, find } from 'lodash';

import { StyleItem } from '@/components/StyleItem'
import { useDispatch, useSelector } from '@/hooks/useDvaTools';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 120
// const StyleTypeToPlaceholder = {
//     0: "颜色",
//     1: "花布"
// }

const StylesSelectorModal = ({modalProps = {},onStylesSelectorModalOk, initSelectedStyles = []}) => {
  const dispatch = useDispatch()

  const {docs: sourceList, total, limit, page} = useSelector(state => get(state, 'style.list'))
  const goodsList = useSelector(state => get(state, 'goods.list'))
  const [searchInput, setSearchInput] = useState('');
  const [currentGood, setCurrentGood] = useState(null);
  const [currentGoodCategory, setCurrentGoodCategory] = useState(null);
  const [selectedItemList, setSelectedItemList] = useState([]);

  const selectedList = map(selectedItemList, ({_id}) => _id)
  const SelectedDrawerOpen = modalProps?.visible && selectedList.length > 0;

  useEffect(() => {
    setSelectedItemList(initSelectedStyles)
  }, [initSelectedStyles])

  useEffect(() => {
    if(currentGood && currentGoodCategory) {
        handleFetch({ limit: 15, page: 1, goodId: currentGood?._id, categoryId: currentGoodCategory?._id, styleNo: searchInput })
    }
  }, [currentGood, currentGoodCategory, searchInput])

  useEffect(() => {
    handleFetchGoods()
  }, [])

  // 设置初始商品大类
  useEffect(() => {
    setCurrentGood(get(goodsList, 0, null))
  }, [goodsList])

  // 设置初始商品大类下的分类
  useEffect(() => {
    setCurrentGoodCategory(get(currentGood, 'category.0', null))
  }, [currentGood])

  const handleFetchGoods = () => {
    dispatch({
        type: 'goods/getList',
    });
  }
  const handleFetch = (params) => {
    dispatch({
        type: 'style/get',
        payload: {styleNo: searchInput, goodId: currentGood?._id, categoryId: currentGoodCategory?._id , ...params},
    });
  }
  
  const onChange = (page, pageSize) => {
    handleFetch({ limit: pageSize, page })
  }

  const onSearch = (input) => {
    searchInput(input)
  }

  const handleOk = () => {
    onStylesSelectorModalOk(selectedItemList)
  };

  const handleSelect = (item = {}) => {
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

  const handleSetCurrentGoodById = ( id ) => {
    setCurrentGood(find(goodsList, good => good?._id === id ))
  }

  const handleSetCurrentGoodCategoryById = ( id ) => {
    setCurrentGoodCategory(find(currentGood?.category, c => c?._id === id ))
  }

  return (
    <>    <Modal
      {...modalProps}
      closable={false}
        width={1000}
        //   visible={visible}
        onOk={handleOk}
        //   onCancel={hideModal}
    >
        <div className={styles['selector-tools']}>
            <Search 
                prefix={<SearchOutlined />}  
                bordered={false} 
                addonAfter={null} 
                placeholder="款式" 
                allowClear 
                onSearch={onSearch} 
                style={{ width: 200 }} 
            />
            <Radio.Group
                options={map(goodsList, good => ({ value: good?._id, label: good?.name }))}
                onChange={(e) => handleSetCurrentGoodById(e?.target?.value)}
                value={currentGood?._id}
                optionType="button"
                buttonStyle="solid"
            />
            <CheckableTag onClick={isCheckedAll ? handleSelectUnAll : handleSelectAll} checked={isCheckedAll}>全选</CheckableTag>
        </div>
        <div className={styles['grid-seletor-wrapper']}>
            <Menu className={styles['category-menu']} 
                  selectedKeys={[currentGoodCategory?._id]} 
                  onClick={({ key }) => {
                    handleSetCurrentGoodCategoryById(key)
                  }} 
            >
                {map(currentGood?.category,  category => (<Menu.Item key={category?._id}>{category?.name}</Menu.Item>))}
            </Menu>
            <div className={styles['grid-seletor']}>
                {map(sourceList, (item) => {
                    const { _id } = item
                    return (
                        <div key={_id} className={styles['grid-seletor-style-item']}>
                            <StyleItem
                                className={styles['relative']}
                                item={item}
                                onClick={() => handleSelect(item)}
                                size={size}
                                showCheckedIcon
                                checked={includes(selectedList, _id)}
                            />
                        </div>
                    )}
                )}
            </div>
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
                    <div className={styles['grid-seletor-style-item']} key={`s-${item._id}`}>
                            <StyleItem
                                item={item}
                                onClick={() => handleSelect(item)}
                                className={styles['drawer-seleted-item-val']}
                                size={60}
                            >
                                <div className={styles['selected-delete-icon']}>
                                    <DeleteOutlined /> 
                                </div>
                        </StyleItem>
                    </div>)}
                )}
            </div>
        </Drawer>}
    </>

  );
};

export default connect(({  loading, style }) => ({
    fetching: loading.effects['color/getList'],
}))(StylesSelectorModal);
