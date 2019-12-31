//fs stands for file system. For using system level we need to require fs.
const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')


/////////////////////////////////
///FILES

//This type of below code is synchronous code also known as blocking code.
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know avacado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File Written!!');

//This type of code below is non as asynchronous code.
//also this callbacks made by asyncrhnous code is called callback hell, the traingle pattern that has been made.
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log("error deteced");
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Data has been written');
//             });
//         });
//     });
// });
// console.log("Will read file!");

/////////////////////////////////
///SERVER


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);



    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        console.log(cardsHtml);
        res.end(output);
    }


    else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }


    else if (pathname === '/api') {
        res.writeHead(200, { 'content-type': 'Application/json' });
        res.end(data);
    }


    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'error detected ahhaahga'
        });
        res.end("<h1>Invalid Page<h1>");
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server started on port 8000');
});
