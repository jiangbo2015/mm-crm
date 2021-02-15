import React, { useEffect, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
// import { Image } from 'rebass';

// import { imgUrl } from '@/utils/apiconfig';
import { filterImageUrl } from '@/utils/utils';

export default props => {
    const {
        width,
        style,
        svgUrl,
        shadowUrl,
        key,
        colors,
        svgId,
        styleId,
        imgVals = {
            scale: 1,
            x: 0,
            y: 0,
        },
        styleSize = 27,
        onSetEditSvgGroupIndex,
    } = props;

    return (
        <div
            style={{
                position: 'relative',
                width: width,
                ...style,
            }}
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
                afterInjection={(error, svg) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    if (colors && colors.length > 0) {
                        let j = 0;
                        for (let i = 0; i < svg.children.length; i++) {
                            if (
                                svg.children[i].tagName === 'g' ||
                                svg.children[i].tagName === 'path'
                            ) {
                                let block = svg.children[i];
                                for (let i = 0; i < block.children.length; i++) {
                                    let cblock = block.children[i];
                                    cblock.removeAttribute('class');
                                    cblock.removeAttribute('fill');
                                }
                                if (onSetEditSvgGroupIndex) {
                                    let jj = j;
                                    svg.children[i].onclick = e => {
                                        // console.log(e.target)
                                        onSetEditSvgGroupIndex(jj);
                                    };
                                }
                                // svg.children[i].setAttribute('index', j);
                                if (j < colors.length && colors[j]) {
                                    svg.children[i].style.fill = colors[j].type
                                        ? `url("#${styleId}-${colors[j]._id}-${j}")`
                                        : colors[j].value;
                                }
                                j++;
                            }
                        }
                    }
                }}
                renumerateIRIElements={false}
                loading={() => {
                    console.log('loading');
                    return 'loading';
                }}
                beforeInjection={svg => {
                    svg.setAttribute('id', svgId || key);
                    let svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    svg.appendChild(svgDefs);
                    svg.setAttribute('style', `width: ${width}; height: 100%`);

                    for (let i = 0; i < colors.length; i++) {
                        let color = colors[i];
                        if (color && color.type) {
                            console.log('imgVals', imgVals);
                            let svgPattern = document.createElementNS(
                                'http://www.w3.org/2000/svg',
                                'pattern',
                            );

                            svgPattern.setAttribute('id', `${styleId}-${color._id}-${i}`);
                            // editPatterns[color._id] = svgPattern
                            svgPattern.setAttribute('patternUnits', 'userSpaceOnUse');
                            svgPattern.setAttribute('patternContentUnits', 'userSpaceOnUse');
                            if (svg.width.baseVal.unitType === 2) {
                                svg.setAttribute('width', `${svg.viewBox.baseVal.width}px`);
                            }
                            let W =
                                ((color.size * svg.width.baseVal.value) / styleSize) *
                                imgVals.scale;
                            let H = (W * color.height) / color.width;

                            svgPattern.setAttribute('width', `${W}px`);
                            svgPattern.setAttribute('height', `${H}px`);
                            svgPattern.x.baseVal.value = imgVals.x;
                            svgPattern.y.baseVal.value = imgVals.y;

                            let svgPatternImage = document.createElementNS(
                                'http://www.w3.org/2000/svg',
                                'image',
                            );

                            svgPatternImage.setAttribute('width', `${W}px`);
                            svgPatternImage.setAttribute('height', `${H}px`);
                            svgPatternImage.href.baseVal = `${filterImageUrl(color.value)}`;

                            // editSvgs.svgDefs.appendChild(svgPattern)
                            svgPattern.appendChild(svgPatternImage);
                            svgDefs.appendChild(svgPattern);
                        }
                    }
                }}
                evalScripts="always"
                src={`${filterImageUrl(svgUrl)}`}
            />
        </div>
    );
};
