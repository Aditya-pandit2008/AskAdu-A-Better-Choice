// Business Page Scripts

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
const allCards = document.querySelectorAll('.use-case-card, .integration-item, .benefit-card, .partnership-card');
allCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// Button click handlers
document.querySelectorAll('.cta-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const btnText = e.target.textContent;
    
    if (btnText.includes('Touch')) {
      alert('Business Inquiry Form\n\nWe will get back to you soon!\n\nPhone: 913021760\nEmail: Aditya6386g@gmail.com');
    } else if (btnText.includes('Demo')) {
      alert('Request Demo\n\nThank you for your interest!\n\nOur team will contact you shortly to schedule a demo.\n\nEmail: Aditya6386g@gmail.com');
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
document.querySelectorAll('.business-section, .business-intro, .business-cta').forEach(element => {
  observer.observe(element);
});

// Add hover effect to cards
document.querySelectorAll('.use-case-card, .integration-item, .benefit-card, .partnership-card, .contact-card, .disclaimer-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.3s ease';
  });
});
