// Utility functions
const utils = {
  // Smooth scroll to element
  scrollTo: (element, duration = 1000) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = currentTime => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing function
    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  },

  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Add/remove class with transition
  toggleClass: (element, className, duration = 300) => {
    element.classList.add('transitioning');
    element.classList.toggle(className);
    setTimeout(() => element.classList.remove('transitioning'), duration);
  }
};

// Main application
class App {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupThemeToggle();
    this.hideLoaderOnLoad();
  }

  initializeElements() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.navbar a');
    this.sections = document.querySelectorAll('section');
    this.scrollTopBtn = this.createScrollTopButton();
    this.loader = document.querySelector('.loader');
    this.loader = document.querySelector('.loader');
  }


  setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', utils.debounce(() => {
      if (window.scrollY > 50) {
        this.navbar.classList.add('navbar-scrolled');
      } else {
        this.navbar.classList.remove('navbar-scrolled');
      }
    }, 100));

    // Smooth scroll for nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          utils.scrollTo(targetElement);
          this.updateActiveNavLink(link);
        }
      });
    });

    // Scroll to top button
    this.scrollTopBtn.addEventListener('click', () => {
      utils.scrollTo(document.body);
    });

    // Form validation and submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
    });

    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  }

  setupIntersectionObserver() {
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe all sections and elements with .animate class
    this.sections.forEach(section => observer.observe(section));
    document.querySelectorAll('.animate').forEach(el => observer.observe(el));
  }

  setupThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    const themeToggle = this.createThemeToggle();
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Animate theme change
      this.animateThemeChange();
    });
  }

  createScrollTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-top-btn';
    button.innerHTML = '↑';
    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', utils.debounce(() => {
      button.classList.toggle('visible', window.scrollY > 300);
    }, 150));

    return button;
  }
  hideLoaderOnLoad() {
    window.addEventListener('load', () => {
      if (this.loader) {
        this.loader.classList.add('hide');

        // Remove loader from DOM after fade animation
        setTimeout(() => {
          this.loader.style.display = 'none';
        }, 300);
      }
    });
  }

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌓';
    document.body.appendChild(toggle);
    return toggle;
  }

  updateActiveNavLink(activeLink) {
    this.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Show loading state
    this.loader.style.display = 'block';

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      this.showNotification('Form submitted successfully!', 'success');
      form.reset();
    } catch (error) {
      this.showNotification('Error submitting form. Please try again.', 'error');
    } finally {
      this.loader.style.display = 'none';
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate notification
    setTimeout(() => notification.classList.add('visible'), 100);
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  animateThemeChange() {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => overlay.remove(), 500);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});

// Add some basic error handling
window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
  // You might want to send this to your error tracking service
});

// Service Worker registration for PWA support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('ServiceWorker registered'))
      .catch(error => console.error('ServiceWorker registration failed:', error));
}