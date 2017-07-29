/**
 * Created by nizhenyang on 2017/7/26.
 */
const sysSignal = require('../../util/sys-signal');
const dbUtil = require('../../util/db_util/util');

module.exports = function () {
  return function (req, res, next) {
    if (req.originalUrl.startsWith('/noteapp')) {
      if (req.session && req.session.userid) {
        dbUtil.isUserIdValid(req.session.userid)
          .then((result) => {
            if (result.signal === sysSignal.invalidUserId) {
              res.redirect('/login')
            } else {
              req.username = result.user.username;
            }
            next()
          })
      } else {
        res.redirect('/login');
        next()
      }
    } else {
      next();
    }
  }
};

function func(userId, callback) {

}