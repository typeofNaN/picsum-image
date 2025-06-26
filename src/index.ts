import { PicsumConfig, QueryParams } from './type'

const DEFAULT_OPTION = {
  id: 0,
  width: 200,
  height: 200,
  jpg: false,
  blur: 0,
  grayscale: false,
  cache: true
}

export class PicsumImage {
  /**
   * baseUrl
   */
  private static baseUrl = 'https://picsum.photos'

  /**
   * 生成图片URL
   * @param { PicsumConfig } options 配置项
   * @returns { string } 图片URL
   */
  static generateUrl(options?: PicsumConfig) {
    let url = this.baseUrl
    const config = {
      ...DEFAULT_OPTION,
      ...(options || {}),
    }
    config.id && (url += `/id/${config.id}`)

    config.width && (url += `/${config.width}`)

    config.height && (url += `/${config.height}`)

    config.jpg && (url += '.jpg')

    //  添加查询参数
    const params: QueryParams = {}
    config.grayscale && (params.grayscale = config.grayscale)
    config.blur && (params.blur = config.blur)
    config.cache && (params.random = Math.floor(Math.random() * 10000))

    const paramStr = (Object.keys(params) as Array<keyof typeof params>)
      .map(key => key + '=' + params[key])
      .join('&')

    paramStr && (url += `?${paramStr}`)

    return url
  }

  /**
   * 随机生成一张图片
   * @param { number } width 图片宽度
   * @param { number } height 图片高度
   * @param { boolean } cache 是否需要缓存，默认false
   * @returns { string } 图片URL
   */
  static randomImage(width: number, height: number, cache = false) {
    return this.generateUrl({
      width,
      height,
      cache
    })
  }
}
