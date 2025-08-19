document.addEventListener("DOMContentLoaded", () => {
  initProjectFilters()
  initProjectCardEffects()
})

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter projects
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          card.classList.remove("hidden")
          card.style.display = "block"
        } else {
          card.classList.add("hidden")
          setTimeout(() => {
            if (card.classList.contains("hidden")) {
              card.style.display = "none"
            }
          }, 300)
        }
      })

      // Add stagger animation to visible cards
      const visibleCards = Array.from(projectCards).filter((card) => !card.classList.contains("hidden"))
      visibleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`
        card.classList.add("animate-fade-in-up")
      })
    })
  })
}

// Project card hover effects
function initProjectCardEffects() {
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
    })
  })
}
