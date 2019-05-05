<template>
  <div class="container">
    <transition name='child'>
      <div class="child-box" v-if="showChild">
        <section class="invatation-wrap" v-for="item in initList" @click="childInvatation(item.name)" :key="item.name">
          <div class="left">
            <img :src="item.avatar" alt="">
            <div class="title">{{ item.name }}</div>
          </div>
          <div class="right">
            <div>去邀请</div>
            <img :src="nextIcon" alt="">
          </div>
        </section>
      </div>
    </transition>
    <transition name="fade">
      <section class="invatation-box" v-if="showInvatation">
        <section class="invatation-wrap"  v-for="(item, index) in invatationList" @click="toInvatation(index, item.name)" :key="item.name">
          <div class="left">
            <img :src="item.avatar" alt="">
            <div class="title">{{ item.name }}</div>
          </div>
          <div class="right">
            <div>去邀请</div>
            <img :src="nextIcon" alt="">
          </div>
        </section>
      </section>
    </transition>
  </div>
</template>

<script>
const NEXT_ICON = require("../../assets/invatation/next.png")
export default {
  data () {
    return {
      childName: '',
      showChild: true,
      nextIcon: NEXT_ICON,
      showInvatation: false,
      initList: [
        {
          name: '男孩',
          avatar: require("../../assets/invatation/boy.png")
        },
        {
          name: '女孩',
          avatar: require("../../assets/invatation/girl.png")
        }
      ],
      invatationList: [
        {
          name: '爸爸',
          avatar: require("../../assets/invatation/father.png")
        },
        {
          name: '妈妈',
          avatar: require("../../assets/invatation/mather.png")
        },
        {
          name: '爷爷',
          avatar: require("../../assets/invatation/grandpa.png")
        },
        {
          name: '奶奶',
          avatar: require("../../assets/invatation/grandma.png")
        },
        {
          name: '外公',
          avatar: require("../../assets/invatation/grandpa.png")
        },
        {
          name: '外婆',
          avatar: require("../../assets/invatation/grandma.png")
        },
        {
          name: '其他',
          avatar: require("../../assets/invatation/defaults.png")
        }
      ]
    }
  },
  methods: {
    childInvatation (name) {
      console.log(name)
      this.childName = name
      this.showChild = false
      this.showInvatation = true
    },
    toInvatation (index, name) {
      console.log(index, name)
      this.$router.push({
        path: '/invatation/beInvited',
        query: {
          beInvited: name,
          childName: this.childName,
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 0 .15rem;
  box-sizing: border-box;
  .child-box {
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s linear
    }
    &.fade-enter, &.fade-leave-active {
      opacity : 0;
      transform: translate3d(-100%, 0, 0)
    }
  }
  .invatation-box {
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s linear
    }
    &.fade-enter, &.fade-leave-active {
      opacity : 0;
      transform: translate3d(100%, 0, 0)
    }
  }
  .invatation-wrap {
    display: flex;
    padding: .12rem 0;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid rgba(244,244,244,1);
    .left {
      display: flex;
      align-items: center;
      img {
        width: .48rem;
        height: .48rem;
        border: 1px dotted #333;
      }
      .title {
        font-family:PingFangSC-Regular;
        font-weight:400;
        margin-left: .1rem;
        color:rgba(71,71,71,1);
        line-height:21px;
      }
    }
    .right {
      display: flex;
      color: #A3A19A;
      font-size: .13rem;
      align-items: center;
      img {
        width: .07rem;
        height: .13rem;
        margin-left: .1rem;
      }
    }
  }
}
</style>
