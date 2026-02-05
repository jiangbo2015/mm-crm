import React from 'react'
import { Modal } from 'antd';

import StyleAndColors from '@/components/StyleAndColorsCom'


import styles from './index.less'

export const EnlargeStyleModal = ({modalProps = {}, style = {}}) => {
 
    return (
        <Modal
            {...modalProps}
            width={1000}
            open
            footer={null}
            className={styles['design-style-modal']}
        >
            <div className={styles['design-style-wrapper']}>
                <div className={styles['design-style']} style={{ alignItems: style?.vposition }}>
                    <StyleAndColors
                        width={`${(200 * style.styleSize * style.displaySizePer / 100) / 27}px`}
                        styleId={`${style._id}-front`}
                        svgId={`${style._id}-front`}
                        {...style}
                        style={{
                            cursor: 'pointer',
                        }}
                        styleSize={style.styleSize}
                    />
                </div>
                <div className={styles['design-style']} style={{ alignItems: style?.vposition }}>
                    <StyleAndColors
                        width={`${(200 * style.styleBackSize * style.displaySizePer / 100) / 27}px`}
                        styleId={`${style._id}-back`}
                        svgId={`${style._id}-back`}
                        {...style}
                        svgUrl={style.svgUrlBack}
                        shadowUrl={style.shadowUrlBack}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <div className={styles['design-style-info']} >
                    <div>{style?.styleNo}</div>
                    <div>建议尺码：{style?.size}</div>
                </div>
            </div>
        </Modal>
    )
}