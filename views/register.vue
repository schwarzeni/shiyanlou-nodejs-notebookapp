<template>
    <div class="container">
        <h1>{{ title }}</h1>
        <div class="row">
            <div class="col-xs-4 col-xs-offset-4">
                <form>
                    <div class="form-group">
                        <label for="email">
                            <span v-if="!isUserExist">Email address</span>
                            <span v-if="isUserExist" style="color: red">email address already used</span>
                        </label>
                        <input
                                type="email"
                                class="form-control"
                                id="email"
                                placeholder="Email"
                                name="email"
                                v-on:blur="queryEmail"
                                v-model="email"
                        >
                    </div>
                    <div class="form-group">
                        <label for="username">User name</label>
                        <input
                                type="text"
                                class="form-control"
                                id="username"
                                placeholder="Username"
                                name="username"
                                v-model="username"
                        >
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input
                                type="password"
                                class="form-control"
                                id="password"
                                placeholder="Password"
                                name="password"
                                v-model="password"
                        >
                    </div>
                    <div class="form-group">
                        <label for="password2">
                            <span v-if="password2===password">Email address</span>
                            <span v-else style="color: red">password not compared</span>
                        </label>
                        <input
                                type="password"
                                class="form-control"
                                id="password2"
                                placeholder="Confirm Password"
                                v-model="password2"
                        >
                    </div>
                    <button
                            type="button"
                            class="btn btn-default"
                            v-if="!isUserExist && password === password2 && password !== '' && username !== '' && email !== ''"
                            @click="submit"
                    >Submit</button>
                    <button
                            type="button"
                            class="btn btn-default"
                            disabled
                            v-else
                    >Submit</button>
                    <button
                            type="button"
                            class="btn btn-default"
                            @click="login"
                    >Login</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      data: function() {
        return {
          isUserExist: false,
          username: '',
          email: '',
          password: '',
          password2: ''
        }
      },
      methods: {
        queryEmail: function(event) {
          this.$http.post('/api/isEmailUsed', {email: event.target.value})
            .then(function (response) {
              console.log(response.body);
              this.isUserExist = response.body;
            })
        },
        submit: function() {
          this.$http.post('/api/register', {
            username: this.username,
            email: this.email,
            password: this.password
          })
            .then(function(res) {
              if (res.body === false) {
                this.isUserExist = true;
              } else {
                console.log(res.body.userId);
                window.location.href="/noteapp";
              }
            })
        },
        login: function() {
          window.location.href = '/login'
        }
      }

    }
</script>

<style>
</style>