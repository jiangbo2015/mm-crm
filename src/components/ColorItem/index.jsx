import React from 'react'
import { Tooltip } from 'antd'
import classnames from 'classnames'

import { filterImageUrl } from '@/utils/utils';
import styles from './index.less'

export const ColorItem = ({item = {}, ...props}) => {
    const { type } = item
    return type === 0 ? <PlainColorItem item={item} {...props}/> : <FlowerColorItem item={item} {...props}/>

}

export const PlainColorItem = ({item = {}, size, onClick, children, className}) => {
    const {code, value} = item
    return (<Tooltip title={code}>
            <div
                onClick={onClick}
                className={classnames(styles['item-val'], className)}
                style={{ backgroundColor: value , width: size, height: size}}
            >
                {children}
            </div>
        </Tooltip>)
}

export const FlowerColorItem = ({item = {}, size, onClick, children, className}) => {
    const {code, value} = item
    return (
        <Tooltip title={code}>
            <div
                onClick={onClick}
                className={classnames(styles['item-val'], styles['item-val-img'], className)}
                style={{ backgroundImage: `url(${filterImageUrl(value)}?tr=w-50)` , width: size, height: size}}
            >
                {children}
            </div>
        </Tooltip>)
}
