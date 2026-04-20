/* ===========================
   Kids Kingdom CIC – script.js
   =========================== */

// ========== LOADER ==========

const pageLoader = document.getElementById('pageLoader');

if (pageLoader) {
  document.body.classList.add('is-loading');

  const hideLoader = () => {
    window.setTimeout(() => {
      pageLoader.classList.add('hidden');
      document.body.classList.remove('is-loading');
    }, 500);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
}

// ========== NAVBAR ==========

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const scrollTopBtn = document.getElementById('scrollTopBtn');

function updateScrollUi() {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 320);
  }
}

// Sticky navbar background on scroll
if (navbar || scrollTopBtn) {
  window.addEventListener('scroll', () => {
    updateScrollUi();
  });

  updateScrollUi();
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mobile menu toggle
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

// Close mobile menu when a link is clicked
if (mobileMenu && navToggle) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}


// ========== FADE-IN ON SCROLL ==========

const fadeElements = document.querySelectorAll('.fade-in-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));


// ========== ANIMATED COUNTERS ==========

const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCount(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCount(el, target) {
  const duration = 2000; // ms
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + '+';
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


// ========== GALLERY LIGHTBOX ==========

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const allGalleryItems = document.querySelectorAll('.gallery-item');
const galleryImages = Array.from(allGalleryItems).map((item) => {
  const img = item.querySelector('img');
  const label = item.querySelector('.gallery-label span');

  return {
    src: img ? img.getAttribute('src') : '',
    alt: img ? img.getAttribute('alt') || 'Gallery image' : 'Gallery image',
    caption: label ? label.textContent.trim() : '',
  };
});
const eventModal = document.getElementById('eventModal');
const eventModalClose = document.getElementById('eventModalClose');
const eventModalImage = document.getElementById('eventModalImage');
const eventModalBadge = document.getElementById('eventModalBadge');
const eventModalDate = document.getElementById('eventModalDate');
const eventModalTitle = document.getElementById('eventModalTitle');
const eventModalSummary = document.getElementById('eventModalSummary');
const eventModalPurpose = document.getElementById('eventModalPurpose');
const eventModalFocus = document.getElementById('eventModalFocus');
const eventModalClosing = document.getElementById('eventModalClosing');
const eventModalCta = document.getElementById('eventModalCta');
const eventModalList = document.getElementById('eventModalList');
const eventModalOutcomes = document.getElementById('eventModalOutcomes');
const upcomingDetailTriggers = document.querySelectorAll('.upcoming-detail-trigger');
let currentLightboxIndex = 0;

function fillEventModalList(listEl, items) {
  if (!listEl) return;
  listEl.innerHTML = '';
  items.filter(Boolean).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    listEl.appendChild(li);
  });
}

function openEventModal(trigger) {
  if (!eventModal || !trigger) return;

  if (eventModalImage) {
    eventModalImage.src = trigger.dataset.eventImage || '';
    eventModalImage.alt = trigger.dataset.eventImageAlt || 'Event image';
  }
  if (eventModalBadge) eventModalBadge.textContent = trigger.dataset.eventBadge || '';
  if (eventModalDate) eventModalDate.textContent = trigger.dataset.eventDate || '';
  if (eventModalTitle) eventModalTitle.textContent = trigger.dataset.eventTitle || '';
  if (eventModalSummary) eventModalSummary.textContent = trigger.dataset.eventSummary || '';
  if (eventModalPurpose) eventModalPurpose.textContent = trigger.dataset.eventPurpose || '';
  if (eventModalFocus) eventModalFocus.textContent = trigger.dataset.eventFocus || '';
  if (eventModalClosing) eventModalClosing.textContent = trigger.dataset.eventClosing || '';
  if (eventModalCta) eventModalCta.textContent = trigger.dataset.eventCta || '';

  fillEventModalList(eventModalList, (trigger.dataset.eventList || '').split('|'));
  fillEventModalList(eventModalOutcomes, (trigger.dataset.eventOutcomes || '').split('|'));

  eventModal.classList.add('open');
  eventModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeEventModal() {
  if (!eventModal) return;
  eventModal.classList.remove('open');
  eventModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

upcomingDetailTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openEventModal(trigger));
});

if (eventModal) {
  eventModal.querySelectorAll('[data-close-event-modal]').forEach((el) => {
    el.addEventListener('click', closeEventModal);
  });
}

if (eventModalClose) {
  eventModalClose.addEventListener('click', closeEventModal);
}

function openLightbox(index) {
  if (!lightbox || !lightboxImg || !lightboxCaption || !galleryImages[index]) return;
  currentLightboxIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightboxCaption.textContent = galleryImages[index].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function nextLightboxImage() {
  const visibleGalleryItems = Array.from(allGalleryItems).filter(item => !item.classList.contains('hidden'));
  if (visibleGalleryItems.length === 0) return;

  const currentVisibleItem = allGalleryItems[currentLightboxIndex];
  let currentVisibleIndexInFiltered = visibleGalleryItems.indexOf(currentVisibleItem);

  let nextVisibleIndexInFiltered = (currentVisibleIndexInFiltered + 1) % visibleGalleryItems.length;
  let nextItem = visibleGalleryItems[nextVisibleIndexInFiltered];

  let nextOriginalIndex = Array.from(allGalleryItems).indexOf(nextItem);
  openLightbox(nextOriginalIndex);
}

function prevLightboxImage() {
  const visibleGalleryItems = Array.from(allGalleryItems).filter(item => !item.classList.contains('hidden'));
  if (visibleGalleryItems.length === 0) return;

  const currentVisibleItem = allGalleryItems[currentLightboxIndex];
  let currentVisibleIndexInFiltered = visibleGalleryItems.indexOf(currentVisibleItem);

  let prevVisibleIndexInFiltered = (currentVisibleIndexInFiltered - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
  let prevItem = visibleGalleryItems[prevVisibleIndexInFiltered];

  let prevOriginalIndex = Array.from(allGalleryItems).indexOf(prevItem);
  openLightbox(prevOriginalIndex);
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'Escape') closeEventModal();
  if (lightbox && lightbox.classList.contains('open')) {
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
  }
});


// ========== GALLERY FILTERING ==========

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const isVisible = filter === 'all' || category === filter;
      item.classList.toggle('hidden', !isVisible);
    });
  });
});


// ========== TESTIMONIAL SLIDER ==========

const testimonials = [
  {
    text: "Kids Kingdom CIC helped my daughter become more confident and believe in herself. She comes home every week excited to share what she's learned.",
    author: "Sarah M.",
    role: "Parent"
  },
  {
    text: "The after-school programme gave my son a safe place to grow and make friends. It's been transformational for our whole family.",
    author: "David O.",
    role: "Parent"
  },
  {
    text: "The team genuinely cares about every child and family. You can see the passion and love in everything they do.",
    author: "Grace T.",
    role: "Parent & Volunteer"
  }
];

let currentTestimonial = 0;
const testimonialText = document.getElementById('testimonialText');
const testimonialAuthor = document.getElementById('testimonialAuthor');
const testimonialRole = document.getElementById('testimonialRole');
const sliderDots = document.getElementById('sliderDots');

if (testimonialText && testimonialAuthor && testimonialRole && sliderDots) {
  // Create dots
  testimonials.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToTestimonial(i));
    sliderDots.appendChild(dot);
  });
}

function updateTestimonial() {
  if (!testimonialText || !testimonialAuthor || !testimonialRole || !sliderDots) return;
  const t = testimonials[currentTestimonial];
  testimonialText.textContent = `"${t.text}"`;
  testimonialAuthor.textContent = t.author;
  testimonialRole.textContent = t.role;
  sliderDots.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTestimonial);
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  updateTestimonial();
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  updateTestimonial();
}

function goToTestimonial(index) {
  currentTestimonial = index;
  updateTestimonial();
}

if (testimonialText && testimonialAuthor && testimonialRole && sliderDots) {
  // Initialize first testimonial
  updateTestimonial();

  // Auto-rotate every 6 seconds
  setInterval(nextTestimonial, 6000);
}


// ========== CONTACT FORM ==========

const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display = 'none';
    contactSuccess.style.display = 'block';
    setTimeout(() => {
      contactSuccess.style.display = 'none';
      contactForm.style.display = 'flex';
      contactForm.reset();
    }, 3000);
  });
}


// ========== NEWSLETTER FORM ==========

const newsletterForm = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');

if (newsletterForm && newsletterSuccess) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterForm.style.display = 'none';
    newsletterSuccess.style.display = 'block';
    setTimeout(() => {
      newsletterSuccess.style.display = 'none';
      newsletterForm.style.display = 'flex';
      newsletterForm.reset();
    }, 4000);
  });
}
