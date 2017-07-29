<template>
    <div class="container">
        <app-header :username="username" :activenav="activenav"></app-header>
        <section>
            <div class="row" style="margin-top: 2vh;">
                <div class="col-md-3 col-lg-3">
                    <ul class="list-group">
                        <li
                                v-for="(article, index) in articles"
                                :class="currentIndex===index? 'list-group-item list-group-item-info' : 'list-group-item'"
                                @click="onClick(article, index)"
                        >
                            {{ article.title}}
                            <span>{{ formateTime(article.createTime) }}</span>
                        </li>
                        <li
                                v-for="(article, index) in moreArticle"
                                :class="currentIndex===index? 'list-group-item list-group-item-info' : 'list-group-item'"
                                @click="onClick(article, index+10)"
                        >
                            {{ article.title}}
                            <span>{{ formateTime(article.createTime) }}</span>
                        </li>
                        <li
                                class="list-group-item list-group-item-success"
                                @click="getMoreArticle()"
                                v-if="!isLoadAll"
                        >More article <span class="glyphicon glyphicon-menu-down"></span></li>
                        <li
                                class="list-group-item list-group-item-success"
                                v-if="isLoadAll"
                        >
                            <span class="glyphicon glyphicon-info-sign"></span>is load all
                        </li>
                    </ul>
                </div>
                <div class="col-md-9 col-lg-9" style="word-break: break-all">
                    <article id="articleDetail" v-if="showArticle" style="position: relative">
                        <div class="alert alert-warning" style="position: absolute" v-if="showDeleteAlert">
                            Really delete？
                            <button class="btn btn-danger" @click="deleteArticle(articleDetail._id)">Delete</button>
                            <button class="btn btn-default" @click="showDeleteAlert=false">Cancel</button>
                        </div>
                        <button class="btn btn-danger" @click="showDeleteAlert=true" v-if="!showDeleteAlert">Delete
                        </button>
                        <a class="btn btn-warning" :href="'/noteapp/edit/' + articleDetail._id">Edit</a>
                        <h1>{{ articleDetail.title }}</h1>
                        <span class="label label-default">Post time: {{ formateTime(articleDetail.createTime, 'detail')
                            }}</span>
                        <span class="label label-default">Last edited time: : {{ formateTime(articleDetail.modefiyTime, 'detail')
                            }}</span>
                        <hr>
                        <div id="content" v-html="articleDetail.content" style="margin-top: 2vh;">
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
  export default {
    data: function () {
      return {
        articleDetail: {},
        showArticle: false,
        currentIndex: -1,
        showDeleteAlert: false,
        moreArticle: [],
        articleLength: 10,
        isLoadAll: false
      }
    },
    methods: {
      formateTime: function (dataString, type) {
        type = type || 'simple';
        const date = new Date(dataString);
        var timeStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        if (type === 'detail') {
          timeStr += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        }
        return timeStr
      },
      onClick: function (article, idx) {
        this.articleDetail = article;
        this.showArticle = true;
        this.currentIndex = idx;
      },
      deleteArticle: function (articleId) {
        this.$http.post('/noteapp/api/deleteArticle', {articleId: articleId})
          .then(function (req) {
            if (req.body.msg === 'ok') {
              window.location.reload();
            }
          })
      },
      getMoreArticle: function () {
        this.$http.post('/noteapp/api/moreArticles', {currentLength: this.articleLength})
          .then(function (res) {
            this.moreArticle = this.moreArticle.concat(res.body.articles);
            this.articleLength += 10;
            this.isLoadAll = res.body.isLoadAll;
          })
      }
    }
  }
</script>

<style>
    .list-group li:hover {
        background-color: #c5e2f1;
    }

    .list-group li:last-child:hover {
        background-color: #eaefe8;
    }

    .list-group li {
        word-break: break-all;
        cursor: pointer
    }

    .list-group li:last-child {
        text-align: center;
    }

    .list-group li span {
        float: right;
    }

    .list-group li:last-child span {
        float: left;
    }
</style>