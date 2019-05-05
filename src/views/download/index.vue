<template>
  <div class="download">
    <img :src="backIcon" @click="back" alt>
    <section class="tips" v-if="prevUrl === 'myGarden'">
      <div class="box">
        <span>恭喜您,领取成功!</span>
        <span>下载打开APP查看吧!</span>
      </div>
    </section>
    <section class="button download" @click="download">下载宝贝儿app</section>
    <section class="button open" @click="openApp">立即打开</section>
  </div>
</template>

<script>
import validate from '../../utils/validate'
const BACK_ICON = require("@/assets/download/backIcon.png");
const IOS_URL = 'com.liuhen.babyrpo://' // ios app打开地址
const ANDROID_URL = 'killaxiao://lhbaby/homepage' // android app打开地址
const IOS_DOWNLOAD_URL = 'https://itunes.apple.com/cn/app/id1450257705?mt=8' // ios 下载地址
const ANDROID_DOWNLOAD_URL = 'https://cache.8hk.online/download/app-release.apk' // android下载地址

export default {
  data() {
    return {
      backIcon: BACK_ICON,
      prevUrl: '', // 上级页面
      isWeiXin: validate.isWeiXin(),
      iosOrAndroid: validate.iosOrAndroid()
    };
  },
  methods: {
    back () {
      if (this.prevUrl === 'share') {
        this.$router.go(-1)
      }
    },
    download () {
      window.location = this.iosOrAndroid ? IOS_DOWNLOAD_URL : ANDROID_DOWNLOAD_URL
    },
    openApp () {
      if (this.isWeiXin) {
        alert("请使用手机浏览器打开")
      } else {
        window.location = this.iosOrAndroid ? IOS_URL : ANDROID_URL
      }
    }
  },
  // 路由守卫 进入页面首先执行此函数
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevUrl = from.name
    })
  }
};
</script>

<style lang="less" scoped>
.download {
  height: 100vh;
  font-size: .16rem;
  position: relative;
  background: url("../../assets/download/Group.png");
  background-repeat: no-repeat;
  background-size: 100%;
  img {
    top: 0.2rem;
    left: 0.2rem;
    position: fixed;
  }
  .tips {
    left: 50%;
    top: .48rem;
    opacity: .6;
    width: 1.7rem;
    height: .7rem;
    padding: .05rem;
    border-radius: 5px;
    position: absolute;
    box-sizing: border-box;
    transform: translate(-50%);
    border:1px dashed rgba(255,255,255,1);
    .box {
      height: .6rem;
      color: #FF7DAE;
      padding: .1rem 0;
      font-size: .14rem;
      background: #fff;
      text-align: center;
      border-radius: 5px;
      box-sizing: border-box;
      span {
        display: inline-block;
      }
    }
  }
  .button {
    left: 50%;
    width: 3.07rem;
    height: 0.44rem;
    position: fixed;
    text-align: center;
    line-height: 0.44rem;
    border-radius: 100px;
    transform: translate(-50%);
  }
  .download {
    color: #fff;
    bottom: 1.1rem;
    background: linear-gradient(
      135deg,
      rgba(255, 124, 173, 1) 0%,
      rgba(255, 124, 173, 1) 0%,
      rgba(255, 95, 131, 1) 100%
    );
  }
  .open {
    bottom: 0.46rem;
    color: #ff7aaa;
    border: 1px solid red;
  }
}
</style>
