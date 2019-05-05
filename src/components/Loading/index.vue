<template>
  <div class="layer" :class="{'d-show': isShow}">
    <van-loading color="white" />
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
			type: Boolean,
			default: true
		}
  }
}
</script>

<style lang="less" scoped>
.layer /deep/ .van-loading {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}
.layer {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: .8;
  display: none;
  z-index: 99999;
  background: #000;
  position: absolute;
}
.d-show {
	display: block;
}
</style>
