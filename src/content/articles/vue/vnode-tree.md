---
title: VNode Tree的生成
author: Licodeao
publishDate: "2023-6-27"
img: ""
img_alt: NestJS 集成 GraphQL 和 MongoDB
description: |
  如何在 NestJS 中集成 GraphQL 和 MongoDB
categories:
  - Vue
tags:
  - Vue
---

<img src="https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20230627092154090.png" width="100%"/>

```vue
<div id="app"></div>

<script>
var vm = new Vue({
  el: "#app",
  data: {
    title: "Hello World",
    text: "文本",
  },
  // template配置是一个字符串
  template: `
        	<div id="app">
    			<h1>{{title}}</h1>
    		</div>
        `,
  // render函数接收一个h参数，它也是一个函数
  // render函数返回的结果直接作为虚拟节点树
  render(h) {
    return h("div", [h("h1", `${this.title}`), h("p", `${this.text}`)]);
  },
});
</script>
```
