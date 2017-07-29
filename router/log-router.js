const router = require('express').Router();
const sysSignal = require('../util/sys-signal');
const dbUtil = require('../util/db_util/util');

module.exports = router;


router.get('/register', (req, res) => {
  if (req.session.userid) {
    res.session.userid = ''
  }
	res.render('register', {
	  data: {
	  	title: 'register !'
		},
	});
});

router.post('/api/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
  dbUtil.isUserExist({value: email, type: 'email'})
    .then((result) => {
      if (result.signal === sysSignal.userExist) {
        res.send(false).status(200);
    } else {
        return dbUtil.createNewUser(email, username, password)
    }
    })
    .then((result) => {
      req.session.userid = result.user.userid;
      res.send({userId: result.user.userid}).status(200);
      return dbUtil.createArticleCollection(result.user.userid);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    })
});

router.post('/api/isEmailUsed', (req, res) => {
  dbUtil.isUserExist({value: req.body.email, type: 'email'})
    .then((result) => {
      if (result.signal === sysSignal.userExist) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

router.get('/login', (req, res) => {
  if (req.session.userid) {
    req.session.userid = '';
  }
	res.render('login', {
		data: {
			title: 'login'
		},

	})
});

router.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  dbUtil.isPasswordRight(email, password)
    .then((result) => {
      switch(result.signal) {
        case sysSignal.userIsNotExist:
          res.send({signal: 'userIsNotExist'});
          break;
        case sysSignal.passwordWrong:
          res.send({signal: 'passwordWrong'});
          break;
        case sysSignal.success:
          req.session.userid = result.userid;
          res.send({signal: 'success', userId: result.userid});
          break;
        res.status(200);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    })
});

router.get('/quit', (req, res) => {
	res.redirect('/login');
});