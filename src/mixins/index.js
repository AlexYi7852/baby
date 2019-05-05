
import validate from '../utils/validate'

export default {
  data () {
    return {
      tipMessage: '', // 提示信息
      isIos: validate.iosOrAndroid(),
      showPopup: false, // 是否显示弹窗
      tipsShow: false // 是否显示提示弹窗
    }
  },
  methods: {
    showTips (val) {
      this.showPopup = false
      this.tipsShow = true
      this.tipMessage = val
      setTimeout(() => {
        this.tipsShow = false
      }, 1000)
    },
    download () {
      if (this.isIos === '1') {
        this.$router.push('/download')
      } else {
        this.$router.push('/download')
      }
    }
  }
}
