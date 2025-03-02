import React, { useState, useEffect } from 'react'
import { Modal, Button, Menu,Tag, Input, Drawer, Radio } from 'antd';
import Slider from "react-slick";
import { get, map } from 'lodash'
import classnames from 'classnames'
import {
    ZoomInOutlined,
    EditOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';


import { filterImageUrl } from '@/utils/utils';

import StyleAndColors from '@/components/StyleAndColorsCom'
import { ColorItem } from '@/components/ColorItem'
import useDiyEditor from '../../../../hooks/useDiyEditor'

import styles from './index.less'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6
  };

export const DesignStyleEditor = ({modalProps = {}, onClick}) => {
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
        handleCompleteCapsuleItemFinished
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
        window.addEventListener('click', handleClick);

        // 清理函数：在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []); // 空依赖数组表示只在组件挂载和卸载时执行

    useEffect(() => {
      if(finishedStyleColors) {
        setColors(finishedStyleColors?.colors)
        setTexture(finishedStyleColors?.texture)
      }
    }, [finishedStyleColors])

    const handleFillColor = (color) => {
        colors[currentEditCapsuleStyleRegion] = color;
        setColors([...colors])
    }

    const handleCancel = () => {
        handleUpdateCapsuleItem(-1, -1)
    }

    const handleOk = async () => {
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
            <div className={styles['design-style-modal-header']}>
                <div className={styles['textures-selector']}>
                    面料选择<DoubleRightOutlined />
                    <div>{map(textures, t => (<Button onClick={()=> {
                        setTexture(t)
                    }} type='text'>{t?.code}</Button>))}</div>
                </div>
                <div className={styles['action-buttons']}>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button onClick={handleOk} type='primary' >完成</Button>
                </div>
            </div>
            <div className={styles['design-style-wrapper']}>
                <div className={styles['design-style']} style={{ alignItems: style?.vposition }}>
                    <StyleAndColors
                        width={`${(280 * style.styleSize) / 27}px`}
                        styleId={`${style._id}-front`}
                        svgId={`${style._id}-front`}
                        colors={colors}
                        key={`${style._id}-${Math.random() * 1000000}`}
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
                        key={`${style._id}-${Math.random() * 1000000}`}
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
                        <Slider {...settings}>
                            {map(plainColors, color => 
                                <ColorItem 
                                    onClick={() => {
                                        handleFillColor(color)
                                    }} 
                                    item={color} size={24} 
                                /> 
                            )}
                        </Slider>
                    </div>
                </div>
                <div className={styles['style-group-selector']}>
                    {map(styleSvgGroups, 
                        g => <div 
                                className={classnames(styles['svg-group-btn'], currentEditCapsuleStyleRegion === g?.index ? styles['svg-group-btn-active'] : '')} 
                                key={`${g?.index}-group-btn`} 
                                onClick={() => {
                                    handleUpdateCurrentEditCapsuleStyleRegion(g?.index)
                                }}
                            >
                                {g.index}
                            </div>
                    )}
                </div>
                <div className={styles['colors-slider-selector']}>
                    <div className={styles['colors-slider']} >
                        <Slider {...settings}>
                            {map(flowerColors, color => 
                                <ColorItem 
                                    onClick={() => {
                                        handleFillColor(color)
                                    }} item={color} size={24}
                                />
                            )}
                        </Slider>
                    </div>
                </div>
            </div>
        </Modal>
    )
}