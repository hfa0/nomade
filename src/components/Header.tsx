import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { Icon } from '@itsyouagency/ui';
import Logo from '@/components/Logo';
import { NAV_LINKS, BOOK_LINK } from '@/constants/router';

const SCROLL_THRESHOLD = 50;

export default function Header() {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // init for SSR/hydration
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const usePrimaryBg = isHome && scrolled;
  const isLightText = isHome || usePrimaryBg;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-200',
        isHome
          ? usePrimaryBg
            ? 'bg-primary text-light'
            : 'bg-transparent text-light'
          : 'bg-light border-b border-primary/10'
      )}
    >
      <div className="relative max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo
          href="/"
          variant="clean"
          size={58}
          className={isLightText ? 'text-light' : 'text-primary'}
        />
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={classNames(
                'relative group text-sm uppercase tracking-widest font-medium transition-colors inline-block',
                isLightText
                  ? 'text-light/90 hover:text-white'
                  : router.pathname === href
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
              )}
            >
              {label}
              <span
                className={classNames(
                  'absolute left-0 bottom-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left',
                  isLightText ? 'bg-light' : 'bg-primary'
                )}
              />
            </Link>
          ))}
          <Link
            href={BOOK_LINK.href}
            className={classNames(
              'ml-4 px-5 py-2.5 text-sm uppercase tracking-widest font-medium transition-colors rounded-sm shrink-0',
              isLightText
                ? 'bg-light text-primary hover:bg-white'
                : 'bg-primary text-light hover:bg-primary/90'
            )}
          >
            {BOOK_LINK.label}
          </Link>
        </nav>
        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden p-2 -m-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon
            name="Menu"
            size={32}
            className={isLightText ? 'text-light' : 'text-primary'}
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={classNames(
          'absolute left-0 right-0 top-full bg-primary py-4 px-6 shadow-lg transition-all duration-300 md:hidden',
          menuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col space-y-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={classNames(
                'block py-3 text-sm uppercase tracking-widest font-medium transition-colors',
                router.pathname === href
                  ? 'text-light'
                  : 'text-light/90 hover:text-white'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href={BOOK_LINK.href}
            onClick={closeMenu}
            className="mt-2 py-3 px-5 bg-light text-primary text-sm uppercase tracking-widest font-medium text-center rounded-sm"
          >
            {BOOK_LINK.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
