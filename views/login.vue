<template>
    <div class="container">
        <h1>{{ title }}</h1>
        <div class="row">
            <div class="col-xs-4 col-xs-offset-4">
                <form>
                    <div class="form-group">
                        <label for="email">
                            <span v-if="!userIsNotExist">Email address</span>
                            <span v-if="userIsNotExist" style="color: red">Invalid email address</span>
                        </label>
                        <input
                                type="email"
                                class="form-control"
                                id="email"
                                placeholder="Email"
                                name="email"
                                v-model="email"
                        >
                    </div>
                    <div class="form-group">
                        <label for="password">
                            <span v-if="!passwordWrong">Password</span>
                            <span v-if="passwordWrong" style="color: red">Password wrong</span>
                        </label>
                        <input
                                type="password"
                                class="form-control"
                                id="password"
                                placeholder="Password"
                                name="password"
                                v-model="password"
                        >
                    </div>
                    <button
                            type="button"
                            class="btn btn-default"
                            @click="submit"
                    >Submit</button>
                    <button
                            type="button"
                            class="btn btn-default"
                            @click="register"
                    >Register</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      data: function() {
        return {
          email: '',
          password: '',
          userIsNotExist: false,
          passwordWrong: false
        }
      },
      methods: {
        submit: function() {
          this.$http.post('/api/login', {
            email: this.email,
            password: this.password
          })
            .then(function(res) {
              switch(res.body.signal) {
                case 'userIsNotExist':
                  this.userIsNotExist = true;
                  this.passwordWrong = false;
                  break;
                case 'passwordWrong':
                  this.passwordWrong = true;
                  this.userIsNotExist = false;
                  break;
                case 'success':
                  this.passwordWrong = false;
                  this.userIsNotExist = false;
                  window.location.href="/noteapp";
                  console.log(res.body.userId);
                  break;
              }
            })
        },
        register: function() {
          window.location.href = '/register';
        }
      }
    }
</script>

<style>
</style>