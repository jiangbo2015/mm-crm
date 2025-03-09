import React from 'react'
import { Modal } from 'antd'
import { get } from 'lodash'

import useDiy from '../../../../hooks/useDiy'
import { filterImageUrl } from '@/utils/utils';
import styles from './index.less'

export const EnlargeModal = ({modalProps = {}, capsuleItem, 
    finishedIndex }) => {
    const { handleEnlargeCapsuleItem } = useDiy()
    const { type, fileUrl, style, finishedStyleColorsList  } = capsuleItem
    
    return (
        <Modal
            {...modalProps}
            width={1000}
            open
            footer={null}
            className={styles['enlarge-modal']}
            bodyStyle={{ display: 'flex', justifyContent: 'center', padding: '60px 40px'}}
            onCancel={()=>{ handleEnlargeCapsuleItem(-1,-1)}}
        >
            {type === 'img' && <img className={styles['capsule-item-img']} src={filterImageUrl(fileUrl)}/>}
            {type === 'video' && 
                <video controls className={styles['capsule-item-video']}> 
                    <source src={filterImageUrl(fileUrl)}/>
                </video>
            }
            {type === 'style' && 
                <div className={styles['capsule-item-style']} style={{ alignItems: style?.vposition }}>
                    <img 
                        width={`${(280 * style.styleSize) / 27}px`}
                        src={filterImageUrl(get(finishedStyleColorsList, `${finishedIndex}.imgUrlFront`))}
                    />
                    <img 
                        width={`${(280 * style.styleBackSize) / 27}px`}
                        src={filterImageUrl(get(finishedStyleColorsList, `${finishedIndex}.imgUrlBack`))}
                    />
                </div>
            }
        </Modal>
    )
}

