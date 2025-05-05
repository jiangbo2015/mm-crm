import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Select, Col, Upload, Divider, Button, notification, message } from 'antd';
import styles from './index.less';
const { Option } = Select;
const { Search } = Input;
var isHexcolor = require('is-hexcolor');
import { connect } from 'dva';
import { api } from '@/utils/apiconfig';
import UploadComPro, { Avatar, uploadProps, UploadBtn } from './UploadCom';
import {intl} from '@/utils/utils'

const selectProps = {
    showSearch: true,
    value: '',
    placeholder: '搜索',
    defaultActiveFirstOption: false,
    showArrow: false,
    filterOption: false,
    notFoundContent: '',
};

const Thumb = ({ type, value, active, onClick, code }) => {
    if (type === 0) {
        return (
            <div className={styles.thumbWrap} onClick={onClick}>
                <div
                    style={{ background: value, borderColor: active ? 'red' : '#fff' }}
                    className={styles.thumb}
                ></div>
                {code}
            </div>
        );
    }
    return (
        <div className={styles.thumbWrap} onClick={onClick}>
            <img
                className={styles.thumb}
                src={value}
                style={{ borderColor: active ? 'red' : '#fff' }}
            />
            {code}
        </div>
    );
};

@connect(state => ({
    colorList: state.style.colorList || [],
    queryPlainColor: state.style.queryPlainColor || [],
    queryFlowerColor: state.style.queryFlowerColor || [],
    plainColors: state.style.plainColors || [],
    flowerColors: state.style.flowerColors || [],
}))
class RegistrationForm extends React.Component {
    state = {
        loading: false,
        styleImgUrl: '',
        currentCategorys: [],
        selectedPlainColor: {},
        selectedFlowerColor: {},
        preAddImgUrl: '',
    };

    /**
     * 如果已经选择了对应前视图等，要更新对应列表
     */
    updateSelectedColor = (selected, isPlain) => {
        this.props.dispatch({
            type: 'style/setSelectedColor',
            payload: {
                type: isPlain ? 0 : 1,
                data: selected,
            },
        });
    };

    handleChange = (info, type, isPlain) => {
        const { selectedPlainColor, selectedFlowerColor } = this.state;
        const selected = isPlain ? selectedPlainColor : selectedFlowerColor;
        const selectedKey = [isPlain ? 'selectedPlainColor' : 'selectedFlowerColor'];
        const { status, response } = info.file;
        selected.utype = type;
        if (status === 'uploading') {
            selected.loading = true;
            this.setState({
                [selectedKey]: selected,
            });
            this.updateSelectedColor(selected, isPlain);
            return;
        }
        if (status === 'done') {
            selected[type] = response.data.url;
            selected.loading = false;
            this.setState({
                [selectedKey]: selected,
            });
        }
    };

    handlePreAddImgChange = (info, type) => {
        console.log(info, type);
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                preAddImgUrl: info.file.response.data.url,
                loading: false,
            });
        }
    };

    handleQueryPlain = value => {
        console.log(value);
        this.props.dispatch({
            type: 'style/getQueryColor',
            payload: {
                type: 0,
                code: value,
            },
        });
    };
    handleQueryFlower = value => {
        console.log(value);
        if (value) {
            this.props.dispatch({
                type: 'style/getQueryColor',
                payload: {
                    type: 1,
                    code: value,
                },
            });
        }
    };

    handleQueryPlainChange = value => {
        console.log(value);
        if (!this.props.plainColors.some(x => x._id === value)) {
            this.props.dispatch({
                type: 'style/setSelectedColor',
                payload: {
                    type: 0,
                    data: this.props.queryPlainColor.find(x => x._id === value),
                },
            });
        }
    };

    handleQueryFlowerChange = value => {
        console.log(value);
        if (!this.props.flowerColors.some(x => x._id === value)) {
            this.props.dispatch({
                type: 'style/setSelectedColor',
                payload: {
                    type: 1,
                    data: this.props.queryFlowerColor.find(x => x._id === value),
                },
            });
        }
    };

    addPlainColor = value => {
        if (isHexcolor(value)) {
            this.props.dispatch({
                type: 'style/addColor',
                payload: {
                    type: 0,
                    value,
                },
            });
        } else {
            notification.error({
                message: '颜色格式不合法',
            });
        }
    };

    handleConfirmAdd = () => {
        const { preAddImgUrl } = this.state;
        if (!preAddImgUrl) {
            message.error('请上传图片');
            return;
        }
        this.props.dispatch({
            type: 'style/addColor',
            payload: {
                type: 1,
                value: preAddImgUrl,
            },
        });
        this.setState({
            preAddImgUrl: '',
        });
    };

    setCurrentColor = (value, type) => {
        console.log(value, type);
        this.setState({
            [type]: value,
        });
    };

    render() {
        const { plainColors, flowerColors } = this.props;
        const { selectedFlowerColor, selectedPlainColor, styleImgUrl, preAddImgUrl } = this.state;
        const uploadProProps = {
            handleChange: this.handleChange.bind(this),
            selectedPlainColor: selectedPlainColor,
            selectedFlowerColor: selectedFlowerColor,
        };

        return (
            <>
                <Row gutter={[24]}>
                    <Col span="12">
                        <Form.Item label={intl("素色")}>
                            <Select
                                {...selectProps}
                                onSearch={this.handleQueryPlain}
                                onChange={this.handleQueryPlainChange}
                            >
                                {this.props.queryPlainColor.map((item, index) => (
                                    <Option key={index} value={item._id}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {item.code}
                                            <div
                                                className={styles.miniThumb}
                                                style={{ background: item.value }}
                                            ></div>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className={styles.flexWrap}>
                            {plainColors.map((x, index) => (
                                <Thumb
                                    key={index}
                                    type={0}
                                    value={x.value}
                                    code={x.code}
                                    onClick={e => this.setCurrentColor(x, 'selectedPlainColor')}
                                    active={selectedPlainColor._id === x._id}
                                ></Thumb>
                            ))}
                        </div>
                        <Search
                            placeholder="请输入颜色值"
                            enterButton={intl("添加素色")}
                            onSearch={this.addPlainColor}
                            style={{ marginBottom: '10px' }}
                        />
                    </Col>
                    <Col span="12">
                        {selectedPlainColor._id && (
                            <Row gutter={[20]}>
                                <UploadComPro
                                    type="front"
                                    isPlain={true}
                                    {...uploadProProps}
                                ></UploadComPro>
                                <UploadComPro
                                    type="backend"
                                    isPlain={true}
                                    {...uploadProProps}
                                ></UploadComPro>
                                <UploadComPro
                                    type="left"
                                    isPlain={true}
                                    {...uploadProProps}
                                ></UploadComPro>
                            </Row>
                        )}
                    </Col>
                </Row>
                <Divider className={styles.divider}></Divider>
                <Row gutter={[24]}>
                    <Col span="12">
                        <Form.Item label={intl("花色")}>
                            <Select
                                {...selectProps}
                                onSearch={this.handleQueryFlower}
                                onChange={this.handleQueryFlowerChange}
                            >
                                {this.props.queryFlowerColor.map((item, index) => (
                                    <Option key={index} value={item._id}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {item.code}
                                            <img
                                                className={styles.miniThumb}
                                                src={`${api}/${item.value}`}
                                            />
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <div className={styles.flexWrap}>
                            {flowerColors.map((x, index) => (
                                <Thumb
                                    key={index}
                                    type={1}
                                    code={x.code}
                                    active={selectedFlowerColor._id === x._id}
                                    onClick={e => this.setCurrentColor(x, 'selectedFlowerColor')}
                                    value={`${api}/${x.value}`}
                                ></Thumb>
                            ))}
                        </div>
                        <Row>
                            <Col span="12" style={{ textAlign: 'center' }}>
                                <Upload {...uploadProps} onChange={this.handlePreAddImgChange}>
                                    {preAddImgUrl ? (
                                        <Avatar src={preAddImgUrl} />
                                    ) : (
                                        <UploadBtn
                                            type={this.state.loading ? 'loading' : 'plus'}
                                        ></UploadBtn>
                                    )}
                                </Upload>
                                <Button type="primary" onClick={this.handleConfirmAdd}>
                                    {intl('确认添加')}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="12">
                        {selectedFlowerColor._id && (
                            <Row gutter={[20]}>
                                <UploadComPro type="front" {...uploadProProps}></UploadComPro>
                                <UploadComPro type="backend" {...uploadProProps}></UploadComPro>
                                <UploadComPro type="left" {...uploadProProps}></UploadComPro>
                            </Row>
                        )}
                    </Col>
                </Row>
            </>
        );
    }
}

export default RegistrationForm;
