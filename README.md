# Picsum Image 📌

随机生成一张 `Picsum` 图片，可用于没有图片时快速生成一张占位图。

## Installation

``` sh
# using npm
npm install picsum-image --save

# using yarn
yarn add picsum-image

# using pnpm
pnpm add picsum-image
```

## Usage

``` js
import { PicsumImage } from 'picsum-image'

/**
 * 生成Picsum图片链接
 * @param { PicsumConfig } options 配置项
 * @returns { string } 图片URL
 */
const imageUrl1 = PicsumImage.generateUrl({
  id: 123, // 图片ID
  width: 200, // 图片宽度(px)
  height: 200, // 图片高度(px)
  jpg: false, // 是否返回jpg格式图片
  blur: 0, // 模糊度
  grayscale: false, // 是否灰度图
  cache: true // 是否需要缓存
})
console.log(imageUrl1) // https://picsum.photos/id/123/200/200?random=6502

/**
 * 随机生成一张图片
 * @param { number } width 图片宽度(px)
 * @param { number } height 图片高度(px)
 * @param { boolean } cache 是否需要缓存，默认false
 * @returns { string } 图片URL
 */
const imageUrl2 = PicsumImage.randomImage(300, 300, true)
console.log(imageUrl2) // https://picsum.photos/300/300?random=8264
```

配置项：

| 配置项    | 数据类型 | 是否必填 | 默认值 | 描述                |
| :-------- | :------- | :------: | :----- | :------------------ |
| id        | number   |    否    | 0      | 图片ID              |
| width     | number   |    否    | 200    | 图片宽度(px)        |
| height    | number   |    否    | 200    | 图片高度(px)        |
| jpg       | boolean  |    否    | false  | 是否返回jpg格式图片 |
| blur      | number   |    否    | 0      | 模糊度              |
| grayscale | boolean  |    否    | false  | 是否灰度图          |
| cache     | boolean  |    否    | true   | 是否需要缓存        |
