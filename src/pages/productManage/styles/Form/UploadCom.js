import React, { useState } from 'react';
import { api } from '@/utils/apiconfig';
import { Form, Input, Row, Select, Col, Upload, Icon, Divider, Button, notification } from 'antd';
import styles from './index.less';
export const Avatar = ({ src }) => (
    <img src={`${api}/${src}`} alt="avatar" style={{ width: '100%' }} />
);

const typeProps = {
    front: '前视图',
    backend: '后视图',
    left: '左视图',
};
export const uploadProps = {
    name: 'file',
    listType: 'picture-card',
    className: styles.uploader,
    showUploadList: false,
    action: `${api}/api/common/upload`,
};

export const UploadBtn = ({ type }) => (
    <div>
        <Icon type={type} />
        <div className="ant-upload-text">Upload</div>
    </div>
);

const UploadCom = ({ type, isPlain, handleChange, selectedPlainColor, selectedFlowerColor }) => {
    console.log(type, typeProps[type]);
    const selected = isPlain ? selectedPlainColor : selectedFlowerColor;
    return (
        <Col span="8" className={styles.center}>
            <div className={styles.title}>{typeProps[type]}</div>
            <Upload
                {...uploadProps}
                onChange={info => {
                    handleChange(info, type, isPlain);
                }}
            >
                {selected[type] ? (
                    <Avatar src={`${selected[type]}`}></Avatar>
                ) : (
                    <UploadBtn
                        type={selected.utype === type && selected.loading ? 'loading' : 'plus'}
                    ></UploadBtn>
                )}
            </Upload>
        </Col>
    );
};

export default UploadCom;
