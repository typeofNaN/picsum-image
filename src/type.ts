export interface PicsumConfig {
  /**
   * 图片ID(px)
   */
  id?: number
  /**
   * 图片宽度(px)
   */
  width?: number
  /**
   * 图片高度
   */
  height?: number
  /**
   * 是否返回jpg格式图片
   */
  jpg?: boolean
  /**
   * 模糊度
   */
  blur?: number
  /**
   * 是否灰度图
  */
  grayscale?: boolean
  /**
   * 是否需要缓存
   */
  cache?: boolean
}

export interface QueryParams extends Pick<PicsumConfig, 'blur' | 'grayscale'> {
  /**
   * 随机数
   */
  random?: number
}
