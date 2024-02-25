---
title: 详解requestAnimationFrame
author: Licodeao
publishDate: "2023-5-8"
img: https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/nestjs-graphql-mongodb.webp
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - JavaScript
tags:
  - ECMAScript
  - JavaScript
---

## requestAnimationFrame 是什么

> 语法：<font color="red">requestAnimationFrame(callback)</font>
>
> requestAnimationFrame 告诉浏览器——你<font color="red">希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画</font>。该方法<font color="red">需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行</font>。
>
> ⚠<font color="red">requestAnimationFrame()是一次性的</font>
>
> - 也就是说，<font color="blue">若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 requestAnimationFrame()</font>

## requestAnimationFrame 解决了什么问题？

- 它本质上<font color="red">解决了定时器时间间隔不稳定</font>的问题，<font color="red">可以将它看作是 setInterval 和 setTimeout 更好的解决方案</font>
- 因为<font color="red">显示屏的刷新频率是 60HZ，也就是每秒刷新 60 次。那么 1000ms 下，刷新 60 次所需时间为 1000/60≈16.67ms，这就是浏览器所显示的最大的刷新频率了</font>。
- 如果<font color="blue">刷新频率＞ 16.67ms，并不会提升用户体验</font>；反之，我们需要找到靠近 16.67ms 的时间，也就是 16 或者 17，在这个时间下的动画就会显得比较平滑了。

> 假如将 setInterval 或 setTimeout 的时间间隔设置为 16.67，会怎么样？

```javascript
setInterval(function () {}, 16.67);
```

众所周知，setInterval 和 setTimeout 都属于异步 API，并且也属于宏任务。那么它们就需要等待同步任务以及微任务完成以后，才会执行传入的回调函数。这就造成了一个问题：<font color="red">无法精准地将时间定位到 16.67，即使换成 16 或者 17，也无法精确定位。</font>

那么，requestAnimationFrame 的出现就解决了以上问题。

首先，需要明确的一点是：<font color="red">requestAnimationFrame 不是由 JavaScript 控制的，而是由系统的时间间隔来控制</font>。这样带来的<font color="blue">好处就是，不会因为 JavaScript 代码，导致当前任务时间间隔不准的问题</font>。

所以，<font color="red">requestAnimationFrame 的解决方式就是采用系统的时间间隔</font>。

从而，<font color="red">requestAnimationFrame 与 setInterval、setTimeout 的区别就是</font>：

- requestAnimationFrame 的时间间隔是由系统来控制，而非 setInterval、setTimeout 的时间间隔由我们来控制
- 因此，这就可以解释：在 requestAnimationFrame 的语法使用上，为什么不用指定时间间隔了

## 使用方法

```javascript
let timer1 = requestAnimationFrame(function () {
  console.log(1);
});

let timer2 = requestAnimationFrame(function () {
  console.log(2);
});

let timer3 = requestAnimationFrame(function () {
  console.log(3);
});

// 1 -> 2 -> 3
```

同样地，requestAnimationFrame 也可以像 setInterval、setTimeout 一样访问到当前的 timer

```javascript
let timer1 = requestAnimationFrame(function () {
  console.log(timer1);
});

let timer2 = requestAnimationFrame(function () {
  console.log(timer2);
});

let timer3 = requestAnimationFrame(function () {
  console.log(timer3);
});

// 1 -> 2 -> 3
```

与 clearTimeout 和 clearInterval 一样，requestAnimationFrame 也有着自己的清除定时器的 API（cancelAnimationFrame）。

但<font color="red">值得注意的是：window.cancelAnimationFrame 是一个 Experimental 功能，即是一个实验中的功能</font>。那么意味着此功能某些浏览器尚在开发中，请参考[浏览器兼容性表格](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/cancelAnimationFrame#浏览器兼容性)以得到在不同浏览器中适合使用的前缀。

```javascript
// requestID -> 先前调用window.requestAnimationFrame()方法时返回的ID

window.mozCancelAnimationFrame(requestID); // Firefox浏览器
```

```javascript
let timer1 = requestAnimationFrame(function () {
  console.log(timer1);
});

let timer2 = requestAnimationFrame(function () {
  console.log(timer2);
});

let timer3 = requestAnimationFrame(function () {
  console.log(timer3);
});

cancelAnimationFrame(timer1);

// 2 -> 3
```

## 兼容性处理

> 由于 requestAnimationFrame 是 HTML5 新增的一个 API，那么必然存在着兼容性的问题

```javascript
if (!window.requestAnimationFrame) {
  requestAnimationFrame = function (fn) {
    setTimeout(fn, 17);
  };
}
```

## 测试例子

> 以下导航条的测试例子

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <span style="font-size: 20px">setInterval</span>
    <div
      id="test"
      style="
        width: 0px;
        height: 12px;
        line-height: 12px;
        background-color: lightblue;
        margin: 10px 0;
      "
    >
      0%
    </div>

    <span style="font-size: 20px">setTimeout</span>
    <div
      id="test1"
      style="
        width: 0px;
        height: 12px;
        line-height: 12px;
        background-color: lightsalmon;
        margin: 10px 0;
      "
    >
      0%
    </div>

    <span style="font-size: 20px">requestAnimationFrame</span>
    <div
      id="test2"
      style="
        width: 0px;
        height: 12px;
        line-height: 12px;
        background-color: lightgreen;
        margin: 10px 0;
      "
    >
      0%
    </div>

    <script>
      // setInterval
      let Test = document.getElementById("test");
      Test.onclick = function () {
        let timer = setInterval(function () {
          if (parseInt(Test.style.width) < 300) {
            Test.style.width = parseInt(Test.style.width) + 3 + "px";
            Test.innerHTML = parseInt(Test.style.width) / 3 + "%";
          } else {
            clearInterval(timer);
          }
        }, 17);
      };

      // setTimeout
      let Test1 = document.getElementById("test1");
      Test1.onclick = function () {
        let timer = setTimeout(function fn() {
          if (parseInt(Test1.style.width) < 300) {
            Test1.style.width = parseInt(Test1.style.width) + 3 + "px";
            Test1.innerHTML = parseInt(Test1.style.width) / 3 + "%";
            timer = setTimeout(fn, 17);
          } else {
            clearInterval(timer);
          }
        }, 17);
      };

      // requestAnimationFrame
      let Test2 = document.getElementById("test2");
      Test2.onclick = function () {
        let timer = requestAnimationFrame(function fn() {
          if (parseInt(Test2.style.width) < 300) {
            Test2.style.width = parseInt(Test2.style.width) + 3 + "px";
            Test2.innerHTML = parseInt(Test2.style.width) / 3 + "%";
            timer = requestAnimationFrame(fn);
          } else {
            cancelAnimationFrame(timer);
          }
        });
      };
    </script>
  </body>
</html>
```

> 效果视频

<video controls width="80%" src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/e9fa7720cb73cdbbf6755d0ad32d8129.mp4"></video>

可以明显的看出，requestAnimationFrame 更快。当然，也不是非得用 requestAnimationFrame，只是在做相对复杂的动画效果时，它能带来更好的用户体验。
