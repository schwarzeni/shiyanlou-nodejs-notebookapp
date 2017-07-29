const marked = require('marked');
const router = require('express').Router();
const sysSignal = require('../util/sys-signal');
const dbUtil = require('../util/db_util/util');

module.exports = router;
/**
 *  main page get reqest
 */
router.get('/', (req, res) => {
  res.render('index', {
    data: {
      username: req.username,
      activenav: 'index'
    },
    vue: {
      components: ['app-header']
    }
  });
});

/**
 *  write page get request
 */
router.get('/write', (req, res) => {
  res.render('write', {
    data: {
      username: req.username,
      usage: 'submit',
      activenav: 'write',
      article: {},
      articleData: ''
    },
    vue: {
      components: ['app-header']
    }
  });
});

/**
 *  create new article post request
 */
router.post('/api/newArticle', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const tags = req.body.tags;
  const author = req.username;
  const userid = req.session.userid;
  dbUtil.createNewArticle(userid, author, title, tags, content)
    .then(() => {
      res.send({'status': 'ok'}).status(200);
    })
    .catch((err) => {
      res.status(500);
      console.error(err);
    })

});

/**
 *  list article contents page get request
 */
router.get('/list', (req, res) => {
  dbUtil.getArticles(req.session.userid)
    .then((result) => {
      result.data.map((note) => {
        note.content = marked(note.content);
        return note;
      });
      res.render('list', {
        data: {
          username: req.username,
          activenav: 'list',
          articles: result.data
        },
        vue: {
          components: ['app-header']
        }
      });
    })
    .catch((err) => {
      res.status(500);
      console.error(err);
    })
});

/**
 *  get more article get request
 */
router.post('/api/moreArticles', (req, res) => {
  const userid = req.session.userid;
  const startIndex = req.body.currentLength;
  const length = 10;
  dbUtil.getArticles(userid, length, startIndex)
    .then((result) => {
      result.data.map((note) => {
        note.content = marked(note.content);
        return note;
      });
      const isLoadAll = result.data.length < length;
      res.send({articles: result.data, isLoadAll: isLoadAll}).status(200);
    })
    .catch((err) => {
      res.status(500);
      console.error(err);
    })
});

/**
 *  edit selected article page get request
 */
router.get('/edit/:_id', (req, res) => {
  dbUtil.getArticle(req.session.userid, req.params._id)
    .then((article) => {
      res.render('write', {
        data: {
          username: req.username,
          usage: 'update',
          activenav: 'list',
          article: article,
          articleData: JSON.stringify(article)
        },
        vue: {
          components: ['app-header']
        }
      });
    });

});

/**
 *  update selected article post request
 */
router.post('/api/updateArticle', (req, res) => {
  dbUtil.updateArticle(req.session.userid, req.body.article._id, req.body.article)
    .then(() => {
      res.send({'msg': 'ok'}).status(200);
    })
    .catch((err) => {
      res.status(500);
      console.error(err);
    })
});

/**
 * delete selected article post request
 */
router.post('/api/deleteArticle', (req, res) => {
  const userid = req.session.userid;
  const articleId = req.body.articleId;
  dbUtil.deleteArticle(userid, articleId)
    .then((i) => {
      res.send({'msg': 'ok', 'index': i}).status(200);
    })
    .catch((err) => {
      res.status(500);
      console.error(err);
    })
});

