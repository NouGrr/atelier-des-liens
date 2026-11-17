document.addEventListener('DOMContentLoaded', () => {
  const mapConsent = document.getElementById('mapConsent');
  const mapLoad = document.getElementById('mapLoad');
  if (mapConsent && mapLoad) {
    mapLoad.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.title = "Carte de localisation de L'Atelier des Liens";
      frame.src = mapConsent.dataset.src;
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      mapConsent.replaceWith(frame);
      const pin = document.querySelector('.map-location');
      if (pin) pin.hidden = false;
    });
  }

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

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
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
