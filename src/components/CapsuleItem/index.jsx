import React from 'react'
import { get } from 'lodash'
import classnames from 'classnames'

import { filterImageUrl } from '@/utils/utils';
import styles from './index.less'

export const CapsuleItem = ({item, width, onClick, children, className, valClassName }) => {
    // console.log("item", item)
    // classnames(styles['item-val'], styles['item-val-img'], className)
    return (
    <div className={classnames(styles['aspect-ratio-box'], className)} style={{width: width}} onClick={onClick}>
        <div className={classnames(styles['capsule-item'], valClassName)}>
            <img 
                src={filterImageUrl(item.imgUrl || 
                        get(item, 'capsuleItems.0.fileUrl') || 
                        get(item, 'capsuleItems.0.finishedStyleColorsList.0.imgUrlFront'))
                }
                className={styles['upload-picture']} 
            />
            {children}
        </div>
    </div>
)}

