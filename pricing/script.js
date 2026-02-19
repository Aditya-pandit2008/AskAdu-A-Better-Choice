// Pricing Page Scripts

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

// Add stagger animation to cards
const allCards = document.querySelectorAll('.factor-card, .included-card, .contact-method, .process-step');
allCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// Button click handlers
document.querySelectorAll('.cta-btn, .tier-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const btnText = e.target.textContent;
    
    if (btnText.includes('Free')) {
      alert('Get started with AskAdu Free!\n\nRedirecting to sign up...');
      // Uncomment to redirect: window.location.href = '../sign up/index.html';
    } else if (btnText.includes('Custom Quote')) {
      alert('Request Custom Quote\n\nThank you for your interest!\n\nContact us:\nPhone: 913021760\nEmail: Aditya6386g@gmail.com');
    }
  });
});

// Scroll animation observer for sections
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

// Observe all sections
document.querySelectorAll('.pricing-section, .pricing-intro, .pricing-cta').forEach(element => {
  observer.observe(element);
});

// Add hover effect to cards
document.querySelectorAll('.factor-card, .included-card, .contact-method, .process-step, .pricing-tier, .note-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.3s ease';
  });
});

// Comparison table hover effect
document.querySelectorAll('.comparison-row').forEach(row => {
  row.addEventListener('mouseenter', function () {
    this.style.transition = 'background 0.3s ease';
  });
});
