<template>
  <transition name="move">
    <div class="container">
      <section class="top">
        <div class="title">已建立宝宝账号</div>
        <div class="describe">
          您的家人已经建立了宝宝账号。
          现在需要对你们的宝宝资料做一个家庭合并。
          无论以哪种方式合并您上传的记录都不会丢失。
        </div>
      </section>
      <section class="data">
        <div class="title">
          <div class="prefix"></div>
          <div class="describe">
            您的<span>{{ initData.named }}</span>，给你的
            <span>{{ childInfo.nickname }}</span>，创建了一份资料
          </div>
        </div>
        <div class="detail">
          <img :src="childInfo.imgurl" />
          <div class="describe">
            <section>昵称：{{ childInfo.nickname ? childInfo.nickname : '暂无' }}</section>
            <section>生日：{{ childInfo.birthday ? filterBirthday(childInfo.birthday) : '暂无' }}</section>
            <section>血型：{{ childInfo.bloodtype ? childInfo.bloodtype + '型' : '暂无' }}</section>
            <section>身高：{{ childInfo.heigth ? childInfo.heigth + 'cm' : '暂无' }}</section>
            <section>体重：{{ childInfo.weigth ? hildInfo.weigth + 'kg' : '暂无' }}</section>
          </div>
        </div>
      </section>
      <section class="merge" v-if="!isMultipleData">
        <div class="title">
          <div class="prefix"></div>
          <div>你们建立是同一个宝宝的资料</div>
        </div>
        <div class="detail">
          <section class="detail-top">
            <img :src="initData.info ? initData.info.imgurl : ''" alt="">
            <section class="other">
              <div>以TA建立宝宝的资料为主</div>
              <div class="button" @click="mergeOrAddChildInfo(0, mergeInfo.id, mergeInfo.shareid)">合并</div>
            </section>
          </section>
        </div>
      </section>
      <section class="merge" v-if="isMultipleData">
        <div class="title">
          <div class="prefix"></div>
          <div>你们建立是同一个宝宝的资料</div>
        </div>
        <div class="founder-wrap" v-for="(item, index) in mergeInfo" :key="index">
          <section class="detail-top">
            <img :src="item.imgurl" alt="">
            <section class="other">
              <div>以TA建立宝宝的资料为主</div>
              <div class="button" @click="mergeOrAddChildInfo(0, item.id, item.shareid)">合并</div>
            </section>
          </section>
          <div class="info">
            <section>昵称：{{ item.nickname ? item.nickname : '暂无' }}</section>
            <section>生日：{{ item.birthday ? filterBirthday(item.birthday) : '暂无' }}</section>
            <section>血型：{{ item.bloodtype ? item.bloodtype + '型' : '暂无' }}</section>
            <section>身高：{{ item.heigth ? item.heigth + 'cm' : '暂无' }}</section>
            <section>体重：{{ item.weigth ? item.weigth + 'kg' : '暂无' }}</section>
          </div>
        </div>
      </section>
      <section class="add">
        <div class="title">
          <div class="prefix"></div>
          <div>你们建立是不同宝宝的资料</div>
        </div>
        <div class="button" @click="mergeOrAddChildInfo(1)">直接添加</div>
      </section>
      <loading :isShow.sync="showLoading"></loading>
      <tip :isShowTips="tipsShow" :text="tipMessage"></tip>
    </div>
  </transition>
</template>

<script>
import Tip from '@/components/Tips'
import validate from '@/utils/validate'
import Loading from '@/components/Loading'
export default {
  data () {
    return {
      childInfo: {}, // 宝贝信息
      mergeInfo: [], // 合并信息
      initData: {}, // 初始化数据
      isIos: validate.iosOrAndroid(),
      showLoading: true, // 是否显示loading
    }
  },
  computed: {
    // 是否多份合并资料
    isMultipleData () {
      if (this.mergeInfo) {
        return this.mergeInfo.length > 1 ? true : false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$post('/api-login/v2/login/invitconfirm', {
        code: this.$route.query.code,
        invitconfirm: this.$route.query.invitconfirm
      }).then(res => {
        this.showLoading = false
        this.initData = res.data
        this.mergeInfo = res.data.invitee
        this.childInfo = res.data.invitor[0]
      })
    },
    // 合并/添加 孩子资料
    mergeOrAddChildInfo (num, childId = '', shareId = this.mergeInfo[0].shareid) {
      this.$post('/api-member/v2/member/child/merge', {
        token: this.initData.info.token,
        targetshareid: shareId.toString(), // 指定的家庭
        targetid: childId.toString(), // 合并/添加 后的小孩子主键id
        sourceshareid: this.childInfo.shareid.toString(),
        sourceid: this.childInfo.id.toString(), // 被合并的孩子主键id
        invitorNamed: this.initData.invitorNamed // 被邀请人的角色
      }).then(res => {
        if (res.code === 200) {
          this.showTips(num ? '添加成功' : '合并成功')
          this.$router.push('/download/index')
        } else {
          this.showTips(num ? '添加失败' : '合并失败')
        }
      })
    },
    filterBirthday (val) {
      let arr = val.substr(0,10).split('-')
      let year = arr[0] + '年'
      let month = arr[1] + '月'
      let date = arr[2] + '日'
      return year + month + date
    }
  },
  components: { Loading, Tip }
}
</script>


<style lang="less" scoped>
.container {
  padding: .2rem .15rem;
  box-sizing: border-box;
  &.move-enter-active, &.move-leave-active {
    transition: all 0.2s linear;
  }
  &.move-enter, &.move-leave-active {
    opacity : 0;
    transform: translate3d(100%, 0, 0)
  }
  .top {
    box-sizing: border-box;
    padding: 0 .19rem .15rem .19rem;
    border-bottom: 1px solid #F4F4F4;
    .title {
      color: #FF7AAA;
      font-size: .25rem;
      line-height: .36rem;
    }
    .describe {
      color: #A3A19A;
      font-size: .14rem;
      line-height: .2rem;
    }
  }
  .data {
    padding: .15rem 0;
    box-sizing: border-box;
    border-bottom: 1px solid #F4F4F4;
    .title {
      display: flex;
      align-items: center;
      .prefix {
        width: 4px;
        height: .2rem;
        border-radius: 2px;
        margin-right: .15rem;
        background: #FF7AAA;
      }
      .describe {
        color: #A3A19A;
        font-size: .14rem;
        span {
          color: #FF7AAA;
        }
      }
    }
    .detail {
      width: 3.07rem;
      height: 1.8rem;
      padding: .15rem;
      display: flex;
      border-radius: 5px;
      background: #F5F6FA;
      box-sizing: border-box;
      margin: .17rem auto 0 auto;
      img {
        width: .48rem;
        height: .48rem;
        border-radius: 50%;
        margin-right: .16rem;
      }
      .describe {
        color: #A3A19A;
        font-size: .13rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
  .merge {
    padding: .15rem 0;
    box-sizing: border-box;
    border-bottom: 1px solid #F4F4F4;
    .title {
      display: flex;
      color: #A3A19A;
      font-size: .14rem;
      align-items: center;
      .prefix {
        width: 4px;
        height: .2rem;
        border-radius: 2px;
        margin-right: .15rem;
        background: #FF7AAA;
      }
    }
    .detail {
      display: flex;
      width: 3.07rem;
      height: 0.6rem;
      border-radius: 5px;
      background: #F5F6FA;
      box-sizing: border-box;
      padding: .06rem .15rem;
      margin: .17rem auto 0 auto;
      .detail-top {
        display: flex;
        img {
          width: .48rem;
          height: .48rem;
          border-radius: 50%;
          margin-right: .16rem;
        }
        .other {
          display: flex;
          color: #474747;
          font-size: .13rem;
          flex-direction: column;
          justify-content: space-between;
          .button {
            width: .6rem;
            height: .21rem;
            color: #ffffff;
            text-align: center;
            line-height: .21rem;
            border-radius: 13px;
            background: #FBBED4;
            border: 1px solid rgba(255,122,170,1);
          }
        }
      }
    }
    .founder-wrap {
      width: 3.07rem;
      height: 2.49rem;
      border-radius: 5px;
      background: #F5F6FA;
      margin: .17rem auto 0 auto;
      .detail-top {
        display: flex;
        height: .6rem;
        box-sizing: border-box;
        padding: .06rem .15rem;
        img {
          width: .48rem;
          height: .48rem;
          border-radius: 50%;
          margin-right: .16rem;
        }
        .other {
          display: flex;
          color: #474747;
          font-size: .13rem;
          flex-direction: column;
          justify-content: space-between;
          .button {
            width: .6rem;
            height: .21rem;
            color: #ffffff;
            text-align: center;
            line-height: .21rem;
            border-radius: 13px;
            background: #FBBED4;
            border: 1px solid rgba(255,122,170,1);
          }
        }
      }
      .info {
        display: flex;
        padding: .15rem;
        color: #A3A19A;
        font-size: .14rem;
        flex-direction: column;
        box-sizing: border-box;
        height: calc(100% - .6rem);
        border-top: 1px solid #fff;
        justify-content: space-between;
      }
    }
  }
  .add {
    padding: .15rem 0;
    box-sizing: border-box;
    // border-bottom: 1px solid #F4F4F4;
    .title {
      display: flex;
      color: #A3A19A;
      font-size: .14rem;
      align-items: center;
      .prefix {
        width: 4px;
        height: .2rem;
        border-radius: 2px;
        margin-right: .15rem;
        background: #FF7AAA;
      }
    }
    .button {
      width: 3.07rem;
      height: 0.6rem;
      color: #474747;
      font-size: .15rem;
      text-align: center;
      border-radius: 5px;
      line-height: .6rem;
      background: #F5F6FA;
      margin: .17rem auto 0 auto;
    }
  }
}
</style>
