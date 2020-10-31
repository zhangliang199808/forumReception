<template>
  <div class="login-form">
    <div class="g-form">
      <div class="g-title">登录</div>
      <div class="g-form-line">
        <span class="g-form-label">用户名：</span>
        <div class="g-form-input">
          <input type="text" 
          v-model="usernameModel" placeholder="请输入用户名">
        </div>
        <span class="g-form-error">{{ userErrors.errorText }}</span>
      </div>
      <div class="g-form-line">
        <span class="g-form-label">密码：</span>
        <div class="g-form-input">
          <input type="password" 
          v-model="passwordModel" placeholder="请输入密码">
        </div>
        <span class="g-form-error">{{ passwordErrors.errorText }}</span>
      </div>
      <div class="g-form-line">
        <div class="g-form-btn">
          <a class="button" @click="onLogin">登录</a>
        </div>
      </div>
      <p>{{ errorText }}</p>
    </div>
  </div>
</template>

<script>
import {getLogin} from '@/api/login.js'
export default {
  data () {
    return {
      usernameModel: '',
      passwordModel: '',
      errorText: ''
    }
  },
  computed: {
    userErrors () {
      let errorText, status
      if (this.usernameModel == '') {
        errorText = '请填写用户名'
      } else {
        status = true
        errorText = ''
      }
      return {
        errorText,
        status
      }
    },
    passwordErrors () {
      let errorText, status
      if (!/^\w{4,8}$/g.test(this.passwordModel)) {
        status = false
        errorText = '密码要在4-8位噢'
      }
      else {
        status = true
        errorText = ''
      }
      if (!this.passwordFlag) {
        errorText = ''
        this.passwordFlag = true
      }
      return {
        status,
        errorText
      }
    }
  },
  methods: {
    onLogin () {
      let data = new FormData()
      data.append('username',this.usernameModel)
      data.append('password',this.passwordModel)
      getLogin(data)
        .then(res => {
          if (res.code == 200) {
            this.$emit('has-log',res.data)
            localStorage.setItem('token',res.token)
            let userInfo = {username:res.username}
            localStorage.setItem('userInfo',JSON.stringify(userInfo))
          }
        })
        .catch(err => {

        })
      
    }  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.g-title{
    margin-bottom: 22px;
    height: 30px;
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: #0099ED;
}
</style>
