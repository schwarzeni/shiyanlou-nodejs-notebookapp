const express = require('express');
const expressVue = require('express-vue');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const secretToken = 'qweasdzxciopjklbnm';

const path = require('path');
const app = express();
const appRouter = require('./router/noteFunc-router');
const logRouter = require('./router/log-router');
const userValidation = require('./util/middleware/user-validation');

app.engine('vue', expressVue);
app.set('view engine', 'vue');
app.set('views', path.join(__dirname, 'views'));
app.set('vue', {
	componentsDir: path.join(__dirname, '/views/components'),
	defaultLayout: 'layout'
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	store: new redisStore(),
	secret: secretToken,
	cookie: {maxAge: 24*60*60*1000},
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(userValidation());
app.use('/noteapp', appRouter);
app.use('/', logRouter);
app.use((req, res, next) => {
	if (req.session.userid) {
		res.redirect('/noteapp');
	} else {
		res.redirect('/login');
	}
	next()
});


app.listen(process.env.PORT || 3000);


