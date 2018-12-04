const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const cheerio = require('cheerio')
const superagent = require('superagent')

app.use(async (ctx, next) => {
    console.log('Process ${ctx.request.method} ${ctx.request.url}...')
    await next()
})

function getData(html) {
    let $ = cheerio.load(html)
    let data = []
    $('.ulist').each((index, element) => {
        let item = {
            main: {   
                title: $(element).find('.bold-item').text(),
                href: $(element).find('.bold-item a').attr('href')
            },
            others: []
        }
        $(element).find('.bold-item ~ li a').each((index, element) => {
            let others = {
                title: $(element).text(),
                href: $(element).attr('href')
            }
            item.others.push(others)
        })
        data.push(item)
    })
    return data
}

function printDate(data) {
    data.forEach(function(item) {
        if (item.main.title) {
            console.log(item.main.title + ' => 【' + item.main.href + ' 】\n')
            item.others.forEach(function(others) {
                console.log('       ' + others.title + ' => 【' + others.href + ' 】\n')
            })
        }
    })
}

router.get('/baiduNews/check', async (ctx, next) => {
    let url = superagent.get('https://news.baidu.com/')
    url.end(async(err, sres) => {
        if (err) {
            console.log('Error')
            return next(err)
        }
        let data = getData(sres.text)
        console.log(data)
        printDate(data)
    })
    ctx.body = '<h1>Crawler Success</h1>'
})

app.use(router.routes())
app.listen(3000)
console.log('app started at port 3000...')