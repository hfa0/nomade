import Link from 'next/link';
import ScrollBar from '@/components/ScrollBar';
import { LINKS } from '@/constants/links';

export default function FollowUs() {
  return (
    <ScrollBar duplicate={30} className="py-2">
      <Link
        href={LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="uppercase font-light hover:text-light/80 transition-colors whitespace-nowrap"
      >
        Follow us on Social Media
      </Link>
    </ScrollBar>
  );
}
