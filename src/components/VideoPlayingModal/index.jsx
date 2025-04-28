import React from 'react'
import { Modal } from 'antd'

import styles from './index.less'

export const VideoPlayingModal = ({modalProps, viedoUrl }) => {

    
    return (
        <Modal
            {...modalProps}
            width={1000}
            open
            footer={null}
            className={styles['enlarge-modal']}
            bodyStyle={{ display: 'flex', justifyContent: 'center', padding: '60px 40px'}}
        >
            <video controls autoPlay className={styles['capsule-item-video']}> 
                    <source src={viedoUrl}/>
                </video>
        </Modal>
    )
}

