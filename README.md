# Picsum Image 📌

一个轻量、零运行时依赖的 TypeScript 工具，用来生成
[Lorem Picsum](https://picsum.photos/) 图片及数据接口 URL。适合占位图、原型、响应式图片和测试数据场景。

## 安装

```sh
npm install picsum-image
# 或 yarn add picsum-image
# 或 pnpm add picsum-image
```

## 快速开始

```ts
import { PicsumImage } from 'picsum-image'

PicsumImage.generateUrl({
  id: 123,
  width: 800,
  height: 450,
  grayscale: true,
  blur: 2,
  cache: false,
})
// https://picsum.photos/id/123/800/450?grayscale=true&blur=2
```

CommonJS 项目也可以使用：

```js
const { PicsumImage } = require('picsum-image')
```

## API

### `generateUrl(options?)`

生成完整的图片 URL。`id` 和 `seed` 不能同时使用。

```ts
PicsumImage.generateUrl({ seed: 'home-banner', width: 1200, height: 600 })
// https://picsum.photos/seed/home-banner/1200/600?random=xxxx
```

| 配置项    | 类型               | 默认值  | 描述                                      |
| :-------- | :----------------- | :------ | :---------------------------------------- |
| id        | `number`           | -       | 图片 ID，必须为非负整数；`0` 表示不指定   |
| seed      | `string \| number` | -       | 稳定随机种子；相同种子会匹配同一张图片    |
| width     | `number`           | `200`   | 图片宽度，必须为正整数                    |
| height    | `number`           | `200`   | 图片高度，必须为正整数                    |
| jpg       | `boolean`          | `false` | 是否使用 `.jpg` 后缀                      |
| blur      | `number`           | `0`     | 模糊度，`0` 为关闭，启用时范围为 `1-10`   |
| grayscale | `boolean`          | `false` | 是否转换为灰度图                          |
| cache     | `boolean`          | `true`  | 是否添加随机查询参数以绕过浏览器/CDN 缓存 |

### `randomImage(width, height, cache?)`

生成随机图片 URL。为兼容已有版本，此快捷方法的 `cache` 默认值为 `false`。

```ts
PicsumImage.randomImage(640, 360)
// https://picsum.photos/640/360
```

### `seedImage(seed, width, height?, cache?)`

生成稳定的随机图片。`height` 默认与 `width` 相同，适合头像和测试快照。

```ts
PicsumImage.seedImage('user-42', 128)
// https://picsum.photos/seed/user-42/128/128
```

### `squareImage(size, options?)`

生成正方形图片，并支持 `id`、`seed`、灰度和模糊等配置。

```ts
PicsumImage.squareImage(320, { id: 7, cache: false })
// https://picsum.photos/id/7/320/320
```

### `srcSet(widths, options?)`

生成可直接赋给 `<img srcset>` 或 `<source srcset>` 的字符串。重复宽度会自动去除；未提供高度时生成正方形候选图。

```ts
const srcset = PicsumImage.srcSet([320, 640, 1280], {
  seed: 'hero',
  cache: false,
})
// https://picsum.photos/seed/hero/320/320 320w, ...
```

### `listUrl(options?)`

生成图片列表接口 URL。`page` 默认 `1`，`limit` 默认 `30`，最大为 `100`。

```ts
PicsumImage.listUrl({ page: 2, limit: 50 })
// https://picsum.photos/v2/list?page=2&limit=50
```

### `infoUrl(id)`

生成指定图片的元数据接口 URL。

```ts
PicsumImage.infoUrl(1084)
// https://picsum.photos/id/1084/info
```

## 开发

```sh
pnpm test          # 运行单元测试
pnpm typecheck     # TypeScript 类型检查
pnpm lint          # ESLint 检查
pnpm format:check  # Prettier 格式检查
pnpm check         # 执行全部检查并构建
```

使用 `pnpm lint:fix` 自动修复 ESLint 问题，使用 `pnpm format` 格式化整个项目。

## License

[MIT](./LICENSE)
