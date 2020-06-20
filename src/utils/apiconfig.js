const api = location.host.includes('we-idesign.com') ? '' : process.env.APIURL;

export { api };
