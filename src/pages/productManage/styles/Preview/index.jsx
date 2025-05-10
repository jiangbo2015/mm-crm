import React, { Component } from 'react';
import { connect } from 'dva';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Spin, Row, Col, Slider, InputNumber, Button } from 'antd';

import ReactSVG from './react-svg';
import StyleImg from './style-img';
import ColorList from './ColorList';
import StyleAndColors from '@/components/StyleAndColorsCom'
import styles from './index.less';
import { api } from '@/utils/apiconfig';
import { injectIntl } from 'umi'

@connect(state => ({
    // styleId: state.style._id || '',
    // styleAttrs: state.style.attrs || [],
    svgText: state.style.svgText || '',
    svgBackText: state.style.svgBackText || '',
    queryPlainColor: state.style.queryPlainColor || '',
    queryFlowerColor: state.style.queryFlowerColor || '',
    queryTexture: state.style.queryTexture || '',
}))
class Preview extends Component {
    constructor(props) {
        super(props);
        const { shadowUrl, shadowUrlBack } = props;
        this.state = {
            svg: '',
            shadowUrl: shadowUrl,
            svgBack: '',
            shadowUrlBack: shadowUrlBack,
            imgVals: {
                scale: 1,
                x: 0,
                y: 0,
            },
            curEditGroupIndex: -1,
            curColors: [],
            curColor: { type: 0 },
            curTexture: '',
        };
        this.props.dispatch({
            type: 'style/getQueryColor',
            payload: {
                type: 0,
                limit: 1030,
                page: 1,
            },
        });
        this.props.dispatch({
            type: 'style/getQueryColor',
            payload: {
                type: 1,
                limit: 1030,
                page: 1,
            },
        });
        this.props.dispatch({
            type: 'style/getQueryColor',
            payload: {
                type: 2,
                limit: 1030,
                page: 1,
            },
        });
    }
    handleDocumentClick = (e) => {
        // 处理点击事件
        this.setState({
            curEditGroupIndex: -1
        })
    };
    
    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }
    addColorSelectListener(color) {
        let { curColors, curEditGroupIndex } = this.state;
        let attrsIndex = this.props.attrs.find(x => x.colorId === color._id);
        console.log({ attrsIndex });
        let tempAttr = attrsIndex
            ? attrsIndex
            : {
                  scale: 1,
                  x: 0,
                  y: 0,
              };
        curColors[curEditGroupIndex] = color;
        this.setState({ curColor: color, imgVals: { ...tempAttr }, curColors: [...curColors] });
    }

    addTextureSelectListener(texture) {
        this.setState({
            curTexture: texture,
        });
    }
    handleSetCurEditGroupIndex(index) {
        console.log('handleSetCurEditGroupIndex(index)=>', index);
        this.setState({
            curEditGroupIndex: index,
        });
    }
    changeImgColorPos(x, y) {
        this.setState({
            imgVals: {
                ...this.state.imgVals,
                x: this.state.imgVals.x + x,
                y: this.state.imgVals.y + y,
            },
        });
    }

    onScaleChange(scale) {
        this.setState({
            imgVals: { ...this.state.imgVals, scale },
        });
    }

    onSearchColor(params) {
        this.props.dispatch({
            type: 'style/getQueryColor',
            payload: {
                limit: 1030,
                page: 1,
                ...params,
            },
        });
    }

    handleSaveImgVals() {
        const { curColor, imgVals } = this.state;
        const { _id } = this.props;
        this.props.dispatch({
            type: 'style/updateArr',
            payload: {
                colorId: curColor._id,
                ...imgVals,
                _id,
            },
        });
        let newAttrs = [...this.props.attrs];
        let attrsIndex = this.props.attrs.findIndex(x => x.colorId === curColor._id);
        if (attrsIndex >= 0) {
            newAttrs[attrsIndex] = {
                colorId: curColor._id,
                ...imgVals,
            };
        } else {
            newAttrs.push({
                colorId: curColor._id,
                ...imgVals,
            });
        }

        this.props.onSetData({
            ...this.props.data,
            attrs: newAttrs,
        });
    }
    render() {
        const {
            intl,
            styleId,
            svgUrl,
            svgUrlBack,
            queryPlainColor,
            queryFlowerColor,
            queryTexture,
            shadowUrl,
            shadowUrlBack,
            styleSize = 27,
            styleBackSize = 27,
            displaySizePer = 100,
            vposition,
        } = this.props;
        console.log('this.props', this.props);
        const { imgVals, curColors, curColor, curTexture } = this.state;
        return (
            <div>
                {svgUrl ? (
                    <div>
                        <Row type="flex" justify='space-between'>
                            <Col span={7} onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}>
                                <ColorList
                                    onSearch={this.onSearchColor.bind(this)}
                                    type={2}
                                    colorListData={queryTexture.docs}
                                    onSelect={this.addTextureSelectListener.bind(this)}
                                />
                            </Col>
                            <Col span={7} onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}>
                                <ColorList
                                    type={0}
                                    colorListData={queryPlainColor.docs}
                                    onSelect={this.addColorSelectListener.bind(this)}
                                    onSearch={this.onSearchColor.bind(this)}
                                />
                            </Col>
                            <Col span={7} onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}>
                                <ColorList
                                    onSearch={this.onSearchColor.bind(this)}
                                    type={1}
                                    colorListData={queryFlowerColor.docs}
                                    onSelect={this.addColorSelectListener.bind(this)}
                                />
                            </Col>
                        </Row>

                        <Row
                            type="flex"
                            style={{
                                marginBottom: 22,
                                alignItems: 'center',
                            }}
                        >
                            <Col span={2} onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}>
                                <b>{intl.formatMessage({id: '花布缩放'})}：</b>
                            </Col>
                            <Col
                                span={12}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                type="flex"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                }}
                            >
                                {/* <Row type="flex"> */}
                                <MinusSquareOutlined />
                                {/* <div> */}
                                <Slider
                                    style={{ width: '100%' }}
                                    step={0.1}
                                    min={0}
                                    max={2}
                                    value={imgVals.scale}
                                    onChange={this.onScaleChange.bind(this)}
                                    defaultValue={30}
                                    disabled={curColor.type === 0}
                                />
                                {/* </div> */}
                                <PlusSquareOutlined />
                                {/* </Row> */}
                            </Col>
                            <Col span={4} onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}>
                                <InputNumber
                                    onChange={this.onScaleChange.bind(this)}
                                    value={imgVals.scale}
                                    style={{ marginLeft: 16 }}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    disabled={curColor.type === 0}
                                />
                            </Col>
                            {/* <Col span={4}>
                                {curColor.type ? (
                                    <Button
                                        type="primary"
                                        onClick={this.handleSaveImgVals.bind(this)}
                                    >
                                        保存
                                    </Button>
                                ) : null}
                            </Col> */}
                        </Row>
                        <Row
                            style={{ overflow: 'hidden', display: 'flex', alignItems: vposition, justifyContent: 'space-around' }}
                            ref={ref => (this.styleWrapper = ref)}
                        >

                            <StyleAndColors
                                texture={curTexture}
                                showGroupStroke={true}
                                svgId={styleId}
                                styleId={styleId}
                                styleSize={styleSize}
                                width={`${280 * displaySizePer / 100}px`}
                                svgUrl={svgUrl}
                                shadowUrl={shadowUrl}
                                colors={curColors}
                                imgVals={imgVals}
                                curStylesEditGroupIndex={this.state.curEditGroupIndex}
                                onSetEditSvgGroupIndex={this.handleSetCurEditGroupIndex.bind(
                                    this,
                                )}
                            />
                            <StyleAndColors
                                texture={curTexture}
                                showGroupStroke={true}
                                styleSize={styleSize}
                                svgId={`${styleId}-back`}
                                styleId={styleId}
                                width={`${(280 * styleBackSize * displaySizePer / 100) / styleSize}px`}
                                svgUrl={svgUrlBack}
                                shadowUrl={shadowUrlBack}
                                colors={curColors}
                                imgVals={imgVals}
                                curStylesEditGroupIndex={this.state.curEditGroupIndex}
                                onSetEditSvgGroupIndex={this.handleSetCurEditGroupIndex.bind(
                                    this,
                                )}
                            />
                        </Row>
                    </div>
                ) : (
                    <Spin></Spin>
                )}
            </div>
        );
    }
}

export default injectIntl(Preview);
