const mongoose = require('./db_config');
const bcrypt = require('bcrypt-nodejs');
const model = require('./models');
const sysSignal = require('../sys-signal');

/**
 *  创建新用户
 * @param email
 * @param username
 * @param password
 * @returns {Promise}
 */
const createNewUser = function (email, username, password) {
  return new Promise((resolve, reject) => {
    const user = new model.User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password),
      userid: ''
    });
    user.save((err, tmpUser) => {
      if (err) {
        reject(err);
      } else {
        tmpUser.userid = bcrypt.hashSync(tmpUser._id);
        tmpUser.save((err, newUser) => {
          if (err) {
            reject(err);
          } else {
            resolve({signal: sysSignal.success, user: newUser});
          }
        });
      }
    });
  });
};

/**
 *  查看用户是否存在
 * @param arg
 *       @property value
 *       @property type
 * @returns {Promise}
 */
const isUserExist = function (arg) {
  let query = '';
  switch (arg.type) {
    case 'email':
      query = {email: arg.value};
      break;
    case 'userid':
      query = {userid: arg.value};
      break;
  }
  return new Promise((resolve, reject) => {
    model.User.findOne(query, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve({signal: sysSignal.userExist, user: result});
      } else {
        resolve({signal: sysSignal.userIsNotExist});
      }
    })
  })
};
/**
 *  检测密码是否正确
 * @param email
 * @param password
 * @returns {Promise}
 */
const isPasswordRight = function (email, password) {
  return new Promise((resolve, reject) => {
    isUserExist({type: 'email', value: email})
      .then((result) => {
        if (result.signal === sysSignal.userIsNotExist) {
          resolve({signal: sysSignal.userIsNotExist});
        } else if (!bcrypt.compareSync(password, result.user.password)) {
          resolve({signal: sysSignal.passwordWrong});
        } else {
          resolve({signal: sysSignal.success, userid: result.user.userid})
        }
      })
  })

};
/**
 * 检测浏览器返回的session是否正确
 * @param userid
 * @returns {Promise}
 */
const isUserIdValid = function (userid) {
  return new Promise((resolve, reject) => {
    model.User.findOne({userid: userid}, (err, user) => {
      if (err) {
        reject(err);
      }
      if (user) {
        resolve({signal: sysSignal.success, user: user});
      } else {
        resolve({signal: sysSignal.invalidUserId});
      }
    });
  });
};
/**
 *  在创建新用户时为其创建文件集合，用于存储文章id号
 * @param userid
 * @returns {Promise}
 */
const createArticleCollection = function (userid) {
  return new Promise((resolve, reject) => {
    const newArticleCollection = new model.Notes({
      userid: userid,
      notes: []
    });
    newArticleCollection.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
};
/**
 *  向用户的文章列表添加新文章
 * @param userid
 * @param newArticle
 * @returns {Promise}
 * @private
 */
const _addNewArticleToCollection = function (userid, newArticle) {
  return new Promise((resolve, reject) => {
    model.Notes.findOne({userid: userid}, (err, articleCollection) => {
      if (err) {
        reject(err);
      } else {
        articleCollection.notes.push(newArticle);
        articleCollection.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};
/**
 *  创建新文章
 * @param userid
 * @param author
 * @param title
 * @param tag
 * @param content
 * @returns {Promise}
 */
const createNewArticle = function (userid, author, title, tags, content) {
  return new Promise((resolve, reject) => {
    const newArticle = new model.Note({
      title: title,
      author: author,
      userid: userid,
      tags: tags,
      content: content,
      // createTime: new Date().
    });
    _addNewArticleToCollection(userid, newArticle)
      .then(() => {
        resolve()
      })
      .catch((err) => {
        reject(err);
      })
  })
};
/**
 * 获取文章组信息
 * @param userid
 * @param length        文章数量
 * @param startIndex
 * @param order       时间顺序，默认从最新的开始(1,   倒序查找 -1)
 * @returns {Promise}
 */
const getArticles = function (userid, length, startIndex, order) {
  const defaultLength = 10
  length = length || defaultLength;
  startIndex = startIndex || 0;
  order = order || 1;
  return new Promise((resolve, reject) => {
    model.Notes.findOne({userid: userid})
      .exec((err, notes) => {
        if (err) {
          reject(err)
        }
        if(order === -1) {
          resolve({data: notes.notes.splice(startIndex, length)})
        } else {
          let articleData = [];
          const totalLength = notes.notes.length;
          let count = 0;
          startIndex = totalLength - startIndex - 1;
          while(true) {
            if (count === defaultLength) break;
            if (startIndex < 0) break;
            articleData.push(notes.notes[startIndex]);
            startIndex--;
            count++;
          }
          resolve({data: articleData})
        }
      })
  });
};
/**
 * 获取单个文章信息
 * @param userid
 * @param articleid
 * @returns {Promise}
 */
const getArticle = function (userid, articleid) {
  return new Promise((resolve, reject) => {
    model.Notes.findOne({userid: userid})
      .exec((err, result) => {
        if (err || !result) {
          reject(err);
        } else {
          let i = 0;
          for (; i < result.notes.length; i++) {
            if ((result.notes[i]._id).equals(articleid)) break;
          }
          resolve(result.notes[i])
        }
      });
  })
};
/**
 *  删除文章
 * @param userid
 * @param articleid
 * @returns {Promise}
 */
const deleteArticle = function (userid, articleid) {
  return new Promise((resolve, reject) => {
    model.Notes.findOne({userid: userid})
      .exec((err, result) => {
        if (err) {
          reject(err);
        } else {
          let i = 0;
          for (; i < result.notes.length; i++) {
            if ((result.notes[i]._id).equals(articleid)) break;
          }
          result.notes.splice(i, 1);
          result.save((err) => {
            if (err) reject(err);
            resolve(i);
          })
        }
      })
  })
};
/**
 *  更新文章
 * @param userid
 * @param articleid
 * @param updateThings
 * @return {Promise}
 */
const updateArticle = function (userid, articleid, updateThings) {
  return new Promise((resolve, reject) => {
    model.Notes.findOne({userid: userid})
      .exec((err, result) => {
        if (err) {
          reject(err);
        } else {
          let i = 0;
          for (; i < result.notes.length; i++) {
            if ((result.notes[i]._id).equals(articleid)) break;
          }
          result.notes[i].title = updateThings.title;
          result.notes[i].content = updateThings.content;
          result.notes[i].tags = updateThings.tags;
          result.notes[i].modefiyTime = Date.now();
          result.save((err) => {
            if (err) reject(err);
            resolve();
          })
        }
      })
  })
};

/*
 if (require.main === module) {
 createNewUser('aa', 'aa', 'aa')
 .then((result) => {
 })
 .catch((err) => {
 console.error(err);
 })
 }
 */
module.exports = {
  createNewUser,
  isUserExist,
  isPasswordRight,
  isUserIdValid,
  createArticleCollection,
  createNewArticle,
  getArticles,
  deleteArticle,
  getArticle,
  updateArticle
};




