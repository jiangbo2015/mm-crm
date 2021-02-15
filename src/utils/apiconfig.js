const api = location.host.includes('we-idesign.com') ? '' : process.env.APIURL;
const imgUrl = 'https://ik.imagekit.io/';
const svgUrl = 'http://localhost:3001/';
export { api, imgUrl, svgUrl };
