import { Input } from 'antd';
import React, { useState } from 'react';
import classnames from 'classnames';
import { map, filter, includes } from 'lodash';
import {
    DeleteOutlined,
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';
import useArrangement from '@/hooks/useArrangement'
import { ColorItem } from '@/components/ColorItem'

import styles from './index.less'

const { Search } = Input
const ColorTypeToPlaceholder = {
    0: "颜色",
    1: "花布"
}

const ArrangementToSize = {
    '3': 50,
    '4': 40,
    '5': 30,
}

const onChange = (key) => {
  console.log(key);
};



const ColorList = ({ colors, colorType = 0, onAdd, hideSearch }) => {

    const [searchText, setSearchText] = useState('')
    const { arrangement, ArrangmentDropdown } = useArrangement(null)
    const filteredColors = filter(colors, c => includes(c?.code, searchText))

    const onSearch = (input) => {
        setSearchText(input)
    }


    return (<div className={styles['color-list-wrapper']}>
        <div className={styles['color-list-header']}>
            {hideSearch ? <div style={{flex: 1}}></div> : <Search 
                prefix={<SearchOutlined />}  
                bordered={false} 
                addonAfter={null} 
                placeholder={ColorTypeToPlaceholder[colorType]} 
                allowClear 
                onSearch={onSearch} 
                style={{ flex: 1 }} 
            />}
            <PlusOutlined className={styles['add-icon-btn']} onClick={onAdd}/>
            <div className={styles['add-icon-btn']}>{ArrangmentDropdown}</div>
        </div>
        <div className={classnames(styles['color-list-body'], styles[`grid-${arrangement}`])}>
            {map(filteredColors, item => <ColorItem key={item._id} item={item} size={ArrangementToSize[arrangement]} />)}
        </div>
        
    </div>)
};

export default ColorList;
