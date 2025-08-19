document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initNavigation()
  initScrollAnimations()
  initCounterAnimations()
  initSmoothScrolling()
  initParallaxEffects()
  initFormValidation()
  initLazyLoading()
  initFocusManagement()
})

// Navigation functionality
function initNavigation() {
  const navToggle = document.querySelector(".nav-mobile-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active")
      navMenu.classList.toggle("active")
      document.body.classList.toggle("nav-open")
    })
  }

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navToggle.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.classList.remove("nav-open")
      }
    })
  })

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar.style.transform = "translateY(-100%)"
    } else {
      navbar.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })

  // Active link highlighting
  const sections = document.querySelectorAll("section[id]")

  window.addEventListener("scroll", () => {
    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  })
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Trigger counter animation for stats
        if (entry.target.classList.contains("stat-item")) {
          window.animateCounter(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe elements for scroll animations
  const animateElements = document.querySelectorAll(
    ".fade-in-on-scroll, .slide-in-left-on-scroll, .slide-in-right-on-scroll, .scale-in-on-scroll, .stat-item",
  )

  animateElements.forEach((element) => {
    observer.observe(element)
  })
}

// Counter animations for stats
function initCounterAnimations() {
  function animateCounter(element) {
    const numberElement = element.querySelector(".stat-number")
    if (!numberElement || numberElement.classList.contains("animated")) return

    const finalNumber = numberElement.textContent
    const numericValue = Number.parseInt(finalNumber.replace(/\D/g, ""))
    const suffix = finalNumber.replace(/\d/g, "")

    let currentNumber = 0
    const increment = numericValue / 60 // 60 frames for smooth animation

    const timer = setInterval(() => {
      currentNumber += increment
      if (currentNumber >= numericValue) {
        currentNumber = numericValue
        clearInterval(timer)
        numberElement.classList.add("animated")
      }
      numberElement.textContent = Math.floor(currentNumber) + suffix
    }, 16) // ~60fps
  }

  // Make animateCounter available globally
  window.animateCounter = animateCounter
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80 // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Parallax effects
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".parallax")

  if (parallaxElements.length === 0) return

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5

    parallaxElements.forEach((element) => {
      element.style.transform = `translateY(${rate}px)`
    })
  })
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const data = Object.fromEntries(formData)

      // Basic validation
      if (!validateForm(data)) {
        return
      }

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent
      submitButton.textContent = "Sending..."
      submitButton.disabled = true

      // Simulate form submission
      setTimeout(() => {
        showSuccessMessage()
        form.reset()
        submitButton.textContent = originalText
        submitButton.disabled = false
      }, 2000)
    })
  })
}

// Form validation helper
function validateForm(data) {
  const errors = []

  // Required fields validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long")
  }

  if (errors.length > 0) {
    showErrorMessages(errors)
    return false
  }

  return true
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Show error messages
function showErrorMessages(errors) {
  // Remove existing error messages
  const existingErrors = document.querySelectorAll(".error-message")
  existingErrors.forEach((error) => error.remove())

  // Create error container
  const errorContainer = document.createElement("div")
  errorContainer.className = "error-message"
  errorContainer.style.cssText = `
        background-color: #fee;
        border: 1px solid #fcc;
        color: #c33;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    `

  const errorList = document.createElement("ul")
  errorList.style.margin = "0"
  errorList.style.paddingLeft = "1.5rem"

  errors.forEach((error) => {
    const errorItem = document.createElement("li")
    errorItem.textContent = error
    errorList.appendChild(errorItem)
  })

  errorContainer.appendChild(errorList)

  // Insert error container before the form
  const form = document.querySelector("form")
  if (form) {
    form.parentNode.insertBefore(errorContainer, form)

    // Scroll to error message
    errorContainer.scrollIntoView({ behavior: "smooth", block: "center" })

    // Remove error message after 5 seconds
    setTimeout(() => {
      errorContainer.remove()
    }, 5000)
  }
}

// Show success message
function showSuccessMessage() {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".success-message, .error-message")
  existingMessages.forEach((message) => message.remove())

  // Create success container
  const successContainer = document.createElement("div")
  successContainer.className = "success-message"
  successContainer.style.cssText = `
        background-color: #efe;
        border: 1px solid #cfc;
        color: #363;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
    `

  successContainer.innerHTML = `
        <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you within 24 hours.
    `

  // Insert success container before the form
  const form = document.querySelector("form")
  if (form) {
    form.parentNode.insertBefore(successContainer, form)

    // Scroll to success message
    successContainer.scrollIntoView({ behavior: "smooth", block: "center" })

    // Remove success message after 5 seconds
    setTimeout(() => {
      successContainer.remove()
    }, 5000)
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Image lazy loading
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Performance optimization
window.addEventListener("load", () => {
  // Remove loading class from body
  document.body.classList.remove("loading")

  // Initialize performance-heavy features after load
  initParallaxEffects()
})

// Handle resize events
window.addEventListener(
  "resize",
  debounce(() => {
    // Recalculate any size-dependent features
    const navbar = document.querySelector(".navbar")
    if (window.innerWidth > 768) {
      navbar.classList.remove("mobile-open")
    }
  }, 250),
)

// Accessibility improvements
document.addEventListener("keydown", (e) => {
  // Close mobile menu on Escape key
  if (e.key === "Escape") {
    const navMenu = document.querySelector(".nav-menu")
    const navToggle = document.querySelector(".nav-mobile-toggle")

    if (navMenu && navMenu.classList.contains("active")) {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.classList.remove("nav-open")
    }
  }
})

// Focus management for accessibility
function initFocusManagement() {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusable = Array.from(document.querySelectorAll(focusableElements))
      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }
  })
}
