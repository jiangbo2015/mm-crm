import React from 'react'
import { Tooltip, Radio } from 'antd'
import classnames from 'classnames'

import { filterImageUrl } from '@/utils/utils';
import styles from './index.less'

export const StyleItem = ({item = {}, size, onClick, onSelect, className, checked, showCheckedIcon, children}) => {
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
                    {children}
                </div>
            </Tooltip>
            {showCheckedIcon && <Radio checked={checked} onClick={onSelect}/>}
        </div>
        )
}
