import { useState, useEffect } from 'react';
import { Modal, Pagination, Menu,Tag, Input, Drawer, Radio, Spin } from 'antd';
import {
    DeleteOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { intl } from '@/utils/utils'
import { connect } from 'dva';
import { getLocale } from 'umi';
import { get, map, toInteger, includes , filter, findIndex, find } from 'lodash';

import { StyleItem } from '@/components/StyleItem'
import { EnlargeStyleModal } from './components/EnlargeStyleModal';

import styles from './index.less'

const { Search } = Input;
const { CheckableTag } = Tag;
const size = 120
// const StyleTypeToPlaceholder = {
//     0: "颜色",
//     1: "花布"
// }

const StylesSelectorModal = ({ 
    dispatch, 
    styleList = {},
    goodsList, 
    modalProps = {},
    onStylesSelectorModalOk, 
    initSelectedStyles,
    mode = 'multiple', // 'multiple','single'
    fetching
}) => {
    console.log("getLocale :", getLocale())
  const locale = getLocale()
  const isZhCN =  locale === 'zh-CN'
  const {docs: sourceList = [], total = 0, limit = 0, page = 1} = styleList
  const [searchInput, setSearchInput] = useState('');
  const [enlargeStyle, setEnlargeStyle] = useState(null);
  const [currentGood, setCurrentGood] = useState(null);
  const [currentGoodCategory, setCurrentGoodCategory] = useState(null);
  const [selectedItemList, setSelectedItemList] = useState([]);

  const selectedList = map(selectedItemList, ({_id}) => _id)
  const SelectedDrawerOpen = modalProps?.visible && selectedList.length > 0 && mode === 'multiple';

  useEffect(() => {
    if(initSelectedStyles) {
        setSelectedItemList(initSelectedStyles)
    }
    
  }, [initSelectedStyles])

  useEffect(() => {
    if(currentGood && currentGoodCategory) {
        handleFetch({ limit: 15, page: 1, goodId: currentGood?._id, categoryId: currentGoodCategory?._id, styleNo: searchInput })
    }
  }, [currentGood, currentGoodCategory, searchInput])

  useEffect(() => {
    console.log("--handleFetchGoods---")
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
        type: 'goods/getVisibleList',
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
    setSearchInput(input)
  }

  const handleOk = () => {
    onStylesSelectorModalOk(selectedItemList)
  };

  const handleSelect = (item = {}) => {
    if(mode === 'single') {
        handleSelectSingle(item);
        return
    }
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

  const handleEnlargeStyle = (style) => {
    setEnlargeStyle(style)
  }

  const handleSelectSingle = (item = {}) => {
    setSelectedItemList([item]);
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
        style={{top: mode === 'multiple' ? 110:24 }}
    > 
        <Spin spinning={fetching}>
        <div className={styles['selector-tools']}>
            <Search 
                prefix={<SearchOutlined />}  
                bordered={false} 
                addonAfter={null} 
                placeholder={intl("款式")} 
                allowClear 
                onSearch={onSearch} 
                style={{ width: 200 }} 
            />
            <Radio.Group
                options={map(goodsList, good => ({ value: good?._id, label: isZhCN ? good?.name : good?.aliasName }))}
                onChange={(e) => handleSetCurrentGoodById(e?.target?.value)}
                value={currentGood?._id}
                optionType="button"
                buttonStyle="solid"
            />
            {mode === 'multiple' ? <CheckableTag onClick={isCheckedAll ? handleSelectUnAll : handleSelectAll} checked={isCheckedAll}>{intl("全选")}</CheckableTag>: <div></div>}
        </div>
        <div className={styles['grid-seletor-wrapper']}>
            <Menu className={styles['category-menu']} 
                  selectedKeys={[currentGoodCategory?._id]} 
                  onClick={({ key }) => {
                    handleSetCurrentGoodCategoryById(key)
                  }} 
            >
                {map(currentGood?.category,  category => (<Menu.Item key={category?._id}>{isZhCN ? category?.name : category?.enname }</Menu.Item>))}
            </Menu>
            <div className={styles['grid-seletor']}>
                {map(sourceList, (item) => {
                    const { _id } = item
                    return (
                        <div key={_id} className={styles['grid-seletor-style-item']}>
                            <StyleItem
                                className={styles['relative']}
                                item={item}
                                onEnlarge={() => handleEnlargeStyle(item)}
                                onClick={() => handleSelect(item)}
                                size={size}
                                showEnlargeIcon
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
        </Spin>
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
                                onClick={() => { handleSelect(item)}}
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
    {!!enlargeStyle && <EnlargeStyleModal modalProps={{onCancel: () => {setEnlargeStyle(null)}}} style={enlargeStyle}/>}
    </>

  );
};

export default connect(({  loading, style, goods }) => ({
    fetching: loading.effects['style/get'],
    styleList : style.list,
    goodsList : goods.visibleGoodsList
}))(StylesSelectorModal);
