/**
 * Resized variants the CMS stores for every upload (`foo-w480.jpg`, ...).
 * The `width-suffix` transformer can only point at these. Note the GraphQL
 * `resized` type also lists `w1200`, but that file is never generated (404).
 */
export const SUFFIX_WIDTHS = [480, 800, 1600, 2400]
