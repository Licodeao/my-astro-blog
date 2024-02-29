---
title: 前端图片资源优化的新姿势 💃🏻
author: Licodeao
publishDate: "2024-2-15"
img: /assets/articles/performance.webp
img_alt: 前端图片资源优化的新姿势 💃🏻
description: |
  图片资源优化的新手段: picture 标签
categories:
  - 性能优化
tags:
  - 性能优化
---

## 图片资源优化

在前端资源中，图片所占的资源消耗可以说是比足轻重，所以优化图片资源消耗就显得很重要了。借着 “我的博客背景图每次加载时都很慢” 的问题，来捋一捋图片优化的方法以及相关优化手段。

在当今，图片资源所面临的诸多问题：

- 图片资源体积过大，造成占用的资源过多，加载耗时过长
- CDN 流量开销过高
- 直接影响用户体验，并且影响两个测量指标：LCP(最大内容绘制) 和 FCP(首次内容绘制)

现如今我们在浏览器上可以很多图片格式，如常见的 `JPG` / `JPEG` / `PNG` 等等，同时又出现了新兴的图片格式，如 `AVIF` 和 `WEBP` 。既然出现了新图片格式，必然解决了某些问题：

| 格式   | 特点                                                              | 浏览器兼容性          |
| ------ | ----------------------------------------------------------------- | --------------------- |
| `jpg`  | 应用最广泛的图片格式，体积中等，一般小于 `gif` 和 `png`           | 几乎所有浏览器都支持  |
| `png`  | 支持图片部分透明，体积较大                                        | 几乎所有浏览器都支持  |
| `gif`  | 支持动态图片，体积较大                                            | 几乎所有浏览器都支持  |
| `svg`  | 矢量图，任意缩放都不影响清晰度，体积由内容决定                    | Chrome 4 以上版本支持 |
| `webp` | 支持动态图片，支持压缩(有损压缩、无损压缩)，专注 Web 端，体积较小 | Chrome 32 以上版本    |
| `avif` | 支持动态图片，只支持压缩，体积较小                                | Chrome 85 以上版本    |

<p align="center">（表中的兼容性都来自 <a href="https://caniuse.com/">caniuse</a>）</p>

可以从表看出：

- <font color="red">现代图片格式体积普通较小，都支持动态图片和压缩，但兼容性不够好</font>
- <font color="red">传统图片格式体积普遍较大，但兼容性够好</font>

如果我们使用现代图片格式就能够明显的解决 “图片资源体积大、加载耗时长、CDN 开销较大” 的问题，但是仍然会面临浏览器兼容性的问题，难道鱼和熊掌真的不可兼得吗？

你别说，你还真别说，还真有个方案可以。

### picture 标签

可以在 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture)查看更多。

MDN 说：**picture** 元素可以包含零或多个 **source** 元素和一个 **<img>** 元素，来为不同的场景提供最佳的图像版本。浏览器会选择最匹配的子 **source** 元素，如果没有匹配的，就选择 **<img>** 元素所指向的图像，你可以把 **<img>** 元素看成是兜底的。

也就是说 **picture** 元素允许同时引入多个图片格式的子元素，并根据浏览器的兼容性，按照先后顺序来自动加载其中一种图片格式的图片，实现所有用户根据自身兼容性，获取到最优的图片格式。

```html
<picture>
  <source srcset="url" media="(orientation: portrait)" type="image/webp" />
  <source srcset="url2" type="image/avif" />
  <img src="url" alt="img" />
</picture>
```

在这段代码中，有两个 **source** 元素和一个 **<img>** 元素，如果在浏览器上跑起来，那么只会触发 `webp` 一个图片资源的下载，正如前面所说的，浏览器会按照从上到下的顺序检查 **source** 元素，并且加载第一个浏览器兼容的图片格式，从而忽略后面的 **source** 元素和 **<img>** 元素。即使所有的 **source** 元素声明的图片格式浏览器都能够兼容，那也只会下载第一个 **source** 所指向的图片资源。

另外，可以看到代码中还有个 `media` 属性，它是一个用于选择的媒体条件，如果这个媒体条件匹配结果为 `false` ，那么这个 `source` 元素会被跳过。

❗❗❗`picture` 元素必须有一个 `img` 子元素，如果只有 `source` 元素，浏览器不会加载 `source` 元素的 `srcset` 属性对应的图片资源。

也就是说，即使用户的浏览器既不支持 **source** 元素指定的图片格式，甚至也不支持 **picture** 元素，浏览器也会自动降级到使用 **<img>** 元素，确保始终有正确的图片资源能够加载。所以，可以在

**<img>** 元素中使用传统图片格式这种兼容性好的方案作为兜底。

有了 **picture** 元素，还可以进一步与组件进行融合，封装出加载最优图片格式的图片组件：

```jsx
const imageFormatter = ["avif", "webp"];

export default function BestImage({ src, alt }) {
  return (
    <picture>
      {imageFormatter.map((formatter) => {
        return (
          <source
            // getImageUrl 是基于图片 CDN 封装的一个函数，用于获取指定格式的图片，这里不作实现
            srcset={getImageUrl(src, { formatter })}
            type={`image/${formatter}`}
          />
        );
      })}
      <img src={src} alt={alt} />
    </picture>
  );
}
```

### 图片 CDN

图片 CDN 能够高效地生成各种格式的图片，专用于处理图片类型的各种资源。云服务商们都有提供这个 图片 CDN 能力，你可以在上面实现自己的各种需求，如体积压缩、尺寸缩放、添加水印等等。具体的实现，可以去看各大云服务商们的文档即可。

### 验证

通过上方的优化方案，来优化博客的背景图片。

![image-20240221163716666](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240221163716666.png)

可以看到背景图片是 `jpeg` 格式，`jpeg` 和 `jpg` 其实是同一个图像文件格式，它们只是文件扩展名的不同表示方式，在技术实现上是一致的。`jpeg` 是联合图像专家组的缩写（Joint Photographic Experts Group），而 `jpg` 是 `jpeg` 文件的常见文件扩展名之一，也就是说 `jpeg` 和 `jpg` 其实是父子关系，本质都是一样的。

跑题了，从上图可以看到背景图片是 `jpeg` 格式，也就是 `jpg` 格式，且它的体积大小为 `3.3MB`，这算挺大的了，所以优化它的体积是迫在眉睫的事情。可以去压缩它，但会破坏画质，也可以转换成其他图片格式，这些工作都可以交给 `<picture>` 元素来搞定。

但尴尬的是由于我使用的是 `Vuepress-theme-reco` 主题，且它的配置是通过解析 `markdown` 文件来实现的，并且文件里的语法还是 `yaml` ，使用的是 `js-yaml` 这个库，所以无法去实践 `picture` 元素优化方案，略显可惜 🫢

![image-20240221170705936](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240221170705936.png)

不过机会尚多，可以在其他项目中使用 `<picture>` 元素优化方案～对于目前这个处境，还是老老实实地转换图片格式和压缩了。

我们通过在线压缩，将原来的 `3.3MB` 体积大小，压缩为 `489KB` 体积大小，不过代价是图片质量为原来的 `85%` 了

![image-20240221172657510](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240221172657510.png)

我们再通过将该 `jpeg` 转换为 `webp` 图片格式，看看效果：

![image-20240221172827288](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240221172827288.png)

可以看到转换后的体积大小为 `150KB`，足以证明 `webp` 图片格式的体积较小是尊嘟！

![image-20240221173048741](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240221173048741.png)

我们可以对比两者：左边是 `webp` 图片格式，它的体积大小是 `150KB` ；右边是压缩后的 `jpeg` 图片格式，它的体积大小是 `489KB`。

可以从图中看出 `webp` 图片相对于 `jpeg` 图片要暗淡点 / 糊点，没办法毕竟体积大小在那里摆着呢，其实整体上感觉还是没什么差别的，只是细微的地方有些清晰度损失罢了。
