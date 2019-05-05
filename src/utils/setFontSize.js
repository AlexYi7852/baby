// ;(function (win, doc) {
//   var max = 414
//   var setFontSize = function () {
//     var myHTML = doc.querySelector('html')
//     var myWidth = doc.documentElement.clientWidth > max ? max : doc.documentElement.clientWidth
//     myHTML.style.fontSize = 100 * myWidth / 375 + 'px'
//   }
//   // 监听div和屏幕的改变
//   win.onresize = function () {
//     setFontSize()
//   }
//   setFontSize()
// })(window, document)

(function (doc, win) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          if (clientWidth >= 375) {
              docEl.style.fontSize = '100px';
          } else {
              docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
          }
          var html = document.getElementsByTagName('html')[0];
          var settedFs = settingFs = parseInt(100 * (clientWidth / 375));
          var whileCount = 0;
          while (true) {
              var realFs = parseInt(window.getComputedStyle(html).fontSize);
              var delta = realFs - settedFs;
              //不相等
              if (Math.abs(delta) >= 1) {
                  if (delta > 0)
                      settingFs--;
                  else
                      settingFs++;
                  html.setAttribute('style', 'font-size:' + settingFs + 'px!important');
              } else
                  break;
              if (whileCount++ > 100)
                  break
          }
      };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
