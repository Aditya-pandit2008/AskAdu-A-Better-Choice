// Learn Page Scripts

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
const allCards = document.querySelectorAll('.topic-card, .guide-card, .practice-item, .guideline-card');
allCards.forEach((card, index) => {
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
      alert('Get started with AskAdu learning now!\nRedirecting to sign up...');
      // Uncomment to redirect: window.location.href = '../sign up/index.html';
    } else if (btnText.includes('Learn')) {
      alert('Learn more about AskAdu learning features!');
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
document.querySelectorAll('.learn-section, .learning-intro, .learn-cta').forEach(element => {
  observer.observe(element);
});

// Add hover effect to topic cards
document.querySelectorAll('.topic-card, .guide-card, .practice-item, .guideline-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.3s ease';
  });
});
