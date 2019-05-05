<template>
  <div class="container">
    <section class="main">
      <div class="text">{{ item.nickname }}送你一束花花</div>
      <div class="text">请输入手机号码领取吧</div>
      <div class="tips" v-if="showTips">请输入正确的手机号</div>
      <input type="tel" maxlength="11" @blur="onBlur"  v-model="mobile" placeholder="请输入手机号">
      <div class="button" @click="receive">领取</div>
    </section>
  </div>
</template>

<script>
import validate from '../../utils/validate'
import { setTimeout } from 'timers';
export default {
  data () {
    return {
      mobile: '',
      item: {}, // 送花对象
      showTips: false // 是否显示提示 默认false
    }
  },
  mounted () {
    this.getInit()
  },
  methods: {
    getInit () {
      this.$post('/api-login/v2/login/invitor', {
        invitortoken: this.$route.query.invitortoken
        // invitortoken: '19'
      }).then(res => {
        this.item = res.data
      })
    },
    onBlur () {
      window.scroll(0,0)
      if (!validate.isMobile(this.mobile)) {
        this.showTips = true
        setTimeout(() => {
          this.showTips = false
        }, 3000)
        return
      }
    },
    receive () {
      if (!validate.isMobile(this.mobile)) {
        this.showTips = true
        setTimeout(() => {
          this.showTips = false
        }, 3000)
        return
      }
      this.$post('/api-login/v2/login/flowerconfirm', {
        code: '',
        mobile: this.mobile,
        flowerkey: this.item.flowerkey
      }).then(res => {
        this.$router.push('/download')
      })
    }
  }
}
</script>


<style lang="less" scoped>
.container {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 99999999;
  background: url('../../assets/myGarden/background.png');
  background-repeat: no-repeat;
  background-size: 100%;
  .main {
    left: 0;
    right: 0;
    bottom: 0;
    height: 2.44rem;
    font-size: .14rem;
    position: absolute;
    text-align: center;
    padding-top: .24rem;
    box-sizing: border-box;
    .text {
      color: #FEA425;
    }
    .tips {
      left: 50%;
      color: red;
      position: absolute;
      transform: translate(-50%);
    }
    input {
      width: 3.08rem;
      height: .44rem;
      color: #C8BEC3;
      margin-top: .24rem;
      text-align: center;
      position: relative;
      border-radius: 100px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(106,188,17,1);
      box-shadow: 0px 1px 8px 0px rgba(111,158,72,1);
    }
    .button {
      height: .4rem;
      width: 1.08rem;
      color: #B46606;
      margin: .3rem auto;
      text-align: center;
      line-height: .4rem;
      border-radius: 20px;
      background:linear-gradient(180deg,rgba(254,176,54,1) 0%,rgba(254,161,32,1) 100%);
    }
  }
}
</style>
