import type {
  PicsumConfig,
  PicsumListOptions,
  PicsumSrcSetOptions,
  QueryParams,
} from './type'

export type { PicsumConfig, PicsumListOptions, PicsumSrcSetOptions }

const DEFAULT_OPTION = {
  width: 200,
  height: 200,
  jpg: false,
  blur: 0,
  grayscale: false,
  cache: true,
} satisfies Required<Omit<PicsumConfig, 'id' | 'seed'>>

const assertPositiveInteger = (value: number, name: string): void => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`)
  }
}

const assertImageId = (id: number): void => {
  if (!Number.isInteger(id) || id < 0) {
    throw new RangeError('id must be a non-negative integer')
  }
}

const assertBlur = (blur: number): void => {
  if (blur !== 0 && (!Number.isInteger(blur) || blur < 1 || blur > 10)) {
    throw new RangeError('blur must be an integer between 1 and 10')
  }
}

export class PicsumImage {
  /**
   * Picsum 服务根地址。
   */
  private static baseUrl = 'https://picsum.photos'

  /**
   * 生成 Picsum 图片 URL。
   * @param options 图片配置
   * @returns 图片 URL
   */
  static generateUrl(options: PicsumConfig = {}): string {
    let url = this.baseUrl
    const config = {
      id: options.id,
      seed: options.seed,
      width: options.width ?? DEFAULT_OPTION.width,
      height: options.height ?? DEFAULT_OPTION.height,
      jpg: options.jpg ?? DEFAULT_OPTION.jpg,
      blur: options.blur ?? DEFAULT_OPTION.blur,
      grayscale: options.grayscale ?? DEFAULT_OPTION.grayscale,
      cache: options.cache ?? DEFAULT_OPTION.cache,
    }

    assertPositiveInteger(config.width, 'width')
    assertPositiveInteger(config.height, 'height')
    assertBlur(config.blur)

    if (config.id !== undefined) assertImageId(config.id)

    // 旧版本将 id=0 视为未指定 ID，此处继续保留该行为。
    const hasImageId = config.id !== undefined && config.id !== 0
    if (hasImageId && config.seed !== undefined) {
      throw new TypeError('id and seed cannot be used together')
    }

    if (hasImageId) {
      url += `/id/${config.id}`
    } else if (config.seed !== undefined) {
      const seed = String(config.seed)
      if (seed.length === 0) {
        throw new TypeError('seed cannot be empty')
      }
      url += `/seed/${encodeURIComponent(seed)}`
    }

    url += `/${config.width}/${config.height}`

    if (config.jpg) url += '.jpg'

    // 查询参数的顺序保持稳定，便于快照、缓存键和日志对比。
    const params: QueryParams = {}
    if (config.grayscale) params.grayscale = true
    if (config.blur) params.blur = config.blur
    if (config.cache) params.random = Math.floor(Math.random() * 10000)

    const paramStr = (Object.keys(params) as Array<keyof typeof params>)
      .map((key) => `${key}=${params[key]}`)
      .join('&')

    if (paramStr) url += `?${paramStr}`

    return url
  }

  /**
   * 随机生成一张图片。
   * @param width 图片宽度(px)
   * @param height 图片高度(px)
   * @param cache 是否添加随机参数以绕过缓存，默认 false
   * @returns 图片 URL
   */
  static randomImage(width: number, height: number, cache = false): string {
    return this.generateUrl({
      width,
      height,
      cache,
    })
  }

  /**
   * 生成正方形图片 URL。
   * @param size 图片边长(px)
   * @param options 其余图片配置
   */
  static squareImage(
    size: number,
    options: Omit<PicsumConfig, 'width' | 'height'> = {},
  ): string {
    return this.generateUrl({ ...options, width: size, height: size })
  }

  /**
   * 使用种子生成稳定图片；相同种子和尺寸始终指向同一张图片。
   * @param seed 图片种子
   * @param width 图片宽度(px)
   * @param height 图片高度(px)，默认与宽度相同
   * @param cache 是否添加随机参数以绕过缓存
   */
  static seedImage(
    seed: string | number,
    width: number,
    height: number = width,
    cache = false,
  ): string {
    return this.generateUrl({ seed, width, height, cache })
  }

  /**
   * 生成可直接用于 img/source 元素的 srcset 字符串。
   * 未指定高度时，每个候选图片默认使用对应宽度作为高度。
   * @param widths 候选图片宽度列表(px)
   * @param options 其余图片配置
   */
  static srcSet(
    widths: readonly number[],
    options: PicsumSrcSetOptions = {},
  ): string {
    if (widths.length === 0) {
      throw new TypeError('widths cannot be empty')
    }

    return [...new Set(widths)]
      .map((width) => {
        const height = options.height ?? width
        const url = this.generateUrl({ ...options, width, height })
        return `${url} ${width}w`
      })
      .join(', ')
  }

  /**
   * 生成 Picsum 图片列表 API URL。
   * @param options 分页参数
   */
  static listUrl(options: PicsumListOptions = {}): string {
    const { page = 1, limit = 30 } = options
    assertPositiveInteger(page, 'page')
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('limit must be an integer between 1 and 100')
    }

    return `${this.baseUrl}/v2/list?page=${page}&limit=${limit}`
  }

  /**
   * 生成指定图片的元数据 API URL。
   * @param id 图片 ID
   */
  static infoUrl(id: number): string {
    assertImageId(id)
    return `${this.baseUrl}/id/${id}/info`
  }
}
