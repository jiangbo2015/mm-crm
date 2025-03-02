import React from 'react'
import { Tooltip } from 'antd'
import classnames from 'classnames'
import {
    ZoomInOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import { filterImageUrl } from '@/utils/utils';
import styles from './index.less'

export const ItemBottomTools = ({item = {}, onClick}) => {
    return (
        <div
            onClick={onClick}
            className={classnames(styles['item-tools-box'])}
        >
            <Upload
                {...uploadProps}
                beforeUpload={beforeUpload}
                onChange={handleEditImg}
            >
                <EditOutlined />
            </Upload>
            <ZoomInOutlined/>
            <DeleteOutlined/>
        </div>
    )
}

