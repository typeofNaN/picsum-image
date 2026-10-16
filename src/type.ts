export interface PicsumConfig {
  /**
   * 图片 ID，与 seed 互斥；0 为兼容旧版本，表示不指定 ID
   */
  id?: number
  /**
   * 稳定的随机图片种子，与 id 互斥
   */
  seed?: string | number
  /**
   * 图片宽度(px)
   */
  width?: number
  /**
   * 图片高度(px)
   */
  height?: number
  /**
   * 是否返回jpg格式图片
   */
  jpg?: boolean
  /**
   * 模糊度，取值范围为 1-10；0 表示不启用
   */
  blur?: number
  /**
   * 是否灰度图
   */
  grayscale?: boolean
  /**
   * 是否添加随机参数以绕过浏览器缓存
   */
  cache?: boolean
}

/** 图片列表接口的分页参数。 */
export interface PicsumListOptions {
  /** 页码，从 1 开始。 */
  page?: number
  /** 每页数量，取值范围为 1-100。 */
  limit?: number
}

/** 生成响应式 srcset 时可复用的图片配置。 */
export type PicsumSrcSetOptions = Omit<PicsumConfig, 'width'>

export interface QueryParams extends Pick<PicsumConfig, 'blur' | 'grayscale'> {
  /**
   * 随机数
   */
  random?: number
}
