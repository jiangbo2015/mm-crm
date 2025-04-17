import React from 'react'
import { Tooltip, Radio } from 'antd'
import classnames from 'classnames'
import {
    ZoomInOutlined,
    CheckOutlined
} from '@ant-design/icons'
import { filterImageUrl } from '@/utils/utils';
import styles from './index.less'

export const StyleItem = ({item = {}, size, onClick, onSelect, onEnlarge, className, checked, showCheckedIcon, showEnlargeIcon, children}) => {
    const {styleNo, imgUrl} = item
    return (
        <div className={styles['style-item']}>
            <Tooltip title={styleNo}>
                <div
                    onClick={onClick}
                    className={classnames(styles['item-val'], className)}
                    style={{ width: size, height: size}}
                >
                    <img
                        className={styles['item-val-img']}
                        src={filterImageUrl(imgUrl)} 
                    />
                    {checked && <CheckOutlined className={styles['grid-seletor-item-selected-icon'] }/>}
                    {children}
                </div>
            </Tooltip>
            {showCheckedIcon && <Radio checked={checked} onClick={onSelect}/>}
            {showEnlargeIcon && <ZoomInOutlined className={styles['seletor-enlarge-icon'] } onClick={onEnlarge}/>}
        </div>
        )
}
