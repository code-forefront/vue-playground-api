const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const fs = require('fs')
const cors = require('kcors');
const storage = require('node-persist');
const uuidv4 = require('uuid/v4');
var _ = require('lodash');

const app = new Koa();
const router = new Router();

storage.initSync();

router.post('/drafts', async function (ctx) {
  const drafts = await storage.getItem('drafts') || []
  const id = uuidv4();
  const {template, script, style} = ctx.request.body
  const draft = {
    id,
    template,
    script,
    style
  }
  drafts.push(draft)
  await storage.setItem('drafts', drafts);
  await storage.persist()
  ctx.body = draft
});

router.get('/drafts/:id', async function (ctx) {
  const drafts = await storage.getItem('drafts') || []
  const id = ctx.params.id
  ctx.body = _.find(drafts,{id})
  if(ctx.body === undefined){
    throw new Error('no draft found');
  }
});


app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  
app.listen(process.env.PORT || 5000);
