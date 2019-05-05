const overArg = function (func, transform) {
  return function (arg) {
    return func(transform(arg))
  }
}
let nativeKeys = overArg(Object.keys, Object)

const validate = {
  // 判断是否为办公电话
  isPhone: function (str) {
    var re = /^(0\d{2,3}-)?\d{7,8}(-\d{1,6}|\d{0})?$/
    return re.test(str)
  },
  iosOrAndroid: function () {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  },
  // 判断是否为微信环境
  isWeiXin: function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') != -1;
  },
  // 校验是否是中文英文字母
  isEnChianName (str) {
    var re = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/g
    var re2 = /^[\u4e00-\u9fa5]+(\.[\u4e00-\u9fa5]+)*$/g
    return re.test(str) || re2.test(str)
  },
  // 校验是否是银行卡号
  isBank (str) {
    let re = /^([1-9]{1})(\d{14,20})$/
    return re.test(str)
  },
  isMobile: function (str) {
    var re = /^1[3-9]\d{9}$/
    return re.test(str)
  },
  isNumber: function (str) {
    var re = /^[0-9]*$/
    return re.test(str)
  },
  isCompanyTel: function (str) {
    var re = /^(\d{3,4}-\d{7,8}(-\d{1,8})?)$/
    return re.test(str)
  },
  // isEmail: function (email) {
  //   var szReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
  //   return szReg.test(email)
  // },
  isEmpty: function (value) {
    if (value === null || value === undefined) {
      return true
    } else if (typeof value === 'string') {
      return (value.length <= 0)
    } else if (Array.isArray(value)) {
      return !value.length
    } else if (typeof value === 'object') {
      return !nativeKeys(value).length
    } else {
      return false
    }
  },
  isPassword: function (str) {
    // 1、长度8-12位
    // 2、至少包含数字、大写字母、小写字母和特殊字符中的三种
    var patternArr = [
      /\d+/,
      /[a-z]+/,
      /[A-Z]+/,
      /.*[^A-Za-z0-9]+.*?/
    ]

    var count = 0

    for (var i in patternArr) {
      if (patternArr[i].test(str.toString() || '')) {
        count++
      }
    }

    return count >= 3 && /^\S{8,12}$/.test(str.toString() || '')
    // return /^[a-zA-Z0-9]+$/.test(str.toString() || '')
  }
}
export default validate
