// About Page Scripts

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Add animation to cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.about-card').forEach(card => {
  observer.observe(card);
});

// Button click handlers
document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const btnText = e.target.textContent;
    
    if (btnText.includes('Projects')) {
      // Navigate to projects section or page
      alert('Projects section coming soon!');
    } else if (btnText.includes('Touch')) {
      // Show contact form or open email
      alert('Contact form coming soon!\nYou can reach out via email or social media.');
    }
  });
});

// Add hover effects
document.querySelectorAll('.about-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.3s ease';
  });
});
