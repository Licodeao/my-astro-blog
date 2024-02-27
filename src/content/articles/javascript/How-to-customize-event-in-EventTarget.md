---
title: 如何在EventTarget中自定义事件
author: Licodeao
publishDate: "2022-9-18"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - JavaScript
tags:
  - ECMAScript
  - JavaScript
---

## 前瞻

与上篇文章一样，属于探索类别。

今天结束了后台项目的部署上线，过程还算顺利，但在配置 Nginx 时出现了一点点问题，事后总结应该归属于团队合作没有配合好。由于自己之前也部署过项目上线，所以自认为在配置 Nginx 这个环节不会出差错，谁曾想，啪啪打脸...

所以，还是鼓足勇气准备决定开个 Nginx 专栏，来巩固与拓展自己的知识面与深度，嗯，就这么愉快的决定了！

至此，目前有 2 个专栏了：

- Google V8 引擎
- Nginx

最近关于招新的技术准备已落下帷幕

噢对了，今后除了部门工作需要及其他情况外，我绝不会在个人项目开发中再使用 uniapp 去写微信小程序了（发誓！！！）

后续招新只剩维护及后续版本更新迭代了

### Tag

- 关于 V8 专栏的第二篇，预计在国庆放假前一周周末(9.23-9.25)出
- Nginx 专栏的第一篇会在 9.23 之前出

## 正文

> 先来个 DOM 的继承图

![image-20220918235211566](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20220918235211566.png)

可以从图中发现，**EventTarget 是 DOM 的父类**，**所有的节点/元素都继承自 EventTarget。**

EventTarget 是一个**DOM 接口**，可以**添加、删除、派发事件**。因此，EventTarget 可以实现类似事件总线的效果。

### EventTarget 常见的方法

- addEventListener

  - 相信这个方法已经很熟悉了，用于**添加、注册事件**。

  - 注册事件有两种方式

    - 传统方法：通过 on 开头的事件来注册

      - 该方法具有**唯一性**：同一个元素同一个事件只能设置同一个事件处理函数

    - 非传统方法：通过 addEventListener 来注册事件

      - 该方法的特点：同一个元素同一个事件**可以设置多个监听器**

      - ```javascript
        // 将指定的监听器注册到eventTarget对象上，当该对象触发指定的事件时，就会执行对应的事件处理函数
        eventTarget.addEventListener(type, listener[, useCapture])
        ```

        | type       | 事件类型，如 click、mouseover 等，注意不能带 on             |
        | ---------- | ----------------------------------------------------------- |
        | listener   | 事件处理函数，指定事件发生时，就会触发该函数                |
        | useCapture | 是否捕获(true 为事件捕获)，**默认为 false(也就是事件冒泡)** |

- removeEventListener

  - **移除某个事件类型及事件处理函数有**两种方法
    - `eventTarget.onclick = null`
    - `eventTarget.addEventListener(type, listener[, useCapture])`

- dispatchEvent(派发事件)

> 因为需要演示例子，所以先说个结论：
>
> 实际上，**window 也继承自 EventTarget**，所以在演示时通过 window 调用父类 EventTarget 的 dispatchEvent 方法

```javascript
// 派发自定义事件
setTimeout(() => window.dispatchEvent(new Event("licodeao")), 3000); // 3秒后，派发licodeao事件

// 监听自定义事件
window.addEventListener("licodeao", () => console.log("监听到licodeao事件啦~"));
```

## 总结

虽然，在开发中并不会用此方法，但对理解事件总线应该会有帮助吧

至少了解到了一点新奇的玩意儿~
