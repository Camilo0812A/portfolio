import { Icon } from '@/components/ui/Icon'
import { useLenisApi } from '@/context/lenisContext'
import { portfolioData } from '@/data/portfolioData'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { profile, socials, nav, ui } = portfolioData
  const { footer: t } = ui
  const lenis = useLenisApi()
  const homeHref = nav[0]?.href ?? '#home'

  return (
    <footer className="border-t border-border px-4 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl font-extrabold uppercase tracking-[0.3em] text-text">
              {profile.initials}
            </p>
            <p className="mt-2 text-sm text-muted">
              © {YEAR} {profile.fullName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ul aria-label={t.socialsLabel} className="flex items-center gap-3">
              {socials.map((s) => {
                const external = s.url.startsWith('http')
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      aria-label={s.label}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon name={s.icon} size={18} aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>
            <button
              type="button"
              onClick={() => lenis.scrollTo(homeHref)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text transition-colors hover:border-gold hover:text-gold"
            >
              {t.backToTop}
              <Icon name="ArrowUp" size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border pt-6 font-mono text-[11px] tracking-wide text-muted md:flex-row md:justify-between">
          <p>{t.built}</p>
          <p>{t.artCredit}</p>
        </div>
      </div>
    </footer>
  )
}
