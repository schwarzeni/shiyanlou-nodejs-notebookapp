<template>
    <nav>
        <div class="row">
            <div class="col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
                <ul class="nav nav-tabs">
                    <li role="presentation" :class="activenav==='index' ? 'active' : ''"><a href="/noteapp">Home</a></li>
                    <li role="presentation" :class="activenav==='write' ? 'active' : ''"><a href="/noteapp/write">Write artile</a></li>
                    <li role="presentation" :class="activenav==='list' ? 'active' : ''"><a href="/noteapp/list">Article list</a></li>
                    <li role="presentation" style="float: right"><a href="/quit">Quit</a></li>
                    <li role="presentation" style="float: right"><a href="/noteapp">{{ username }}</a></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
      data: function() {
        return {

        }
      },
      props: ['username', 'activenav']
    }
</script>

<style>
</style>