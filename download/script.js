// Download page interactions

document.querySelector('.cta-btn.primary')?.addEventListener('click', () => {
  alert('Thanks! We will notify you when the app is available.');
});

// Simple observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card, .dev-card, .notify-card, .short-card').forEach(el => observer.observe(el));
