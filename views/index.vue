<template>
    <div class="container">
        <app-header :username="username" :activenav="activenav"></app-header>
        <div class="row">
            <section class="col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1" style="margin-top: 2vh">
                <div class="jumbotron">
                    <div class="container">
                        <h1>Welcome home!</h1>
                        <p>Good to see you, {{ username }}</p>
                        <p><a class="btn btn-primary btn-lg" href="/noteapp/list" role="button">Your articleList</a></p>
                        <p><a class="btn btn-primary btn-lg" href="/noteapp/write" role="button">Let's write something!</a></p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
  export default {
    data: function () {
      return {}
    },
  }
</script>

<style>

</style>