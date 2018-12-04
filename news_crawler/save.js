const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const cheerio = require('cheerio')
const superagent = require('superagent')
const news = require('./mysql/module/news')

app.use(async (ctx, next) => {
    console.log('Process ${ctx.request.method} ${ctx.request.url}...')
    await next()
})

router.get('/baiduNews/save', async (ctx) => {
    let url = superagent.get('https://news.baidu.com/')
    url.end(async(err, sres) => {
        if (err) {
            console.log('Error')
            return next(err)
        }
        let $ = cheerio.load(sres.text)
        $('.ulist').each((index, element) => {
            (async () => {
                if ($(element).find('.bold-item').text()) {
                    let one = await news.create({
                        Date: Date(),
                        Title: $(element).find('.bold-item').text(),
                        Type: 'main',
                        URL: $(element).find('.bold-item a').attr('href')
                    });
                    console.log('created: ' + JSON.stringify(one));    
                }
            })();
            $(element).find('.bold-item ~ li a').each((index, element) => {
                (async () => {
                    if ($(element).text()) {
                        let one = await news.create({
                            Date: Date(),
                            Title: $(element).text(),
                            Type: 'others',
                            URL: $(element).attr('href')
                        });
                        console.log('created: ' + JSON.stringify(one));    
                    }
                })();
            })
        })
    })
    ctx.body = '<h2>Crawler Success...</h2><h2>Save Success</h2>'
})

app.use(router.routes())
app.listen(3000)
console.log('app started at port 3000...')