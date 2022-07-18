// ==UserScript==
// @name        AutoCode
// @namespace   Violentmonkey Scripts
// @match       http://jypsh.jiafei.site/code_training.php
// @grant       none
// @version     1.0
// @author      Astbreal
// @description 2022/7/18 14:25:35
// @license     MIT
// ==/UserScript==
function autocode(n, timebase, timespan) {
  //n 为打卡次数，timebase为基础时间（最低多少秒打卡），timespan是时间误差。时间基本单位为秒。
  let commit = document.getElementById("sysok");
  let countCode = 0; // 10次小任务，打完重置为0
  let countSys = 0; // 默认开启

  // 每隔2-3.5秒填充并确认一次。延迟问题
  function codeAciton() {
    let timer = setInterval(function () {
      if (countCode >= 10) {
        clearTimeout(timer);
        countCode = 0;
        return;
      }

      if (countSys < n) {
        if (countCode === 9) {
          setTimeout(function () {
            countSys++;
            console.log("第",countSys,"已完成");
            codeAciton();
          }, 8000);
        }
        let img = document
          .getElementsByTagName("img")[0]
          .src.split("_")[1]
          .split(".")[0];
        document.getElementsByName("codenum")[0].value = img;
        document.getElementById("codeok").click();
        countCode += 1; // 次数加1
        console.log(countCode.toString,": ",img);
      } else {
        clearTimeout(timer);
        console.log("全部打卡已完成！");
        // location.reload();
      }
    }, timebase * 1000 +
      (timespan / 2) * 1000 * Math.random() +
      (timespan / 2) * 1000 * Math.random());
    if (countSys < n) {
      commit.click();
    }
  }
  if (n>0){
    commit.click();
  }

  codeAciton();
}

function htmlSet(count) {
  // 开始打开按钮
  let start = document.createElement("button");
  start.id = "startas01";
  start.textContent = "开始打码";
  start.style.width = "90px";
  start.style.height = "35px";
  start.style.fontSize = "18px";
  start.style.alignItems = "center";
  start.style.color = "rgb(0,0,139)";

  // 设置次数按钮
  let setCountRun = document.createElement("button");
  setCountRun.id = "setCountRun01";
  setCountRun.textContent = "确认设置次数";
  setCountRun.style.width = "130px";
  setCountRun.style.height = "35px";
  setCountRun.style.fontSize = "18px";
  setCountRun.style.alignItems = "center";
  setCountRun.style.color = "rgb(0,0,139)";

  // 次数文本
  let countRunvalue = document.createElement("input");
  countRunvalue.id = "countRun01";
  countRunvalue.value = 22;
  countRunvalue.style.width = "60px";
  countRunvalue.style.height = "30px";
  countRunvalue.style.fontSize = "25px";
  countRunvalue.style.color = "green";
  countRunvalue.style.alignItems = "center";

  var countx = document.getElementById("codebestscore");
  // var startx = document.getElementById("codesuccesscount");
  var username = document.getElementById("userrealname");

  // 放置按钮位置
  countx.append(start);
  username.before(setCountRun);
  username.append(countRunvalue);

  // 绑定按钮动作
  setCountRun.onclick = function () {
    count = countRunvalue.value.valueOf();
    count = parseInt(count);
    console.log("已经将次数设置为", count);
    // console.log(typeof(count))
  };

  start.onclick = function () {
    console.log("开始打码！一共有",count,"次。");
    // console.log(typeof(count));
    autocode(count, 2.5, 1.4); //建议设置24 因为有图片的数字与答案不一致
  };
}

(function () {
  "use strict";
  var countRun = 22; // 默认22次
  htmlSet(countRun);
})();