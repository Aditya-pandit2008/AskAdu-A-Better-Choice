// Features Page Scripts

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

// Add stagger animation to feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// Button click handlers
document.querySelector('.feedback-btn')?.addEventListener('click', () => {
  alert('Thank you for your interest!\n\nFeedback form coming soon!\nYou can reach out via email or social media.');
});

document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const btnText = e.target.textContent;
    
    if (btnText.includes('Started')) {
      alert('Get started with FluxAI now!\nRedirecting to sign up...');
      // Uncomment to redirect: window.location.href = '../sign up/index.html';
    } else if (btnText.includes('Learn')) {
      alert('Learn more about FluxAI features!');
    }
  });
});

// Scroll animation observer for cards
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

// Observe all feature cards and sections
document.querySelectorAll('.feature-card, .pro-tip-section, .comparison-section, .features-cta').forEach(element => {
  observer.observe(element);
});

// Add hover effect to comparison rows
document.querySelectorAll('.comparison-row').forEach(row => {
  row.addEventListener('mouseenter', function () {
    this.style.transition = 'background 0.3s ease';
  });
});
