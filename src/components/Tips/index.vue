<template>
   <van-popup class="copy-result" v-model="isShowTips">{{ text }}</van-popup>
</template>

<script>
export default {
  data () {
    return {
      hello: ''
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    isShowTips: {
      type: Boolean,
      default: false
    }
  }
}
</script>


<style lang="less" scoped>
.copy-result {
  width: 2rem;
  height: .5rem;
  font-size: .14rem;
  text-align: center;
  line-height: .5rem;
}
</style>
