var path = require('path');
var fs = require('fs');
var request = require('request');
var axios = require('axios');

const random = arrars => arrars[Math.round(Math.random() * (arrars.length - 1))];
console.log(random([1, 2, 3]));

var url = 'http://192.168.124.25:3000/api/common/upload';

var dirs = fs.readdirSync('./images');

console.log(dirs);

const req = formData =>
    new Promise((resolve, reject) =>
        request.post(
            {
                url,
                formData,
            },
            (err, response, body) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve(response.body);
                    resolve(JSON.parse(body));
                }
            },
        ),
    );

async function start() {
    for (let i = 0; i < dirs.length; i++) {
        console.log(i, 'i');
        var names = ['imgUrl', 'shadowUrl', 'shadowUrl', 'shadowUrlBack', 'svgUrlBack'];
        const urls = await Promise.all(
            names.map(x => {
                return req({
                    file: fs.createReadStream(`./images/${i + 1}/${x}.png`),
                });
            }),
        );
        console.log(urls);
        var imgs = {};
        names.map((x, i) => (imgs[x] = urls[i]));
        axios({
            url: '',
            method: 'post',
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiJ9.eGl4aQ.Fwph4XiAGXz4WjH6kCIHS2JWS2Ot8JHQf2FQ0HF66Sw',
            },
            data: {
                // ...imgs,
                goodsId: '5e6e1d24ab374bec68f4981a',

                tags: random(['CENTER', 'SOUTHERN', 'NORTH']),

                styleNo: Date.now(),
                styleName: `S00${Date.now()}`,

                price: random([1, 2, 3, 4, 5, 6, 7]),

                currency: 1,

                categoryId: '5e6e1d24ab374bec68f4981c',
                categoryName: 'TOPS',

                imgUrl: 'uploads/2020-04-28/1588082887487.png',
                svgUrl: 'uploads/2020-04-28/1588082902304.png',
                svgUrlBack: 'uploads/2020-04-28/1588082908368.png',
                shadowUrl: 'uploads/2020-04-28/1588082905171.png',
                shadowUrlBack: 'uploads/2020-04-28/1588082919994.png',
            },
        });
    }
}

start();
