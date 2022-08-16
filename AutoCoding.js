// ==UserScript==
// @name        AutoCode
// @namespace   Violentmonkey Scripts
// @match       http://jypsh.jiafei.site/code_training.php
// @grant       none
// @version     3
// @author      Astbreal
// @description 2022年7月20日 11:21:56
//              - 修复提供随机数种子，使时间显示更像真人操作
//              - 增加了出现错误修复机制，节省打卡时间。
// @license     MIT
// ==/UserScript==

var timebase = 1.5; // 全局时间基数
var timeMax = 4.3; // 最大有效打码时间
var countRun = 22; // 默认22次
var time = 4; // 默认每次打卡4s左右

// 使用随机数种子制作伪随机数
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

// 判断第n次小打卡时有没有错误
function faultExisted(codeNum) {
  if (codeNum > 0) {
    let tableId = document.getElementById("scoretable");
    let result = tableId.rows[codeNum].cells[3].innerText.trim("");
    // 取出表格，若表格中有错误的值，则刷新页面并将打卡次数加1
    if (result === "错误") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function passThisWork(needNum, timespan) {
  let count = 0;
  let timer = setInterval(function () {
    if (count < needNum) {
      document.getElementById("codeok").click();
      count++;
    } else {
      clearTimeout(timer);
      return;
    }
  }, timespan);
}

function autocode(finalDozenNum, time) {
  //n 为打卡次数，timebase为基础时间（最低多少秒打卡），timespan是时间误差。时间基本单位为秒。
  let commit = document.getElementById("sysok"); // 此处是每10次打完后需要点的确定键
  let codeNum = 0; // 10次小任务计数器，一组打完重置为0
  let dozenNum = 0; // 组数计数器。
  let timespan = time - timebase;
  let noFault = true;
  let passtime = 400; // pass时点击的时间

  // 每隔2-3.5秒填充并确认一次。延迟问题
  function codeAciton() {
    // 使用setTimeout做真随机定时任务
    function randomTimeWork() {
      let random = new Random();
      let timer = setTimeout(function () {
        // 只有做了一次才能检查
        if (codeNum > 0) {
          // 此处是检查上一次的打卡有没有出现错误
          let exist = faultExisted(codeNum);
          if (exist) {
            passCount = 10 - codeNum;
            passThisWork(passCount, passtime); // 直接错误提交后面的所有代码
            codeNum = 0;
            noFault = false;
            setTimeout(function () {
              codeAciton();
            }, passCount * passtime + 5000);
            return;
          }
        }

        if (codeNum > 9) {
          console.log("第", dozenNum, "次打码已完成");
          codeAciton();
          codeNum = 0;
          return;
        }

        //任务
        let img = document
          .getElementsByTagName("img")[0]
          .src.split("_")[1]
          .split(".")[0];
        document.getElementsByName("codenum")[0].value = img;
        document.getElementById("codeok").click();
        codeNum += 1; // 次数加1
        console.log(codeNum.toString().concat(": ", img)); // 在控制台显示计数

        // 递归调用，做随机时间定时任务
        randomTimeWork();
        clearTimeout(timer);
      }, timebase * 1000 + timespan * 1000 * random.next());
    }

    if (dozenNum < finalDozenNum) {
      if (noFault) {
        // 每成功的进行一次codeAction就组数的记录加一
        dozenNum++;
      }
      commit.click();
      randomTimeWork();
    } else {
      // 指定的任务次数已完成
      console.log("全部打卡已完成！");
      return;
    }
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
  setCountRun.style.width = "90px";
  setCountRun.style.height = "35px";
  setCountRun.style.fontSize = "15px";
  setCountRun.style.alignItems = "center";
  setCountRun.style.color = "rgb(0,0,139)";

  // 每次打码单位时间(2.6-4s)
  let CodeTime = document.createElement("input");
  CodeTime.id = "CodeTime01";
  CodeTime.value = "4s(默认时间)";
  CodeTime.style.width = "90px";
  CodeTime.style.height = "40px";
  CodeTime.style.fontSize = "13px";
  CodeTime.style.color = "rgb(128,0,128)";
  CodeTime.style.alignItems = "center";

  // 次数文本
  let RunTimevalue = document.createElement("input");
  RunTimevalue.id = "countRun01";
  RunTimevalue.value = "22(默认次数)";
  RunTimevalue.style.width = "90px";
  RunTimevalue.style.height = "40px";
  RunTimevalue.style.fontSize = "13px";
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
      if (CodeTime.value.trim() == "4s(默认时间)") {
        CodeTime.value = "";
      }
    };
    CodeTime.onblur = function () {
      if (CodeTime.value.trim() == "") {
        CodeTime.value = "4s(默认时间)";
      }
    };

    // RunTimevalue 焦点和非焦点默认值
    RunTimevalue.onfocus = function () {
      if (RunTimevalue.value.trim() == "22(默认次数)") {
        RunTimevalue.value = "";
      }
    };
    RunTimevalue.onblur = function () {
      if (RunTimevalue.value.trim() == "") {
        RunTimevalue.value = "22(默认次数)";
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
    } else {
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
  htmlSet(countRun, time);
})();
