const api = location.host.includes('we-idesign.com') ? '' : process.env.APIURL;
const imgUrl = 'https://ik.imagekit.io/';
const svgUrl = location.host.includes('we-idesign.com') ? 'https://we-idesign.com/' : 'http://8.209.64.159:3001/';
export { api, imgUrl, svgUrl };
