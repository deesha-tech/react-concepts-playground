import { useEffect, useRef, type ReactNode } from 'react';
import { BRAND, FEATURED_COURSE, OFFERINGS, tracked, whatsappLink } from './brand';
import type { Episode } from './types';
import logoLight from './logo-light.png';
import './shell.css';

/** Closes an open <details> menu when the user clicks anywhere outside it. */
function useCloseOnOutsideClick() {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return ref;
}

function TopBar({ episode }: { episode: Episode }) {
  const courses = useCloseOnOutsideClick();
  const mobile = useCloseOnOutsideClick();
  const links = [
    { label: 'All examples', href: BRAND.repoUrl },
    episode.videoUrl ? { label: 'Watch the episode', href: episode.videoUrl } : null,
    BRAND.youtube ? { label: 'YouTube', href: BRAND.youtube } : null,
    BRAND.instagram ? { label: 'Instagram', href: BRAND.instagram } : null,
  ].filter((l): l is { label: string; href: string } => l !== null);

  const courseLinks = OFFERINGS.map((o) => (
    <a key={o.path} href={tracked(o.path, episode.slug, 'menu')} target="_blank" rel="noreferrer">
      <span className="pg-menu-kind">{o.kind}</span>
      <span className="pg-menu-title">{o.title}</span>
    </a>
  ));

  return (
    <header className="pg-top">
      <div className="pg-top-inner">
        <a className="pg-brand" href={tracked('/', episode.slug, 'logo')} target="_blank" rel="noreferrer">
          <img src={logoLight} alt={BRAND.academy} />
        </a>
        <span className="pg-product">React Concepts Playground</span>
        <nav className="pg-nav" aria-label="Playground">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
          <details className="pg-menu" ref={courses}>
            <summary>Courses</summary>
            <div className="pg-menu-panel">{courseLinks}</div>
          </details>
        </nav>
        <a className="pg-cta" href={tracked(FEATURED_COURSE.path, episode.slug, 'topbar')} target="_blank" rel="noreferrer">
          Learn React live
        </a>
        <details className="pg-menu pg-mobile" ref={mobile}>
          <summary aria-label="Menu">Menu</summary>
          <div className="pg-menu-panel">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"><span className="pg-menu-title">{l.label}</span></a>
            ))}
            <hr />
            {courseLinks}
          </div>
        </details>
      </div>
    </header>
  );
}

function CourseAd({ episode }: { episode: Episode }) {
  const c = FEATURED_COURSE;
  const showBatch = Date.now() < new Date(c.nextBatch.until).getTime();
  return (
    <section className="pg-card pg-ad" aria-label="Featured course">
      <p className="pg-eyebrow pg-eyebrow-saffron">{c.eyebrow}</p>
      <h3>{c.title}</h3>
      <p className="pg-ad-pitch">{c.pitch}</p>
      <ul>
        {c.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>
      {showBatch && <p className="pg-batch">{c.nextBatch.label}</p>}
      <a className="pg-btn pg-btn-saffron" href={tracked(c.path, episode.slug, 'sidebar')} target="_blank" rel="noreferrer">{c.cta} →</a>
      <a className="pg-btn pg-btn-ghost" href={whatsappLink(c.whatsappMessage)} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
    </section>
  );
}

function InterviewBand({ episode }: { episode: Episode }) {
  const iv = episode.interview;
  if (!iv) return null;
  return (
    <section className="pg-interview" id="interview" aria-label="Interview question and answer">
      <div className="pg-wrap">
        <p className="pg-eyebrow pg-eyebrow-saffron">Asked in React interviews</p>
        <h2 className="pg-iv-q">“{iv.question}”</h2>
        <div className="pg-iv-grid">
          <div className="pg-iv-answer">
            <p className="pg-iv-label">A strong answer</p>
            {iv.answer.map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="pg-iv-side">
            <div className="pg-iv-short">
              <p className="pg-iv-label">Say it in 30 seconds</p>
              <p>{iv.short}</p>
            </div>
            {iv.followUps?.map((f) => (
              <details className="pg-iv-follow" key={f.q}>
                <summary><span className="pg-iv-label">Follow-up</span>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlaygroundShell({ episode, children }: { episode: Episode; children: ReactNode }) {
  return (
    <div className="pg">
      <TopBar episode={episode} />

      <section className="pg-hero">
        <div className="pg-wrap">
          <p className="pg-eyebrow">Ep {String(episode.n).padStart(2, '0')} · {episode.type}</p>
          <h1>{episode.title}</h1>
          <p className="pg-summary">{episode.summary}</p>
          <ul className="pg-chips">
            {episode.concepts.map((c) => <li key={c}>{c}</li>)}
          </ul>
          {episode.interview && (
            <a className="pg-iv-teaser" href="#interview">
              <span className="pg-iv-teaser-tag">Interview question</span>
              <span className="pg-iv-teaser-q">{episode.interview.question}</span>
              <span className="pg-iv-teaser-link">Read the model answer ↓</span>
            </a>
          )}
        </div>
      </section>

      <main className="pg-wrap pg-grid">
        <div className="pg-stage">{children}</div>
        <aside className="pg-side">
          <section className="pg-card">
            <p className="pg-eyebrow">How to play</p>
            <ol className="pg-steps">
              {episode.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>
          <section className="pg-card pg-challenge">
            <p className="pg-eyebrow pg-eyebrow-saffron">Your challenge</p>
            <p>{episode.challenge}</p>
          </section>
          <CourseAd episode={episode} />
        </aside>
      </main>

      <InterviewBand episode={episode} />

      <section className="pg-more">
        <div className="pg-wrap">
          <p className="pg-eyebrow">Keep building with Deesha</p>
          <h2>Go from concepts to production-ready skills</h2>
          <div className="pg-more-grid">
            {OFFERINGS.slice(1).map((o) => (
              <a key={o.path} className="pg-offer" href={tracked(o.path, episode.slug, 'more')} target="_blank" rel="noreferrer">
                <span className="pg-offer-kind">{o.kind}</span>
                <span className="pg-offer-title">{o.title}</span>
                <span className="pg-offer-blurb">{o.blurb}</span>
                <span className="pg-offer-link">Learn more →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="pg-footer">
        <div className="pg-wrap pg-footer-inner">
          <span>© {new Date().getFullYear()} {BRAND.academy} · {BRAND.tagline}</span>
          <a href={tracked('/', episode.slug, 'footer')} target="_blank" rel="noreferrer">{BRAND.websiteDisplay}</a>
        </div>
      </footer>
    </div>
  );
}
