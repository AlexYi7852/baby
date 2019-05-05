<template>
  <div class="container">
    <section class="file-wrap">
      <img class="video-pic" :src="initData.picCompressList" v-if="!showVideo && showVideoPic" alt="">
      <img class="play-icon" v-if="showVideoPic" @click="playVideo" :src="playIcon">
      <audio ref="audio" :src="audio" id="audio"></audio>
      <video ref="video" v-if="!showVideoPic && !showVideo" id="video" width="100%" playsinline="true" webkit-playsinline="true" controls preload="auto" :src="video"></video>
      <van-swipe v-if="!showSwiperPic" :autoplay="picAutoPlay">
        <van-swipe-item v-for="(image, index) in picList" :key="index">
          <img :src="image"/>
          <img class="play-icon" v-if="video && index === 0" @click="playVideo" :src="playIcon">
        </van-swipe-item>
      </van-swipe>
    </section>

    <section class="desc-wrap" :class="{'add-margin': isAddMargin}">
      <div class="prefix">
        <span class="date">10.21</span>
        <span class="year">2018</span>
      </div>
      <div class="desc">
        <span class="content">刚睡醒，还没开嗓，哈哈，随便唱两句玩玩吧，你们可以去这里玩游戏啊，这个游戏非常好玩的，所以今天大家可以去玩。</span>
        <span class="from">- 妈妈</span>
      </div>
    </section>

    <section class="download-wrap">
      <div class="prefix">
        <img class="logo-icon" :src="logo" alt="">
        <section class="project-name">
          <span>宝贝儿PRO</span><span class="addtation" style="font-size: .12rem;">更多精彩内容下载APP观看</span>
        </section>
      </div>
      <div class="button" @click="download">立即下载</div>
    </section>
    <loading :isShow.sync="showLoading"></loading>
    <tip :isShowTips="tipsShow" :text="tipMessage"></tip>
  </div>
</template>

<script>
import Tip from '@/components/Tips'
import validate from '@/utils/validate'
import Loading from '@/components/Loading'
import ANDROID from '@/utils/nativeApp.js'

const axios = require('axios')
const wx = require('weixin-js-sdk')
const LOGO = require("../../assets/share/logo.png")
export default {
  components: { Tip, Loading },
  data () {
    return {
      video: '', // 视频
      audio: '', // 语音
      logo: LOGO, // logo
      picList: [], // 图片列表
      initData: {}, // 初始化数据对象
      showAudio: true, // 是否有audio
      showVideo: true, // 是否有video
      showLoading: true, // 是否显示loading
      showVideoPic: true, // 是否显示视频第一帧
      videoAutoPlay: false, // 视频是否自动播放
      showSharePopup: false, // 是否显示分享弹窗
      isAddMargin: false, // 播放视频需要添加margin
      picAutoPlay: 0, // 图片是否自动轮播， 默认不轮播
      showSwiperPic : true, // 是否轮播图片 true: 没有 false: 有
      playIcon: require("@/assets/share/play.png"), // 播放icon
      iosOrAndroid: validate.iosOrAndroid(), // true: ios false: android
    }
  },
  beforeCreate () {
    console.log('this is beforeCreate')
  },
  created () {
    console.log('this is created')
  },
  beforeMount () {
    console.log('this is beforeMount')
  },
  mounted () {
    // 挂载的时候调 WeixinJSBridgeReady 设置 audio 播放且暂停
    // 否则之后无法自动播放语音
    console.log('this is mounted')
    document.addEventListener('WeixinJSBridgeReady', () => {
      document.getElementById('audio').setAttribute('src', this.audio)
      document.getElementById('audio').play()
      document.getElementById('audio').pause()
    })
    this.getInitData()
  },
  beforeUpdate () {
    console.log('this is beforeUpdate')
  },
  updated () {
    console.log('this is updated')
  },
  beforeDestroy () {
    console.log('this is beforeDestory')
  },
  destroyed () {
    console.log('this is destoryed')
  },
  methods: {
    getInitData () {
      this.$post('/api-login/v2/login/content', {
        // sharekey: this.$route.query.key
        sharekey: 'd282ef263719ab842e05382dc235f69e'
      }).then((res) => {
        if (res.code === 200) {
          this.showLoading = false
          let data = res.data.m
          this.initData = data
          this.audio = data.audioList
          this.video = data.videoList
          this.picList = data.picList.split(',')
          this.handleInitEvent()
          this.wxReady(this.initData)
        }
      })
    },
    // 播放视频
    playVideo () {
      this.isAddMargin = true
      this.showSwiperPic = true
      this.showVideo = validate.isEmpty(this.video)
      this.showVideoPic = false
      this.$nextTick(() => {
        this.$refs.video.play()
        // 执行监听视频结束函数
        this.watchVideoPlayEnded()
      })
    },
    // 根据初始化数据执行不同事件
    handleInitEvent () {
      let _self = this
      this.showVideo = validate.isEmpty(this.video)
      this.showAudio = validate.isEmpty(this.initData.audioList)
      // 如果视频存在，优先播放视频
      if (!this.showVideo) {
        // 如果视频存在，拿视频第一帧和图片一起进行轮播
        this.picList.unshift(this.initData.picCompressList)
      } else if (!this.showAudio) {
        // 如果语音存在，则播放语音，且轮播图片
        this.handleAudioAutoPlay()
        this.handlePicAutoPlay()
      } else {
        // 如果视频和语音都不存在，则轮播图片
        this.handlePicAutoPlay()
      }
    },
    // 监听视频播放结束
    watchVideoPlayEnded () {
      let _self = this
      this.$nextTick(() => {
        let video = document.getElementById('video')
        video.addEventListener('ended', () => {
          // 视频播放结束之后，播放语音和轮播图片
          _self.showVideo = true
          _self.isAddMargin = false
          _self.handleAudioAutoPlay()
          _self.handlePicAutoPlay()
        })
      })
    },
    // 处理语音自动播放
    handleAudioAutoPlay () {
      if (!this.showAudio) {
        let audio = document.getElementById('audio')
        audio.setAttribute('src', this.audio)
        audio.play()
      }
    },
    // 图片自动轮播
    handlePicAutoPlay () {
      this.showSwiperPic = validate.isEmpty(this.picList)
      if (!this.showSwiperPic) {
        this.picAutoPlay = 3000
      }
    },
    // 下载
    download () {
      this.$router.push('/download')
    },
    initWxConfig () {
      if (location.href.indexOf('from') > -1) {
        var urlStr = location.href.split('&')
        let url = urlStr[0]
        location.href = url
      }
      axios.get(`/api-common/v2/wx/jsapiSign?url=${location.href}`)
        .then(res => {
          this.wxConfig(res.data.data)
        })
    },
    wxConfig (data) {
      let _self = this
      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来
        debug: false,
        // 必填，公众号的唯一标识
　　　　　appId: data.appId,
        // 必填，生成签名的时间戳
　　　　　timestamp: data.timestamp,
        // 必填，生成签名的随机串
　　　　　nonceStr: data.noncestr,
        // 必填，签名，见附录1
　　　　　signature: data.signature,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
　　　　　jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"]
      })
      wx.checkJsApi({
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
          console.log('需要检测的JS接口列表, checkJsApi')
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
      });
      //通过error接口处理失败验证
      wx.error(function(err) {
        // config信息验证失败会执行error函数
        console.log(err, 'config error')
      })
    },
    // 分享配置
    wxShareData (data) {
      return {
        title: `${data.tagname}的有趣瞬间`, // 分享标题
        desc: data.content, // 分享描述
        link: location.href, // 分享链接
        imgUrl: 'https://cache.8hk.online/512.png', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
      }
    },
    // 通过ready接口处理成功验证
    wxReady (data) {
      let _self = this
      let shareData = this.wxShareData(data)
      wx.ready(function () {
        // config信息验证成功后会执行ready方法
        console.log('config success')
        wx.onMenuShareAppMessage({
          title: shareData.title, // 分享标题
          desc: shareData.desc, // 分享描述
          link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareData.imgUrl, // 分享图标
          success: function (res) {
            // 用户确认分享后执行的回调函数
            _self.showTips('分享成功!')
          },
          cancel: function (res) {
            // 用户取消分享后执行的回调函数
            console.log('取消分享给好友返回的信息为:', res)
          }
        })
        wx.onMenuShareTimeline({
          title: shareData.title, // 分享标题
          desc: shareData.desc, // 分享描述
          // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          link: shareData.link,
          imgUrl: shareData.imgUrl, // 分享图标
          success: function (res) {
            // 用户确认分享后执行的回调函数
            _self.showTips('分享成功!')
          },
          cancel: function (res) {
            // 用户取消分享后执行的回调函数
            console.log('取消分享到朋友圈返回的信息为:', res)
          }
        })
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log('这是beforeRouteEnter')
      vm.initWxConfig()
    })
  }
}
</script>


<style lang="less" scoped>


.container /deep/ .van-swipe__indicators {
    bottom: .5rem;
  }

.container {
  .download-wrap {
    min-height: .6rem;
    display: flex;
    padding: 0 .15rem;
    background: #fff;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    .prefix {
      display: flex;
      height: .4rem;
      color: #474747;
      align-items: center;
      .logo-icon {
        width: .4rem;
        height: .4rem;
      }
      .project-name {
        display: flex;
        font-size: .14rem;
        margin-left: .1rem;
        flex-direction: column;
        .addtation {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
      }
    }
    .button {
      width: .82rem;
      height: .34rem;
      color: #fff;
      font-size: .12rem;
      text-align: center;
      line-height: .34rem;
      border-radius: .2rem;
      background:linear-gradient(135deg,rgba(255,124,173,1) 0%,rgba(255,124,173,1) 0%,rgba(255,95,131,1) 100%);
    }
  }
  .file-wrap {
    flex: 1;
    height: 100vh;
    position: relative;
    img {
      width: 100%;
      height: 100vh;
      object-fit: cover;
      object-position: center;
    }
    .play-icon {
      top: 50%;
      left: 50%;
      width: .42rem;
      height: .42rem;
      margin: -.21rem;
      position: absolute;
    }
    .van-swiper-item {
      width: 3.1rem;
      height: 3.33rem;
    }
  }
  .add-margin {
    height: auto;
    margin-top: .6rem;
  }
  .desc-wrap {
    height: 1rem;
    display: flex;
    box-sizing: border-box;
    padding: .2rem 0 .1rem 0;
    .prefix {
      width: 1rem;
      display: flex;
      text-align: center;
      flex-direction: column;
      border-right: 1px solid #E3DEE0;
      .date {
        color: #483A40;
        font-size: .28rem;
      }
      .year {
        color: #C8BEC3;
        font-size: .2rem;
      }
    }
    .desc {
      flex: 1;
      display: flex;
      color: #474747;
      font-size: .12rem;
      padding: 0 .15rem 0 .12rem;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      .content {
        line-height: .16rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .from {
        text-align: right;
      }
    }
  }
}
</style>
