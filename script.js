document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (!navToggle || !mainNav) return;

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = !mainNav.classList.contains('is-open');
    if (isOpen) {
      mainNav.classList.add('is-open');
      navToggle.classList.add('is-active');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Fermer le menu');
      document.body.style.overflow = 'hidden';
    } else {
      closeMenu();
    }
  });

  const header = document.querySelector('.site-header');
  const scrollToSection = (id, smooth) => {
    const target = document.getElementById(id);
    if (!target) return false;
    const sticky = getComputedStyle(header).position === 'sticky';
    const offset = sticky ? header.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    return true;
  };

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && scrollToSection(href.slice(1), true)) {
        event.preventDefault();
        history.replaceState(null, '', href);
      }
      closeMenu();
    });
  });

  const sectionLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    const currentSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!currentSection) return;

    const currentHref = `#${currentSection.target.id}`;
    sectionLinks.forEach((link) => {
      if (link.getAttribute('href') === currentHref) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px' });

  document.querySelectorAll('main .page-section[id]').forEach((section) => {
    sectionObserver.observe(section);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) closeMenu();
  });
});
