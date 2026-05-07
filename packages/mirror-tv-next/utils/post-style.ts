/**
 * Post-style decisions driven by post metadata (e.g. slug).
 *
 * Centralizes presentation rules that depend on post properties so they
 * can evolve in one place instead of being duplicated at each call site.
 */

// SOT (Sound on Tape) posts are auto-imported from YouTube playlists.
// Their thumbnails are typically 16:9 video stills; using `cover` crops
// out important content, so we render them with `contain` and rely on
// the container's black background to letterbox the empty area.
export const isSotPost = (slug?: string | null): boolean =>
  slug?.includes('sot') ?? false

export const getSotThumbnailObjectFit = (
  slug?: string | null
): 'contain' | 'cover' => (isSotPost(slug) ? 'contain' : 'cover')
