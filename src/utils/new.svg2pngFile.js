import fixupSvgString from './fixup-svg-string';
import { filterImageUrl } from './utils';
/**
 * Serialize the active SVG DOM to a string.
 * @param {?boolean} shouldInjectFonts True if fonts should be included in the SVG as
 *     base64 data.
 * @returns {string} String representing current SVG data.
 */
const svg2String = svg => {
    const parser = new DOMParser();
    const svgString = fixupSvgString(svg);
    const svgDom = parser.parseFromString(svgString, 'text/xml');
    const serializer = new XMLSerializer();
    let string = serializer.serializeToString(svgDom);
    return string;
};

const dataURL2File = (dataurl, filename) => {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export default (svg, shadowUrl, width = 540) => {
    console.log('svg to file 0')
    let promise = new Promise(resolve => {
        console.log('svg to file 1')
        var canvas = document.createElement('canvas');
        var c = canvas.getContext('2d');
        const string = svg2String(svg);
        //新建Image对象
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        var url = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(string)));

        //svg内容
        img.src = url; //svg内容中可以有中文字符
        console.log('svg to file 2')
        //图片初始化完成后调用
        img.onload = function() {
            console.log('svg onload');
            // document.body.appendChild(img)

            //将canvas的宽高设置为图像的宽高
            canvas.width = width;
            canvas.height = (width * img.height) / img.width;

            //canvas画图片
            c.drawImage(img, 0, 0, width, (width * img.height) / img.width);

            //将图片添加到body中
            var img2 = new Image();
            img2.setAttribute('crossOrigin', 'anonymous');
            console.log('filterImageUrl(shadowUrl);', shadowUrl, filterImageUrl(shadowUrl));
            img2.src = filterImageUrl(shadowUrl);
            img2.onload = function() {
                // // console.log('showurl onload');
                c.drawImage(img2, 0, 0, width, (width * img.height) / img.width);
                var dataurl = canvas.toDataURL('image/png');
                let file = dataURL2File(dataurl);
                // let imgBlob = dataURL2Blob(dataurl) file
                resolve({ file });
            };
        };
    });
    return promise;
};
