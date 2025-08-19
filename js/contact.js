document.addEventListener("DOMContentLoaded", () => {
  initContactForm()
})

function initContactForm() {
  const form = document.getElementById("contact-form")
  const formSuccess = document.getElementById("form-success")
  const sendAnotherBtn = document.getElementById("send-another")
  const submitBtn = document.getElementById("submit-btn")

  if (!form) return

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Clear previous errors
    clearFormErrors()

    // Get form data
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Validate form
    const errors = validateContactForm(data)
    if (errors.length > 0) {
      showFormErrors(errors)
      return
    }

    // Show loading state
    setSubmitButtonLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      form.style.display = "none"
      formSuccess.classList.remove("hidden")

      // Reset form
      form.reset()
    } catch (error) {
      showFormErrors(["An error occurred. Please try again."])
    } finally {
      setSubmitButtonLoading(false)
    }
  })

  // Handle "Send Another Message" button
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener("click", () => {
      formSuccess.classList.add("hidden")
      form.style.display = "block"
      clearFormErrors()
    })
  }
}

function validateContactForm(data) {
  const errors = []

  // Required fields validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.projectType) {
    errors.push("Please select a project type")
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long")
  }

  // Phone validation (if provided)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push("Please enter a valid phone number")
  }

  return errors
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-$$$$+]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

function showFormErrors(errors) {
  // Remove existing error messages
  const existingErrors = document.querySelectorAll(".error-message")
  existingErrors.forEach((error) => error.remove())

  // Create error container
  const errorContainer = document.createElement("div")
  errorContainer.className = "error-message"

  if (errors.length === 1) {
    errorContainer.textContent = errors[0]
  } else {
    const errorList = document.createElement("ul")
    errorList.style.margin = "0"
    errorList.style.paddingLeft = "1.5rem"

    errors.forEach((error) => {
      const errorItem = document.createElement("li")
      errorItem.textContent = error
      errorList.appendChild(errorItem)
    })

    errorContainer.appendChild(errorList)
  }

  // Insert error container before the form
  const form = document.getElementById("contact-form")
  form.parentNode.insertBefore(errorContainer, form)

  // Scroll to error message
  errorContainer.scrollIntoView({ behavior: "smooth", block: "center" })

  // Remove error message after 5 seconds
  setTimeout(() => {
    errorContainer.remove()
  }, 5000)
}

function clearFormErrors() {
  const errorMessages = document.querySelectorAll(".error-message")
  errorMessages.forEach((error) => error.remove())

  // Remove error classes from inputs
  const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")
  inputs.forEach((input) => input.classList.remove("error"))
}

function setSubmitButtonLoading(loading) {
  const submitBtn = document.getElementById("submit-btn")
  const btnText = submitBtn.querySelector(".btn-text")

  if (loading) {
    submitBtn.disabled = true
    submitBtn.classList.add("loading")
    btnText.textContent = "Sending"
  } else {
    submitBtn.disabled = false
    submitBtn.classList.remove("loading")
    btnText.textContent = "Send Message"
  }
}

// Real-time form validation
function initRealTimeValidation() {
  const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")

  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateField(input)
    })

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        validateField(input)
      }
    })
  })
}

function validateField(field) {
  const value = field.value.trim()
  let isValid = true

  // Clear previous error state
  field.classList.remove("error")

  switch (field.name) {
    case "name":
      isValid = value.length >= 2
      break
    case "email":
      isValid = isValidEmail(value)
      break
    case "phone":
      isValid = !value || isValidPhone(value)
      break
    case "projectType":
      isValid = value !== ""
      break
    case "message":
      isValid = value.length >= 10
      break
  }

  if (!isValid) {
    field.classList.add("error")
  }

  return isValid
}

// Initialize real-time validation
initRealTimeValidation()
