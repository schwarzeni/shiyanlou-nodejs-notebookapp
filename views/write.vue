<template>
    <div class="container">
        <app-header :username="username" :activenav="activenav"></app-header>
        <div class="row" style="margin-top: 2vh">
            <section style="height: 80vh" class="col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
                <button class="btn btn-default" @click="submit" type="button" id="submit">{{ usage }}</button>
                <button class="btn btn-default" @click="unescapeChar()" v-if="usage==='update'">unescape characters</button>
                <input
                        type="text"
                        class="form-control"
                        id="title"
                        placeholder="title"
                        style="margin-top: 2vh"
                        v-model="article.title"
                >
                <input type="text" style="display: none" :value="articleData || ''" id="messageholder">
                <div class="row" style="margin-top: 2vh">
                    <div class="col-md-6">
                <textarea
                        class="form-control"
                        style="height: 70vh"
                        id="content"
                        placeholder="input area"
                        @input="previewScrollDown"
                        v-model="article.content"
                ></textarea>
                    </div>
                    <div class="col-md-6">
                        <div
                                id="preview"
                                v-html="previewHtml"
                                style="height: 70vh; border: 1px solid #f0f0f0; overflow: scroll">
                        </div>
                    </div>
                </div>
            </section>
        </div>

    </div>
</template>

<script>
  export default {
    data: function () {
      return {
        previewHtml: '',
        isEdit: false
      }
    },
    methods: {
      submit: function () {
        const type = document.getElementById('submit').innerText;
        const titleElem = document.getElementById('title');
        const title = titleElem.value;
        const contentElem = document.getElementById('content');
        const content = contentElem.value;
        const tags = [];
        if (type === 'submit') {
          this.$http.post('/noteapp/api/newArticle', {
            title: title,
            content: content,
            tags: tags,
          })
            .then(function () {
              var href = window.location.href.split('/');
              href[href.length - 1] = 'list';
              href = href.join('/');
              window.location = href;
            })
        } else if (type === 'update') {
          console.log(JSON.parse(document.getElementById('messageholder').value));
          let articleData = JSON.parse(document.getElementById('messageholder').value);
          articleData.title = title;
          articleData.content = content;
          articleData.tags = tags;
          this.$http.post('/noteapp/api/updateArticle', {article: articleData})
            .then((res) => {
              if (res.body.msg === 'ok') {
                var href = window.location.href.split('/');
                href.pop();
                href[href.length - 1] = 'list';
                href = href.join('/');
                console.log(href)
                window.location = href;
              }
            })
        }

      },
      previewScrollDown: function () {
        var content = document.getElementById('content').value;
        this.previewHtml = marked(content);
        setTimeout(function () {
          var objDev = document.getElementById('preview');
          objDev.scrollTop = objDev.scrollHeight;
        }, 500);
      },
      unescapeChar: function () {
        const textareaElem = document.getElementById('content');
        textareaElem.value = textareaElem.value.replace('&gt;', '>');
        textareaElem.value = textareaElem.value.replace('&lt;', '<');
      }
    }
  }
</script>

<style>
</style>