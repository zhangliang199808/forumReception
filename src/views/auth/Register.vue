<template>
  <div class="row">
    <div class="col-md-4 col-md-offset-4 floating-box">
    <Message :show.sync="msgShow" :type="msgType" :msg="msg"/>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">请注册</h3>
        </div>

        <div class="panel-body" data-validator-form>
          <div class="form-group">
            <label class="control-label">用户名</label>
            <input v-model.trim="username" v-validator:input.required="{ regex: /^[a-zA-Z]+\w*\s?\w*$/, error: '用户名要求以字母开头的单词字符' }" type="text" class="form-control" placeholder="请填写用户名">
          </div>
          <div class="form-group">
            <label class="control-label">手机号</label>
            <input v-model.trim="phone" v-validator:input.required="{ regex: /^1[3|4|5|8][0-9]\d{4,8}$/, error: '请输入正确的手机号' }" type="number" class="form-control" placeholder="请填写手机号">
          </div>
          <div class="form-group">
            <label class="control-label">密码</label>
            <input id="password" v-model.trim="password" v-validator.required="{ regex: /^\w{6,16}$/, error: '密码要求 6 ~ 16 个单词字符' }" type="password" class="form-control" placeholder="请填写密码">
          </div>
          <div class="form-group">
            <label class="control-label">确认密码</label>
            <input v-model.trim="cpassword" v-validator.required="{ target: '#password' }" type="password" class="form-control" placeholder="请填写确认密码">
          </div>
          <!-- <div class="form-group">
            <label class="control-label">图片验证码</label>
            <input v-model.trim="captcha" v-validator.required="{ title: '图片验证码' }" type="text" class="form-control" placeholder="请填写验证码">
          </div>
          <div class="thumbnail" title="点击图片重新获取验证码" @click="getCaptcha">
            <div class="captcha vcenter" v-html="captchaTpl"></div>
          </div> -->
          <button type="submit" class="btn btn-lg btn-success btn-block" @click="register">
            <i class="fa fa-btn fa-sign-in"></i> 注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import createCaptcha from '@/utils/createCaptcha'
import ls from '@/utils/localStorage'
import {getRegister} from '../../api/login'
export default {
  name: 'Register',
  data() {
    return {
      captchaTpl: '', // 验证码模板
      username: '', // 用户名
      password: '', // 密码
      cpassword: '', // 确认密码
      phone: '',  // 手机号
      captcha: '', // 验证码
      msg: '', // 消息
      msgType: '', // 消息类型
      msgShow: false // 是否显示消息，默认不显示
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    getCaptcha() {
      const { tpl, captcha } = createCaptcha(6)

      this.captchaTpl = tpl
      this.localCaptcha = captcha
    },
    register(e) {
      this.$nextTick(() => {
        const target = e.target.type === 'submit' ? e.target : e.target.parentElement
        this.showMsg('验证成功，请在点击开始注册')
        if (target.canSubmit) {
          this.submit()
        }
      })
    },
    submit() {
      let data = new FormData()
      data.append('username',this.username)
      data.append('password',this.password)
      data.append('mobile',this.phone)
      data.append('password2',this.cpassword)
      getRegister(data)
        .then(res => {
          if (res.code == 200) {
            this.$router.replace({path:'/auth/login'})
          } else {
            this.showMsg(res.message)
          }
        })
    },
    login(user) {
      this.$store.dispatch('login', user)
      this.showMsg('注册成功', 'success')
    },
    showMsg(msg, type = 'warning') {
      this.msg = msg
      this.msgType = type
      this.msgShow = false

      this.$nextTick(() => {
        this.msgShow = true
      })
    }
  }
}
</script>

<style scoped>
.thumbnail { width: 170px; margin-top: 10px; cursor: pointer;}
.thumbnail .captcha { height: 46px; background: #E1E6E8;}
.captcha { font-size: 24px; font-weight: bold; user-select: none;}
</style>
