import React, { useEffect, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import { isFunction } from "lodash"
import { filterImageUrl } from '@/utils/utils';

import getDataUrl from 'get-dataurl'

function setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // 如果存储满了，先清除一部分旧数据
        console.warn("存储已满，尝试清理...");
        localStorage.clear(); // 或按需删除部分数据
        localStorage.setItem(key, value); // 重试
      } else {
        console.error("存储失败：", e);
      }
    }
  }

  
const SvgMaskGroupId = 'we-idesign-svg-mask-group'
const MaskTextureId = 'we-idesign-mask-texture'
export default React.memo(props => {
    const {
        texture,
        style = {},
        width = '100px',
        svgUrl,
        shadowUrl,
        key,
        colors = [],
        svgId,
        styleId,
        showGroupStroke,
        imgVals= {
            scale: 1,
            x: 0,
            y: 0,
        },
        imgValsAttrs = [],
        curStylesEditGroupIndex,
        onSetEditSvgGroupIndex,
        styleSize = 27,
        onClick,
        onAfterInjection
    } = props;
    const svgSrc = filterImageUrl(svgUrl)
    const MaskGroupID = `${SvgMaskGroupId}-${svgUrl}`
    if(!svgSrc) {
        // console.log('style', style)
        return null
    }
    console.log("texture", texture)
    return (
        <div
            style={{
                position: 'relative',
                width: width,
                ...style,
            }}
            onClick={onClick}
        >
            <img
                src={`${filterImageUrl(shadowUrl)}`}
                style={{
                    width: width,
                    position: 'absolute',
                    left: 0,
                    pointerEvents: 'none',
                }}
            />
            <ReactSVG
                style={{
                    width: width,
                    minWidth: '14px',
                    fill: '#fff',
                }}
                src={svgSrc}
                afterInjection={(error, svg) => {
                    if (error) {
                        console.log('svgSrc', svgSrc)
                        console.error(error);
                        return;
                    }
                    let j = 0;
                    const svgGroupArr = []
                    const newSvgMaskGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    for (let i = 0; i < svg.children.length; i++) {
                        if (svg.children[i].tagName === 'g' || svg.children[i].tagName === 'path') {
                            let block = svg.children[i];
                            block.removeAttribute('class');
                            block.removeAttribute('fill');
                            for (let i = 0; i < block.children.length; i++) {
                                let cblock = block.children[i];
                                cblock.removeAttribute('class');
                                cblock.removeAttribute('fill');
                            }
                            const clonedBlock = block.cloneNode(true);
                            // 将复制的 block 添加到新的 <g> 元素中
                            newSvgMaskGroup.appendChild(clonedBlock);

                            svgGroupArr.push({
                               id : block.id,
                               index : j,
                            })

                            if (onSetEditSvgGroupIndex) {
                                let jj = j;
                                block.onclick = e => {
                                    e.stopPropagation();
                                    onSetEditSvgGroupIndex(jj);
                                };
                                if (curStylesEditGroupIndex === j && showGroupStroke) {
                                    block.style.stroke = '#000';
                                    block.style.strokeWidth = '8px';
                                }
                            }
                            // svg.children[i].setAttribute('index', j);
                            if (colors && colors.length > 0 && j < colors.length && colors[j]) {
                                let block = svg.children[i];
                                block.style.fill = colors[j].type ? `url("#${styleId}-${colors[j]._id}-${j}")` : colors[j].value;
                            }
                            j++;
                        }
                    }

                    if(isFunction(onAfterInjection)){
                        onAfterInjection(svgGroupArr)
                    }

                    if(curStylesEditGroupIndex === -2) { // {intl("全选")}
                        svg.style.stroke = '#000';
                        svg.style.strokeWidth = '8px';
                    }
                    if(texture) {
                        newSvgMaskGroup.setAttribute("id", MaskGroupID)
                        newSvgMaskGroup.style.pointerEvents = 'none'; // 禁用指针事件
                        newSvgMaskGroup.style.fill = `url("#${MaskTextureId}")`
                        svg.appendChild(newSvgMaskGroup);
                    }
                    
                    // console.log('newSvgMaskGroup', newSvgMaskGroup)
                }}
                renumerateIRIElements={false}
                loading={() => {
                    return 'loading';
                }}
                beforeInjection={svg => {
                    // // console.log("curStylesEditGroupIndex", curStylesEditGroupIndex)
                    svg.setAttribute('id', svgId || key);

                    let svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    svg.appendChild(svgDefs);
                    
                    svg.setAttribute('style', `width: ${width}; height: 100%; font-size: 0px;`);

                    // 载入花布图
                    for (let i = 0; i < colors.length; i++) {
                        let color = colors[i];
                        if (color && color.type) {
                            // let imgVals = imgValsAttrs.find(x => x.colorId === color._id) || {
                            //     scale: 1,
                            //     x: 0,
                            //     y: 0,
                            // };
                            // // console.log("imgVals", imgVals)
                            let svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

                            svgPattern.setAttribute('id', `${styleId}-${color._id}-${i}`);
                            // editPatterns[color._id] = svgPattern objectBoundingBox
                            // svgPattern.setAttribute('patternUnits', 'objectBoundingBox');
                            // svgPattern.setAttribute('patternContentUnits', 'objectBoundingBox');

                            svgPattern.setAttribute('patternUnits', 'userSpaceOnUse');
                            svgPattern.setAttribute('patternContentUnits', 'userSpaceOnUse');
                            if (svg.width.baseVal.unitType === 2) {
                                svg.setAttribute('width', `${svg.viewBox.baseVal.width}px`);
                            }
                            let W = ((color.size * svg.width.baseVal.value) / styleSize) * imgVals.scale;
                            let H = (W * color.height) / color.width;

                            svgPattern.setAttribute('width', `${parseInt(W)}px`);
                            svgPattern.setAttribute('height', `${parseInt(H)}px`);
                            svgPattern.x.baseVal.value = imgVals.x;
                            svgPattern.y.baseVal.value = imgVals.y;

                            let svgPatternImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');

                            svgPatternImage.setAttribute('width', `${parseInt(W)}px`);
                            svgPatternImage.setAttribute('height', `${parseInt(H)}px`);

                            // url载入
                            // svgPatternImage.href.baseVal = `${filterImageUrl(color.value)}`;
                            // svgPattern.appendChild(svgPatternImage);
                            // svgDefs.appendChild(svgPattern);

                            // data url载入
                            const localCacheDataUrl = localStorage.getItem(color.value)
                            if(localCacheDataUrl) {
                                svgPatternImage.href.baseVal = localCacheDataUrl;
                                    svgPattern.appendChild(svgPatternImage);
                                    svgDefs.appendChild(svgPattern);
                            } else {
                                getDataUrl(filterImageUrl(color.value), dataUrl => {
                                    setLocalStorage(color.value, `${dataUrl}`)
                                    svgPatternImage.href.baseVal = `${dataUrl}`;
                                    svgPattern.appendChild(svgPatternImage);
                                    svgDefs.appendChild(svgPattern);
                                });
                            }
                            
                        }
                    }
                    // 载入纹理图
                    if(texture) {
                            // // console.log("imgVals", imgVals)
                            let svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

                            svgPattern.setAttribute('id', MaskTextureId);

                            svgPattern.setAttribute('patternUnits', 'userSpaceOnUse');
                            svgPattern.setAttribute('patternContentUnits', 'userSpaceOnUse');
                            if (svg.width.baseVal.unitType === 2) {
                                svg.setAttribute('width', `${svg.viewBox.baseVal.width}px`);
                            }
                            let W = ((texture.size * svg.width.baseVal.value) / styleSize);
                            let H = (W * texture.height) / texture.width;

                            svgPattern.setAttribute('width', `${parseInt(W)}px`);
                            svgPattern.setAttribute('height', `${parseInt(H)}px`);

                            let svgPatternImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');

                            svgPatternImage.setAttribute('width', `${parseInt(W)}px`);
                            svgPatternImage.setAttribute('height', `${parseInt(H)}px`);

                            // svgPatternImage.href.baseVal = `${filterImageUrl(texture.value)}`;
                            // svgPattern.appendChild(svgPatternImage);
                            // svgDefs.appendChild(svgPattern);  
                            
                            const localCacheDataUrl = localStorage.getItem(texture.value)
                            if(localCacheDataUrl) {
                                svgPatternImage.href.baseVal = localCacheDataUrl;
                                    svgPattern.appendChild(svgPatternImage);
                                    svgDefs.appendChild(svgPattern);
                            } else {
                                getDataUrl(filterImageUrl(texture.value), dataUrl => {
                                    setLocalStorage(texture.value, `${dataUrl}`)
                                    svgPatternImage.href.baseVal = `${dataUrl}`;
                                    svgPattern.appendChild(svgPatternImage);
                                    svgDefs.appendChild(svgPattern);
                                });
                            }
                            
                    }
                }}
                evalScripts="always"
                
            />
        </div>
    );
}) 
