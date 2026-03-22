export const ROUTER = {
  home: { href: '/', label: 'Home' },
  gallery: { href: '/gallery', label: 'Gallery' },
  locations: { href: '/locations', label: 'Locations' },
  book: { href: '/book', label: 'Book' },
  partners: { href: '/partners', label: 'Partners' },
  faq: { href: '/faq', label: 'FAQ' },
} as const;

export const NAV_LINKS = [
  // ROUTER.gallery,
  ROUTER.locations,
  ROUTER.partners,
  ROUTER.faq,
] as const;

export const BOOK_LINK = ROUTER.book;
