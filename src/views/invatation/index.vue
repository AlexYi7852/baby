<template>
  <transition name="move">
    <div class="receive">
      <section class="honorific">
        <div class="title">{{ initData.nickname }}</div>
        <div class="describe">{{ initData.title }}</div>
      </section>
      <section class="content" v-if="initData.pic">
        <img class="pic" :src="initData.pic" alt="">
        <div class="describe">
          <div class="text">{{ initData.content }}</div>
          <div class="tag">
            <img :src="playIcon"  v-show="initData.audio" @click="audioPlay">
            <audio ref="audio" :src="initData.audio" v-show="false"></audio>
            <span>#{{ initData.tagname }}#</span>
          </div>
        </div>
      </section>
      <section class="input-box" v-if="initData.named === '1'">
        <input type="tel" @blur="onBlur" @focus="onFocus" maxlength="11" v-model="mobile" placeholder="">
      </section>
      <section class="input-box" v-if="initData.named === '0'">
        <input type="tel" @blur="onBlur" placeholder="请输入手机号码">
      </section>
      <section class="button" @click="toInvited">立即进入</section>

      <loading :isShow.sync="showLoading"></loading>
      <tip :isShowTips="tipsShow" :text="tipMessage"></tip>
    </div>
  </transition>
</template>

<script>
const axios = require('axios')
import Tip from '@/components/Tips'
import validate from '@/utils/validate'
import Loading from '@/components/Loading'
import { setTimeout } from 'timers';
export default {
  components: { Tip, Loading },
  data () {
    return {
      initData: {},
      lastNumber: '',
      mobile: '',
      isChild: false, // 是否有小孩子
      showLoading: true, // 是否显示loading
      playIcon: require("../../assets/invatation/playIcon.png")
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$post('/api-login/v2/login/invitor',{
        invitortoken: this.$route.query.invitortoken
        // invitortoken: '714775e31015cab47e35efda019b2733'
      })
        .then(res => {
          if (res.code === 200) {
            this.showLoading = false
            this.initData = res.data
            this.mobile = res.data.mobile
          } else {
            this.showLoading = false
            setTimeout(() => {
              this.showTips(res.message)
            }, 3000)
          }
        })
    },
    // input 失焦之后需要把键盘放下来
    onBlur () {
      window.scroll(0,0)
    },
    // 聚焦事件
    onFocus () {
      this.mobile = this.mobile.substr(0, 7)
    },
    // 邀请
    toInvited () {
      if (!validate.isMobile(this.mobile)) {
        alert('请输入正确的手机号')
        return
      }
      if (!this.isChild) {
        this.download()
      } else {
        this.$router.push({
          path: '/beInvited',
          query: {
            code: this.lastNumber,
            invitconfirm: this.initData.invitconfirm
          }
        })
      }
    },
    // 播放语音
    audioPlay () {
      this.$refs.audio.play()
    },
    // 确认邀请
    confirmInvited (code, invitconfirm) {
      this.$post('/api-login/v2/login/invitconfirm', {
        code: code,
        invitconfirm: invitconfirm
      }).then(res => {
        if (res.data.childs == '1') {
          this.isChild = true
        }
      })
    }
  },
  watch: {
    mobile (val) {
      // 判断是否全是数字
      if(!/^[0-9]+$/.test(val)) return
      if (val.length === 11) {
        this.lastNumber = val.substr(7)
        this.confirmInvited(this.lastNumber, this.initData.invitconfirm)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .receive {
    width: 3.75rem;
    .honorific {
      width: 3.07rem;
      margin: .2rem auto .1rem auto;
      .title {
        color: #FF7AAA;
        font-weight: 500;
        font-size: .25rem;
        line-height: .36rem;
      }
      .describe {
        margin-top: 5px;
        color: #A3A19A;
        font-weight: 400;
        font-size: .14rem;
        line-height: .2rem;
      }
    }
    .content {
      width: 3.55rem;
      margin: 0 auto;
      padding: .15rem;
      border-radius:4px;
      box-sizing: border-box;
      box-shadow:2px 2px 16px 0px rgba(240,240,240,1);
      .pic {
        width: 100%;
        height: 2.5rem;
        object-fit: cover;
        border-radius: 5px;
        object-position: center;
      }
    }
    .describe {
      font-size: .14rem;
      line-height: .2rem;
      margin-top: -.35rem;
      .text {
        color: #474747;
        font-weight: 300;
        margin: .18rem 0 .13rem 0;
      }
      .tag {
        color: #FF7AAA;
        font-weight: 500;
        display: flex;
        align-items: center;
        img {
          width: .22rem;
          height: .22rem;
          margin-right: .1rem;
        }
      }
    }
    .input-box {
      width: 3.07rem;
      height: .44rem;
      color: #C0C0C0;
      font-size: .14rem;
      margin: .2rem auto;
      border-radius: 1rem;
      background:rgba(246,246,247,1);
      input {
        border: none;
        width: 2.46rem;
        height: .26rem;
        text-align: center;
        margin: 4px .3rem;
        font-size: .2rem;
        background:rgba(246,246,247,1);
      }
    }
    .button {
      width: 3.07rem;
      height: .44rem;
      margin: 0 auto;
      color: #ffffff;
      font-size: .15rem;
      text-align: center;
      line-height: .44rem;
      border-radius: 1rem;
      background:linear-gradient(135deg,rgba(255,124,173,1) 0%,rgba(255,124,173,1) 0%,rgba(255,95,131,1) 100%);
    }
  }
</style>
