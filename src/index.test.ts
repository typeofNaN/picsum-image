import { afterEach, describe, expect, it, vi } from 'vitest'

import { PicsumImage } from './index'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PicsumImage.generateUrl', () => {
  it('keeps the existing ID-based URL contract', () => {
    expect(
      PicsumImage.generateUrl({
        id: 42,
        width: 640,
        height: 480,
        jpg: true,
        grayscale: true,
        blur: 3,
        cache: false,
      }),
    ).toBe('https://picsum.photos/id/42/640/480.jpg?grayscale=true&blur=3')
  })

  it('keeps zero as the legacy no-ID selector', () => {
    expect(PicsumImage.generateUrl({ id: 0, cache: false })).toBe(
      'https://picsum.photos/200/200',
    )
  })

  it('treats explicit undefined options like omitted options', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    expect(
      PicsumImage.generateUrl({
        width: undefined,
        height: undefined,
        blur: undefined,
        cache: undefined,
      }),
    ).toBe('https://picsum.photos/200/200?random=5000')
  })

  it('builds a stable URL from an encoded seed', () => {
    expect(
      PicsumImage.generateUrl({
        seed: 'product hero/夏',
        width: 800,
        height: 450,
        cache: false,
      }),
    ).toBe('https://picsum.photos/seed/product%20hero%2F%E5%A4%8F/800/450')
  })

  it('rejects conflicting ID and seed selectors', () => {
    expect(() => PicsumImage.generateUrl({ id: 1, seed: 'cover' })).toThrow(
      'id and seed cannot be used together',
    )
  })

  it.each([
    [{ width: 0 }, 'width must be a positive integer'],
    [{ height: 1.5 }, 'height must be a positive integer'],
    [{ id: -1 }, 'id must be a non-negative integer'],
    [{ blur: 11 }, 'blur must be an integer between 1 and 10'],
  ])('rejects invalid numeric input %#', (options, message) => {
    expect(() => PicsumImage.generateUrl(options)).toThrow(message)
  })
})

describe('PicsumImage convenience APIs', () => {
  it('keeps the random image shortcut cacheable by default', () => {
    expect(PicsumImage.randomImage(640, 360)).toBe(
      'https://picsum.photos/640/360',
    )
  })

  it('builds a square image URL', () => {
    expect(PicsumImage.squareImage(320, { id: 7, cache: false })).toBe(
      'https://picsum.photos/id/7/320/320',
    )
  })

  it('builds a seeded image URL with square dimensions by default', () => {
    expect(PicsumImage.seedImage('avatar', 128, undefined, false)).toBe(
      'https://picsum.photos/seed/avatar/128/128',
    )
  })

  it('builds a responsive srcset and removes duplicate widths', () => {
    expect(
      PicsumImage.srcSet([320, 640, 320], {
        seed: 'banner',
        cache: false,
      }),
    ).toBe(
      'https://picsum.photos/seed/banner/320/320 320w, https://picsum.photos/seed/banner/640/640 640w',
    )
  })

  it('builds an image list API URL', () => {
    expect(PicsumImage.listUrl({ page: 2, limit: 50 })).toBe(
      'https://picsum.photos/v2/list?page=2&limit=50',
    )
  })

  it('builds an image metadata API URL', () => {
    expect(PicsumImage.infoUrl(1084)).toBe('https://picsum.photos/id/1084/info')
  })

  it('rejects a list limit above the Picsum API maximum', () => {
    expect(() => PicsumImage.listUrl({ limit: 101 })).toThrow(
      'limit must be an integer between 1 and 100',
    )
  })

  it.each([
    [{ page: 0 }, 'page must be a positive integer'],
    [{ page: 1.5 }, 'page must be a positive integer'],
  ])('rejects invalid list pagination %#', (options, message) => {
    expect(() => PicsumImage.listUrl(options)).toThrow(message)
  })

  it('rejects an empty srcset width list', () => {
    expect(() => PicsumImage.srcSet([])).toThrow('widths cannot be empty')
  })
})
