/* ===========================
   Kids Kingdom CIC – script.js
   =========================== */

// ========== NAVBAR ==========

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Sticky navbar background on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


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

const galleryImages = [
  { src: 'assets/gallery-arts.jpg', alt: 'Children enjoying arts and crafts' },
  { src: 'assets/gallery-sports.jpg', alt: 'Children playing team sports outdoors' },
  { src: 'assets/gallery-mentoring.jpg', alt: 'Group reading and mentoring session' },
  { src: 'assets/gallery-camp.jpg', alt: 'Summer camp campfire activities' },
  { src: 'assets/gallery-workshop.jpg', alt: "Children's workshop and conference" },
  { src: 'assets/gallery-community.jpg', alt: 'Community service and planting' },
];

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(index) {
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
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

// Create dots
testimonials.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
  dot.addEventListener('click', () => goToTestimonial(i));
  sliderDots.appendChild(dot);
});

function updateTestimonial() {
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

// Initialize first testimonial
updateTestimonial();

// Auto-rotate every 6 seconds
setInterval(nextTestimonial, 6000);


// ========== CONTACT FORM ==========

const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

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


// ========== NEWSLETTER FORM ==========

const newsletterForm = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');

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
