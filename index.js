const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs')
const cors = require('kcors');
const storage = require('node-persist');
require('./Math.uuid');

const app = new Koa();
const router = new Router();

storage.initSync();

router.post('/drafts', async function (ctx) {
  const drafts = await storage.getItem('drafts') || []
  const id = Math.uuid()
  const draft = {
    'id':id,
    'template':ctx.request.body.template,
    'script':ctx.request.body.script,
    'style':ctx.request.body.style
  }
  drafts.push(draft)
  await storage.setItem('drafts', drafts);
  await storage.persist()
  ctx.body = draft
});

router.get('/drafts/:id', async function (ctx) {
  const drafts = await storage.getItem('drafts') || []
  const id = ctx.params.id
  ctx.body = 'no draft found'
  for (var i = 0; i < drafts.length; i++) {
    if(drafts[i].id === id){
      ctx.body = drafts[i]
    }
  }
});


app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  
app.listen(3000);
