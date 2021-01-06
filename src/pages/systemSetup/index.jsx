import React, { useState, useEffect } from 'react';
import { List, Card, Input, Button, notification, Row, Col, Upload, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { uploadProps, Avatar, UploadBtn } from '../productManage/colors/UploadCom';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { filterImageUrl } from '@/utils/utils';

const Com = ({ systemData, dispatch }) => {
    useEffect(() => {
        dispatch({
            type: 'system/get',
        });
    }, []);

    const [email, setEmail] = useState();
    const [meiyuan, setMeiyuan] = useState();
    const [ouyuan, setOuyuan] = useState();
    const [loading, setLoading] = useState({
        img1: false,
        img2: false,
        img3: false,
        exhibition1: false,
        exhibition2: false,
    });
    // const [colorImgUrl, setColorImgUrl] = useState(false);

    const [imgUrls, setImgUrl] = useState({
        img1: false,
        img2: false,
        img3: false,
        exhibition1: false,
        exhibition2: false,
    });
    const [carousels, setCarousels] = useState([]);
    useEffect(() => {
        setEmail(systemData.email);
        setMeiyuan(systemData.meiyuan);
        setOuyuan(systemData.ouyuan);
        setImgUrl({
            img1: systemData.img1,
            img2: systemData.img2,
            img3: systemData.img3,
            exhibition1: systemData.exhibition1,
            exhibition2: systemData.exhibition2,
        });
        if (systemData.carousels) {
            setCarousels(
                systemData.carousels.map(img => ({
                    uid: `cs-${img}`,
                    status: 'done',
                    url: filterImageUrl(img),
                    response: { data: { url: img } },
                    thumbUrl: filterImageUrl(img),
                })),
            );
        }
        // setColorImgUrl(props.img);
    }, [systemData]);

    const handleSubmit = () => {
        if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
            notification.error({
                message: '邮箱格式不合法',
            });
            return;
        }
        if (!meiyuan || !ouyuan || isNaN(meiyuan) || isNaN(ouyuan)) {
            notification.error({
                message: '汇率不合法',
            });
            return;
        }

        const tempCarousels = carousels.map(f => ({
            status: f.status,
            url: f.status == 'done' ? f.response.data.url : '',
        }));
        console.log('handleSubmit', tempCarousels);
        dispatch({
            type: 'system/update',
            payload: {
                email,
                ouyuan: parseFloat(ouyuan),
                meiyuan: parseFloat(meiyuan),
                // img: colorImgUrl,
                ...imgUrls,
                carousels: carousels.map(f => f.response.data.url),
            },
        });
    };
    const handleChange = info => {
        const { fileList } = info;
        // console.log(fileList);
        setCarousels(fileList);
    };

    const handleAddImg = (info, type) => {
        let temp = {};
        let tempUrl = {};
        if (info.file.status === 'uploading') {
            temp[type] = true;
            setLoading({ ...loading, ...temp });
            return;
        }
        if (info.file.status === 'done') {
            temp[type] = false;
            setLoading({ ...loading, ...temp });
            tempUrl[type] = info.file.response.data.url;
            setImgUrl({ ...imgUrls, ...tempUrl });
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <PageHeaderWrapper>
            <Card>
                <Input.Search
                    placeholder="输入系统邮箱"
                    enterButton="邮箱"
                    type="email"
                    size="default"
                    value={email || ''}
                    onChange={e => setEmail(e.target.value)}
                />
                <Input
                    style={{ margin: '20px 0' }}
                    addonBefore="1美元等于"
                    addonAfter="人民币"
                    value={meiyuan}
                    onChange={e => setMeiyuan(e.target.value)}
                />
                <Input
                    addonBefore="1欧元等于"
                    addonAfter="人民币"
                    value={ouyuan}
                    onChange={e => setOuyuan(e.target.value)}
                />
                <Divider orientation="left">封面图</Divider>
                <Row style={{ marginTop: '20px' }}>
                    <Col span="6">
                        <Upload
                            {...uploadProps}
                            onChange={info => {
                                handleAddImg(info, 'img1');
                            }}
                        >
                            {imgUrls.img1 ? (
                                <Avatar src={imgUrls.img1}></Avatar>
                            ) : (
                                <UploadBtn type={loading.img1 ? 'loading' : 'plus'}></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                    <Col span="6">
                        <Upload
                            {...uploadProps}
                            onChange={info => {
                                handleAddImg(info, 'img2');
                            }}
                        >
                            {imgUrls.img2 ? (
                                <Avatar src={imgUrls.img2}></Avatar>
                            ) : (
                                <UploadBtn type={loading.img2 ? 'loading' : 'plus'}></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                    <Col span="6">
                        <Upload
                            {...uploadProps}
                            onChange={info => {
                                handleAddImg(info, 'img3');
                            }}
                        >
                            {imgUrls.img3 ? (
                                <Avatar src={imgUrls.img3}></Avatar>
                            ) : (
                                <UploadBtn type={loading.img3 ? 'loading' : 'plus'}></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                </Row>
                <Divider orientation="left">胶囊展示图</Divider>
                <Row flex justify="center">
                    <Col>
                        <Upload
                            {...uploadProps}
                            // beforeUpload={this.beforeUpload}
                            className={styles.uploaderCapaule1}
                            onChange={args => handleAddImg(args, 'exhibition1')}
                        >
                            {imgUrls.exhibition1 ? (
                                <Avatar src={imgUrls.exhibition1}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={loading.exhibition1 ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                    <Col>
                        <Upload
                            {...uploadProps}
                            // beforeUpload={this.beforeUpload}
                            className={styles.uploaderCapaule2}
                            onChange={args => handleAddImg(args, 'exhibition2')}
                        >
                            {imgUrls.exhibition2 ? (
                                <Avatar src={imgUrls.exhibition2}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={loading.exhibition2 ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                </Row>
                轮播图：
                <Upload
                    {...uploadProps}
                    className={'block'}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={carousels}
                    showUploadList={true}
                    // itemRender={(originNode, file, currFileList) => {
                    //     console.log(file);
                    //     return <Avatar src={file.url}></Avatar>;
                    // }}
                    // onPreview={this.handlePreview}
                    onChange={handleChange}
                >
                    {carousels.length >= 8 ? null : uploadButton}
                </Upload>
                <Row type="flex" justify="center" style={{ margin: '20px' }}>
                    <Button type="primary" onClick={() => handleSubmit()}>
                        确认更新
                    </Button>
                </Row>
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    systemData: state.system,
}))(Com);
