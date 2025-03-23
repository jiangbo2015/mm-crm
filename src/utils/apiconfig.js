const api = location.host.includes('we-idesign.com') ? '' : process.env.APIURL;
const imgUrl = 'https://ik.imagekit.io/';
const svgUrl = '';
const preSvgUrl = 'https://crm.we-idesign.com/';
export { api, imgUrl, svgUrl, preSvgUrl };
