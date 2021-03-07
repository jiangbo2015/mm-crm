const api = location.host.includes('we-idesign.com') ? '' : process.env.APIURL;
const imgUrl = 'https://ik.imagekit.io/';
const svgUrl = 'http://8.209.64.159:3001/';
export { api, imgUrl, svgUrl };
