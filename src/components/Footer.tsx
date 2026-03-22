import { Icon } from '@itsyouagency/ui';
import NomadeLogo from '@/components/Logo';
import { LINKS } from '@/constants/links';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-6 px-6">
      <div className='space-y-12'>
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex md:flex-col md:items-start items-center gap-4">
            <NomadeLogo variant="clean" size={40} className="text-light" />
            <h4 className='text-light'>NOMADE. PRESTIGE</h4>

          </div>
      
        </div>
        <div className='flex justify-between items-center'>
          <p>
            Design by{' '}
            <a
              href="https://itsyou.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light/70 hover:text-light/80 transition-colors"
            >
              ITSYOU.AGENCY
            </a>
          </p>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-light hover:text-light/80 transition-colors"
            aria-label="Instagram"
          >
            <Icon name="Insta" size={24} className="" />
          </a>
        </div>
      </div>

      <div className="max-w-8xl mx-auto mt-12 pt-8 border-t border-white/50 text-center text-light text-sm space-y-1">
        <p>NOMADE. PRESTIGE — Where heritage meets the future · Düsseldorf</p>

      </div>
    </footer>
  );
}
