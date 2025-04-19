import React, { useState, useEffect } from 'react'
import { Modal, Button, Spin,Tag, Input, Radio, Divider } from 'antd';
import { getLocale } from 'umi';
import Slider from "react-slick";
import { get, map, split, fill } from 'lodash'
import classnames from 'classnames'
import { ReactSVG } from 'react-svg';
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';


import { filterImageUrl } from '@/utils/utils';

import StyleAndColors from '@/components/StyleAndColorsCom'
import { ColorItem } from '@/components/ColorItem'

import fabricSvg from '@/assets/fabric.svg'
import RandomSpeedProgress from '../RandomSpeedProgress'
import useDiyEditor from '../../../../hooks/useDiyEditor'

import styles from './index.less'

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <ArrowRightOutlined
        className={className}
        style={{ ...style, fontSize: "20px", color: "#000" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <ArrowLeftOutlined
        className={className}
        style={{ ...style, fontSize: "20px", color: "#000" }}
        onClick={onClick}
      />
    );
  }
  

  
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

export const DesignStyleEditor = ({modalProps = {}, onClick}) => {
    const selectLang = getLocale()
    const isZhCN = selectLang === 'zh-CN'
    const { 
        currentEditCapsuleItem, 
        currentEditCapsuleItemFinishedIndex, 
        currentEditCapsuleStyleRegion,
        handleUpdateCapsuleItem,
        handleUpdateCurrentEditCapsuleStyleRegion,
        plainColors,
        flowerColors,
        textures,
        uploadStyleImage,
        handleCompleteCapsuleItemFinished,
        customPlainColors,
        customFlowerColors,
    } = useDiyEditor()
    const style = get(currentEditCapsuleItem, 'style', {})
    const finishedStyleColors = get(currentEditCapsuleItem, `finishedStyleColorsList.${currentEditCapsuleItemFinishedIndex}`)

    const [styleSvgGroups, setStyleSvgGroups] = useState([])
    const [colors, setColors] = useState([])
    const [texture, setTexture] = useState(null)
    const [createImgloading, setCreateImgLoading] = useState(false)

    useEffect(() => {
        // 定义事件处理函数
        const handleClick = () => {
            handleUpdateCurrentEditCapsuleStyleRegion(-1)
        };

        // 添加事件监听器
        document.addEventListener('click', handleClick);

        // 清理函数：在组件卸载时移除事件监听器
        return () => {
            handleUpdateCurrentEditCapsuleStyleRegion(-1)
            document.removeEventListener('click', handleClick);
        };
    }, []); // 空依赖数组表示只在组件挂载和卸载时执行

    useEffect(() => {
      if(finishedStyleColors) {
        setColors([...get(finishedStyleColors,'colors', [])])
        setTexture({...get(finishedStyleColors, 'texture', {})})
      }
    }, [finishedStyleColors])

    const handleFillColor = (color) => {
        if(currentEditCapsuleStyleRegion === -2) {// 全选
            setColors(fill(Array(styleSvgGroups.length), color))
        } else { 
            colors[currentEditCapsuleStyleRegion] = color;
            setColors([...colors])
            
        }
        
        
    }

    const handleCancel = () => {
        handleUpdateCurrentEditCapsuleStyleRegion(-1)
        handleUpdateCapsuleItem(-1, -1)
    }

    const handleOk = async () => {
        handleUpdateCurrentEditCapsuleStyleRegion(-1)
        setCreateImgLoading(true);
        // 等待选择svg高亮被取消
        await wait(1000);

        const svgFrontId = `${style._id}-front`
        const svgBackId =  `${style._id}-back`

        const svgFrontString = document.getElementById(svgFrontId)?.outerHTML;
        const svgBackString = document.getElementById(svgBackId)?.outerHTML;

        const [resultFront, resultBack] = await Promise.all([
            uploadStyleImage(svgFrontString, style?.shadowUrl),
            uploadStyleImage(svgBackString, style?.shadowUrlBack),
        ]);

        
        // 两个调用都成功后，打印结果
        
        const imgUrlFront = get(resultFront, 'url')
        const imgUrlBack = get(resultBack, 'url')

        const finishedObj = {
            colors,
            texture,
            imgUrlFront,
            imgUrlBack
        }

        handleCompleteCapsuleItemFinished(finishedObj)

        setCreateImgLoading(false)
        handleCancel()
    }
    return (
        <Modal
            {...modalProps}
            closable={false}
            width={1000}
            open
            footer={null}
            className={styles['design-style-modal']}
        >
            <Spin spinning={createImgloading} indicator={null} delay={1000} tip={<RandomSpeedProgress loading={createImgloading} />}>
                <div className={styles['style-code']}>{style?.styleNo}</div>
                <div className={styles['design-style-modal-header']}>
                    <div className={styles['textures-selector']}>
                        <ReactSVG
                            src={fabricSvg}
                            style={{
                                width: '26px',
                                height: '26px',
                            }}
                        />
                        面料选择<DoubleRightOutlined style={{margin: '0 12px'}}/>
                        <div style={{display: 'flex'}} value={texture?._id} size='small' >
                            {map(textures, t => (
                                <div 
                                    style={{
                                        padding: '0 8px',
                                        fontWeight: t?._id === texture?._id ? 'bold':'normal',
                                        cursor:  'pointer'                                    }}
                                    onClick={()=> {
                                        setTexture(t)
                                    }} 
                                    type='text'>
                                    {t?.code}
                                </div>)
                            )}
                        </div>
                    </div>
                    <div className={styles['action-buttons']}>
                        <Button onClick={handleCancel} style={{marginRight: '8px'}}>取消</Button>
                        <Button onClick={handleOk} type='primary'>完成</Button>
                    </div>
                </div>
                <div className={styles['design-style-wrapper']}>
                    <div className={styles['design-style']} style={{ alignItems: style?.vposition }}>
                        <StyleAndColors
                            width={`${(280 * style.styleSize) / 27}px`}
                            styleId={`${style._id}-front`}
                            svgId={`${style._id}-front`}
                            colors={colors}
                            {...style}
                            style={{
                                cursor: 'pointer',
                            }}
                            texture={texture}
                            showGroupStroke={true}
                            curStylesEditGroupIndex={currentEditCapsuleStyleRegion}
                            onSetEditSvgGroupIndex={handleUpdateCurrentEditCapsuleStyleRegion}
                            onAfterInjection={(groups)=> {
                                // setStyleSvgGroups(groups)
                                if(styleSvgGroups.length <= 0) {
                                    setStyleSvgGroups(groups)
                                    console.log('setStyleSvgGroups', groups)
                                }
                                
                            }}
                        />
                    </div>
                    <div className={styles['design-style']} style={{ alignItems: style?.vposition }}>
                        <StyleAndColors
                            width={`${(280 * style.styleBackSize) / 27}px`}
                            styleId={`${style._id}-back`}
                            svgId={`${style._id}-back`}
                            colors={colors}
                            texture={texture}
                            {...style}
                            svgUrl={style.svgUrlBack}
                            shadowUrl={style.shadowUrlBack}
                            style={{
                                cursor: 'pointer',
                            }}
                            showGroupStroke={true}
                            curStylesEditGroupIndex={currentEditCapsuleStyleRegion}
                            onSetEditSvgGroupIndex={handleUpdateCurrentEditCapsuleStyleRegion}
                        />
                    </div>
                </div>
                <div className={styles['style-diy-selector-wrapper']}>
                    <div className={styles['colors-slider-selector']}>
                        <div className={styles['colors-slider']} >
                            <Slider {...settings} infinite={plainColors.length + customPlainColors.length > 5}>
                                {map(plainColors, color => 
                                    <ColorItem 
                                        key={`s-${color?._id}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                            handleFillColor(color)
                                        }} 
                                        item={color} size={24} 
                                    /> 
                                )}
                                <Divider type="vertical" />
                                {map(customPlainColors, color => 
                                    <ColorItem 
                                        key={`s-${color?._id}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                            handleFillColor(color)
                                        }} 
                                        item={color} size={24} 
                                    /> 
                                )}
                                
                            </Slider>
                        </div>
                    </div>
                    <div className={styles['style-group-selector']}>
                        <div 
                            className={classnames(styles['svg-group-btn'], currentEditCapsuleStyleRegion === -2 ? styles['svg-group-btn-active'] : '')} 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                handleUpdateCurrentEditCapsuleStyleRegion(-2)
                            }}
                        >
                            {isZhCN ? '全部' : 'ALL'}
                        </div>
                        {map(styleSvgGroups, 
                            g => <div 
                                    className={classnames(styles['svg-group-btn'], currentEditCapsuleStyleRegion === g?.index ? styles['svg-group-btn-active'] : '')} 
                                    key={`${g?.index}-group-btn`} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                        handleUpdateCurrentEditCapsuleStyleRegion(g?.index)
                                    }}
                                >
                                    {get(split(g.id, '_x2F_'), isZhCN ? 0 : 1)}
                                </div>
                        )}
                    </div>
                    <div className={styles['colors-slider-selector']}>
                        <div className={styles['colors-slider']} >
                            <Slider {...settings} infinite={flowerColors.length + customFlowerColors.length > 5}>
                                {map(flowerColors, color => 
                                    <ColorItem 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                            handleFillColor(color)
                                        }} item={color} size={24}
                                    />
                                )}
                                <Divider type="vertical" />
                                {map(customFlowerColors, color => 
                                    <ColorItem 
                                        key={`s-${color?._id}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                            handleFillColor(color)
                                        }} 
                                        item={color} size={24} 
                                    /> 
                                )}
                            </Slider>
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
    )
}