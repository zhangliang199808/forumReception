<template>
  <div class="row">
    <div class="col-md-4 col-md-offset-4 floating-box">
      <Message :show.sync="msgShow" :type="msgType" :msg="msg"/>

      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">请登录</h3>
        </div>

        <div class="panel-body" data-validator-form>
          <div class="form-group">
            <label class="control-label">用户名</label>
            <input v-model.trim="username" v-validator.required="{ title: '用户名' }" type="text" class="form-control" placeholder="请填写用户名">
          </div>
          <div class="form-group">
            <label class="control-label">密码</label>
            <input v-model.trim="password" id="password" v-validator.required="{ title: '密码' }" type="password" class="form-control" placeholder="请填写密码">
          </div>
          <br>
          <button @click="login" type="submit" class="btn btn-lg btn-success btn-block">
            <i class="fa fa-btn fa-sign-in"></i> 登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getLogin} from '../../api/login'
export default {
  name: 'Login',
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      msg: '', // 消息
      msgType: '', // 消息类型
      msgShow: false // 是否显示消息，默认不显示
    }
  },
  methods: {
    login(e) {
      if (this.username == '' || this.password == '') {
        
      } else {
        let data = new FormData()
        data.append('username',this.username)
        data.append('password',this.password)
          getLogin(data)
            .then(res => {
              if (res.code == 200) {
                localStorage.setItem('token',res.token)
                let userInfo = {username:res.username}
                localStorage.setItem('userInfo',JSON.stringify(userInfo))
                this.$router.replace({path: '/'})
                this.$store.commit('UPDATE_AUTH',true)
                this.$store.commit('UPDATE_USER',userInfo)

              } else {
                this.msg = res.message
                this.msgShow = true
                this.msgType = 'danger'
              }
            })
      }
    }
  }
}
</script>

<style scoped>

</style>
