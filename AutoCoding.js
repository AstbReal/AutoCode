// ==UserScript==
// @name        AutoCode
// @namespace   Violentmonkey Scripts
// @match       http://jypsh.jiafei.site/code_training.php
// @grant       none
// @version     2
// @author      Astbreal
// @description 2022年7月20日 11:21:56
//              - 修复提供随机数种子，使时间显示更像真人操作
//              - 提供设定时间按钮，默认的时间基数是2.4s(想更改自己去改源码)，time是最终要要设定的时间。 默认最终时间是4s左右
// @license     MIT
// ==/UserScript==

// 使用随机数种子制作伪随机数

var timebase = 2.1; // 全局时间基数
var timeMax = 4.5; // 最大有效打码时间

class Random {
  // 实例化一个随机数生成器，seed=随机数种子，默认当前时间
  constructor(seed) {
    this.seed = (seed || Date.now()) % 999999999;
  }

  // 取一个随机整数 max=最大值（0开始，不超过该值） 默认1
  next(max) {
    max = max || 1;
    this.seed = (this.seed * 9301 + 49297) % 233280;
    let val = this.seed / 233280.0;
    return Math.fround(val * max);
  }
}

function autocode(n, time) {
  //n 为打卡次数，timebase为基础时间（最低多少秒打卡），timespan是时间误差。时间基本单位为秒。
  let commit = document.getElementById("sysok");
  let countCode = 0; // 10次小任务，打完重置为0
  let countSys = 0; // 默认开启
  let timespan = time - timebase;
  let random = new Random();

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
            console.log("第", countSys, "次打码已完成");
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
        console.log(countCode.toString().concat(": ", img));
      } else {
        clearTimeout(timer);
        console.log("全部打卡已完成！");
        // location.reload();
      }
    }, timebase * 1000 + timespan * 1000 * random.next());
    if (countSys < n) {
      commit.click();
    }
  }
  if (n > 0) {
    commit.click();
  }

  codeAciton();
}

function htmlSet(count, time) {
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
  setCountRun.textContent = "确认设置";
  setCountRun.style.width = "100px";
  setCountRun.style.height = "35px";
  setCountRun.style.fontSize = "18px";
  setCountRun.style.alignItems = "center";
  setCountRun.style.color = "rgb(0,0,139)";

  // 每次打码单位时间(2.6-4s)
  let CodeTime = document.createElement("input");
  CodeTime.id = "CodeTime01";
  CodeTime.value = "4s(Max Time)";
  CodeTime.style.width = "100px";
  CodeTime.style.height = "40px";
  CodeTime.style.fontSize = "15px";
  CodeTime.style.color = "rgb(128,0,128)";
  CodeTime.style.alignItems = "center";

  // 次数文本
  let RunTimevalue = document.createElement("input");
  RunTimevalue.id = "countRun01";
  RunTimevalue.value = "22(Count)";
  RunTimevalue.style.width = "80px";
  RunTimevalue.style.height = "40px";
  RunTimevalue.style.fontSize = "15px";
  RunTimevalue.style.color = "green";
  RunTimevalue.style.alignItems = "center";

  var countx = document.getElementById("codebestscore");
  // var startx = document.getElementById("codesuccesscount");
  var username = document.getElementById("userrealname");

  // 放置按钮位置
  countx.append(start);
  username.before(setCountRun);
  username.append(RunTimevalue);
  username.appendChild(CodeTime);

  // 设置焦点显示
  window.onload = function () {
    // CodeTime 设置焦点和非焦点时的默认值。
    CodeTime.onfocus = function () {
      if (CodeTime.value.trim() == "4s(Max Time)") {
        CodeTime.value = "";
      }
    };
    CodeTime.onblur = function () {
      if (CodeTime.value.trim() == "") {
        CodeTime.value = "4s(Max Time)";
      }
    };

    // RunTimevalue 焦点和非焦点默认值
    RunTimevalue.onfocus = function () {
      if (RunTimevalue.value.trim() == "22(Count)") {
        RunTimevalue.value = "";
      }
    };
    RunTimevalue.onblur = function () {
      if (RunTimevalue.value.trim() == "") {
        RunTimevalue.value = "22(Count)";
      }
    };
  };

  // 绑定按钮动作
  setCountRun.onclick = function () {
    // 设置打码总次数
    countStr = RunTimevalue.value.valueOf();

    if (parseInt(countStr) > 0 && parseInt(countStr) < 35) {
      count = parseInt(countStr);
      console.log("已经将次数设置为", count);
    } else {
      console.log(
        "设置失败，次数必须介入在0到35次之间，当前总次数为：",
        parseInt(countStr)
      );
    }

    // 设置单词打码时间
    TimeStr = CodeTime.value.valueOf();

    if (parseFloat(TimeStr) > timebase && parseFloat(TimeStr) < timeMax) {
      time = parseFloat(TimeStr);
      console.log("已经将单次最大时间设置为", time);
    }else{
      console.log(
        `设置失败，单词打码时间必须介入在${timebase}到${timeMax}秒之间，当前设置的单次打码时间为：`,
        parseInt(TimeStr)
      );
    }
    // console.log(typeof(count))
  };

  start.onclick = function () {
    console.log("开始打码！一共有", count, "次。");
    // console.log(typeof(count));
    autocode(count, time); //建议设置24 因为有图片的数字与答案不一致
  };
}

(function () {
  "use strict";
  var countRun = 22; // 默认22次
  var time = 4; // 默认每次打卡4s左右
  htmlSet(countRun, time);
})();
