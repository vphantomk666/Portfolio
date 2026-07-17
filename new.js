document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------
     Smooth in-page scrolling for ALL nav / anchor links
     Ensures clicking any nav item scrolls the SAME page,
     never opens a new tab or reloads.
  --------------------------------------------- */
  const allLinks = document.querySelectorAll('a[data-link], a.nav__link, a.link-arrow');
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      // close mobile menu if open
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');

      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);
      window.scrollTo({ top, behavior: 'smooth' });

      // update active state immediately for snappier feel
      setActiveLink(href);
    });
  });

  /* ---------------------------------------------
     Navbar: scrolled state + active link on scroll
  --------------------------------------------- */
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const toTop = document.getElementById('toTop');
  const sections = document.querySelectorAll('main .section[id], main section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  function setActiveLink(hash){
    navLinkEls.forEach(l => l.classList.toggle('active', l.getAttribute('href') === hash));
  }

  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 30);

    // Back to top button
    toTop.classList.toggle('visible', window.scrollY > 600);

    // Active section detection
    let current = 'home';
    const offset = nav.offsetHeight + 40;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) {
        current = sec.id;
      }
    });
    setActiveLink('#' + current);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------
     Mobile hamburger menu
  --------------------------------------------- */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* ---------------------------------------------
     Theme toggle (dark / light)
  --------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const moonPath = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  const sunPath = `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>`;

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeIcon.innerHTML = isLight ? moonPath : sunPath;
  });

  /* ---------------------------------------------
     Tech stack tabs
  --------------------------------------------- */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  /* ---------------------------------------------
     Animate skill bars when in view
  --------------------------------------------- */
  const skills = document.querySelectorAll('.skill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill__fill');
        fill.style.width = entry.target.dataset.value + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skills.forEach(s => skillObserver.observe(s));

  /* ---------------------------------------------
     Fade / rise in on scroll for cards & sections
  --------------------------------------------- */
  const revealTargets = document.querySelectorAll('.card, .project-card, .timeline__item, .contact-card, .stat-pill');
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------
     Projects carousel (simple scroll-by button)
  --------------------------------------------- */
  const track = document.getElementById('projectsTrack');
  const nextBtn = document.getElementById('carouselNext');
  let scrollIndex = 0;
  if (nextBtn && track) {
    nextBtn.addEventListener('click', () => {
      const card = track.querySelector('.project-card');
      if (!card) return;
      const cardWidth = card.offsetWidth + 24;
      const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
      scrollIndex += cardWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        scrollIndex = 0;
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollTo({ left: scrollIndex, behavior: 'smooth' });
      }
    });
  }

  /* ---------------------------------------------
     Contact form (front-end only demo submission)
  --------------------------------------------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          message: document.getElementById("message").value,
          time: new Date().toLocaleString()
        }
      )
      .then(function () {
        if (note) note.textContent = "Message sent successfully!";
        form.reset();
      })
      .catch(function (error) {
        console.error(error);
        if (note) note.textContent = "Failed to send message.";
      });
    });
  }


 /* ---------------------------------------------
   My Certificates Slider + Lightbox
--------------------------------------------- */

(function () {

    const frame = document.getElementById("mcFrame");
    const certTrack = document.getElementById("mcTrack");
    const slides = [...document.querySelectorAll(".mc-slide")];

    const prevBtn = document.getElementById("mcPrev");
    const nextBtn = document.getElementById("mcNext");

    const dotsContainer = document.getElementById("mcDots");
    const caption = document.getElementById("mcCaption");

    const lightbox = document.getElementById("mcLightbox");
    const lightboxImg = document.getElementById("mcLightboxImg");
    const lightboxCaption = document.getElementById("mcLightboxCaption");
    const lightboxClose = document.getElementById("mcLightboxClose");

    if (
        !frame ||
        !certTrack ||
        slides.length === 0 ||
        !prevBtn ||
        !nextBtn ||
        !dotsContainer
    ) return;

    let current = 0;

    /* ------------------------
        Create Dots
    ------------------------ */

    slides.forEach((slide, i) => {

        const dot = document.createElement("button");

        dot.className = "mc-dot";

        if (i === 0)
            dot.classList.add("active");

        dot.addEventListener("click", () => {

            current = i;

            updateSlider();

        });

        dotsContainer.appendChild(dot);

    });

    const dots = [...document.querySelectorAll(".mc-dot")];



    /* ------------------------
        Update Slider
    ------------------------ */

    function updateSlider() {

        certTrack.style.transform = `translateX(-${current * 100}%)`;

        dots.forEach((dot, i) => {

            dot.classList.toggle("active", i === current);

        });

        const title = slides[current].dataset.title || "";

        if (caption)
            caption.textContent = title;

        if (lightbox.classList.contains("open")) {

            const img = slides[current].querySelector("img");

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = title;

        }

    }



    /* ------------------------
        Buttons
    ------------------------ */

    nextBtn.addEventListener("click", () => {

        current++;

        if (current >= slides.length)
            current = 0;

        updateSlider();

    });

    prevBtn.addEventListener("click", () => {

        current--;

        if (current < 0)
            current = slides.length - 1;

        updateSlider();

    });



    /* ------------------------
        Open Lightbox
    ------------------------ */

    slides.forEach((slide, index) => {

        slide.addEventListener("click", () => {

            current = index;

            const img = slide.querySelector("img");

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;

            lightboxCaption.textContent =
                slide.dataset.title || "";

            lightbox.classList.add("open");

            lightbox.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            updateSlider();

        });

    });



    /* ------------------------
        Close Lightbox
    ------------------------ */

    function closeLightbox() {

        lightbox.classList.remove("open");

        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

    }

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox)
            closeLightbox();

    });



    /* ------------------------
        Keyboard
    ------------------------ */

    document.addEventListener("keydown", (e) => {

        if (lightbox.classList.contains("open")) {

            if (e.key === "Escape")
                closeLightbox();

            if (e.key === "ArrowRight") {

                nextBtn.click();

            }

            if (e.key === "ArrowLeft") {

                prevBtn.click();

            }

        }

    });



    /* ------------------------
        Swipe Support
    ------------------------ */

    let startX = 0;

    frame.addEventListener("touchstart", (e) => {

        startX = e.touches[0].clientX;

    }, { passive: true });

    frame.addEventListener("touchend", (e) => {

        let endX = e.changedTouches[0].clientX;

        let diff = startX - endX;

        if (Math.abs(diff) < 40)
            return;

        if (diff > 0)
            nextBtn.click();

        else
            prevBtn.click();

    }, { passive: true });



    /* ------------------------
        Initial State
    ------------------------ */

    updateSlider();

})();
});