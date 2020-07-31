const api = location.host.includes('we-idesign.com') ? '' : process.env.APIURL;
const imgUrl = 'https://ik.imagekit.io/';
export { api, imgUrl };
