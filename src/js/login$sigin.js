document.addEventListener("DOMContentLoaded", function () {
  // العناصر الأساسية
  const signUpBtn = document.getElementById("sign-up");
  const signInBtn = document.getElementById("sign-in");
  const signInForm = document.getElementById("sign-in-form");
  const signUpForm = document.getElementById("sign-up-form");
  const recoverForm = document.getElementById("recover-password-form");
  const emailCodeForm = document.getElementById("email-code-form");
  const resetPasswordForm = document.getElementById("Reset-Password-form");
  const successfullypasswordform = document.getElementById(
    "successfully-password-form"
  );
  const expiredtimer = document.getElementById("expired-timer");
  const forgotBtn = document.getElementById("forgot");
  const loader = document.getElementById("loader");
  const authImage = document.getElementById("auth-image");
  const emailInputrecover = document.getElementById("yourEmailrecover");
  const sendLinkBtn = document.getElementById("send-link-btn");

  // حالات التطبيق
  const APP_STATES = {
    SIGN_IN: "sign-in",
    SIGN_UP: "sign-up",
    RECOVER_PASSWORD: "recover-password",
    EMAIL_CODE: "email-code",
    RESET_PASSWORD: "reset-password",
    SUCCESS: "success",
  };

  // الصور المقترنة بكل حالة
  const STATE_IMAGES = {
    [APP_STATES.SIGN_IN]: "images/img-sign-in.png",
    [APP_STATES.SIGN_UP]: "images/img-sign-in.png",
    [APP_STATES.RECOVER_PASSWORD]: "images/img-sign-up.png",
    [APP_STATES.EMAIL_CODE]: "images/email-code.png",
    [APP_STATES.RESET_PASSWORD]: "images/reset-password.png",
    [APP_STATES.SUCCESS]: "images/successfully-password.png",
  };

  // حفظ الحالة الحالية
  function saveState(state, data = {}) {
    const stateData = {
      currentState: state,
      timestamp: Date.now(),
      ...data,
    };
    sessionStorage.setItem("authState", JSON.stringify(stateData));
  }

  // استرداد الحالة المحفوظة
  function getSavedState() {
    try {
      const saved = sessionStorage.getItem("authState");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error parsing saved state:", error);
      return null;
    }
  }

  // مسح الحالة المحفوظة
  function clearState() {
    sessionStorage.removeItem("authState");
    sessionStorage.removeItem("timerData");
  }

  // إخفاء جميع النماذج
  function hideAllForms() {
    const forms = [
      signInForm,
      signUpForm,
      recoverForm,
      emailCodeForm,
      resetPasswordForm,
      successfullypasswordform,
    ];
    forms.forEach((form) => {
      if (form) form.classList.add("hidden");
    });
    if (expiredtimer) expiredtimer.classList.add("hidden");
  }

  // عرض نموذج معين
  function showForm(state) {
    hideAllForms();

    switch (state) {
      case APP_STATES.SIGN_IN:
        if (signInForm) signInForm.classList.remove("hidden");
        break;
      case APP_STATES.SIGN_UP:
        if (signUpForm) signUpForm.classList.remove("hidden");
        break;
      case APP_STATES.RECOVER_PASSWORD:
        if (recoverForm) recoverForm.classList.remove("hidden");
        break;
      case APP_STATES.EMAIL_CODE:
        if (emailCodeForm) emailCodeForm.classList.remove("hidden");
        break;
      case APP_STATES.RESET_PASSWORD:
        if (resetPasswordForm) resetPasswordForm.classList.remove("hidden");
        break;
      case APP_STATES.SUCCESS:
        if (successfullypasswordform)
          successfullypasswordform.classList.remove("hidden");
        break;
      default:
        if (signInForm) signInForm.classList.remove("hidden");
    }
  }

  // تغيير الصورة مع تأثير الانتقال
  function changeImageWithFade(src) {
    if (!authImage) return;

    authImage.classList.add("fade-out");
    setTimeout(() => {
      authImage.src = src;
      authImage.classList.remove("fade-out");
      authImage.classList.add("fade-in");
      setTimeout(() => {
        authImage.classList.remove("fade-in");
      }, 300);
    }, 300);
  }

  // عرض اللودر ثم تنفيذ الوظيفة
  function showLoaderThen(callback) {
    if (loader) loader.classList.remove("hidden");
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
      callback();
    }, 1000);
  }

  // تغيير الحالة الرئيسية
  function changeState(newState, additionalData = {}) {
    saveState(newState, additionalData);
    showForm(newState);
    changeImageWithFade(STATE_IMAGES[newState]);
  }

  // استعادة الحالة عند تحميل الصفحة
  function restoreState() {
    const savedState = getSavedState();

    if (savedState && savedState.currentState) {
      const { currentState } = savedState;

      // استعادة التايمر إذا كان في حالة EMAIL_CODE
      if (currentState === APP_STATES.EMAIL_CODE) {
        restoreTimer();
      }

      // استعادة قيم الحقول إذا كانت محفوظة
      if (savedState.email && emailInputrecover) {
        emailInputrecover.value = savedState.email;
        updateSendLinkButton();
      }

      if (savedState.verificationCode) {
        const verificationInput = document.getElementById("VerificationCode");
        if (verificationInput)
          verificationInput.value = savedState.verificationCode;
      }

      showForm(currentState);
      changeImageWithFade(STATE_IMAGES[currentState]);
    } else {
      // الحالة الافتراضية
      changeState(APP_STATES.SIGN_IN);
    }
  }

  // حفظ وإستعادة التايمر
  function saveTimer(countdown, startTime) {
    const timerData = {
      countdown,
      startTime,
      timestamp: Date.now(),
    };
    sessionStorage.setItem("timerData", JSON.stringify(timerData));
  }

  function restoreTimer() {
    try {
      const timerData = JSON.parse(sessionStorage.getItem("timerData"));
      if (!timerData) return;

      const elapsed = Math.floor((Date.now() - timerData.timestamp) / 1000);
      const remainingTime = timerData.countdown - elapsed;

      if (remainingTime > 0) {
        startCountdown(remainingTime);
      } else {
        showExpiredTimer();
      }
    } catch (error) {
      console.error("Error restoring timer:", error);
    }
  }

  function startCountdown(initialCount = 30) {
    const spanElement = document.getElementById("span-timer");
    const timertitle = document.getElementById("timer-title");

    if (!spanElement || !timertitle) return;

    let countdown = initialCount;
    if (spanElement) spanElement.textContent = countdown;
    if (timertitle) timertitle.classList.remove("hidden");

    saveTimer(countdown, Date.now());

    const interval = setInterval(() => {
      countdown--;
      if (spanElement) spanElement.textContent = countdown;
      saveTimer(countdown, Date.now());

      if (countdown <= 0) {
        clearInterval(interval);
        if (timertitle) timertitle.classList.add("hidden");
        showExpiredTimer();
      }
    }, 1000);

    // إخفاء expired timer وإظهاره بعد انتهاء الوقت
    if (expiredtimer) expiredtimer.classList.add("hidden");
    setTimeout(() => {
      if (countdown <= 0 && expiredtimer) {
        expiredtimer.classList.remove("hidden");
      }
    }, countdown * 1000);
  }

  function showExpiredTimer() {
    if (expiredtimer) expiredtimer.classList.remove("hidden");
    sessionStorage.removeItem("timerData");
  }

  // تحديث حالة زر إرسال الرابط
  function updateSendLinkButton() {
    if (!emailInputrecover || !sendLinkBtn) return;

    const emailValue = emailInputrecover.value.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    sendLinkBtn.disabled = !isValidEmail;
    sendLinkBtn.classList.toggle("opacity-50", !isValidEmail);
    sendLinkBtn.classList.toggle("cursor-not-allowed", !isValidEmail);
  }

  // Event Listeners للأزرار الرئيسية
  signUpBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoaderThen(() => {
      changeState(APP_STATES.SIGN_UP);
    });
  });

  signInBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoaderThen(() => {
      changeState(APP_STATES.SIGN_IN);
    });
  });

  forgotBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoaderThen(() => {
      changeState(APP_STATES.RECOVER_PASSWORD);
    });
  });

  // منع الإرسال التلقائي للفورم
  recoverForm?.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // التحقق من صحة الإيميل
  emailInputrecover?.addEventListener("input", () => {
    updateSendLinkButton();
    // حفظ الإيميل أثناء الكتابة
    const savedState = getSavedState() || {};
    saveState(savedState.currentState || APP_STATES.RECOVER_PASSWORD, {
      ...savedState,
      email: emailInputrecover.value.trim(),
    });
  });

  // إرسال رابط استعادة كلمة المرور
  sendLinkBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const emailValue = emailInputrecover.value.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (isValidEmail) {
      showLoaderThen(() => {
        changeState(APP_STATES.EMAIL_CODE, { email: emailValue });
        startCountdown(30);
      });
    }
  });

  // إعادة إرسال الكود
  const timerSentcodeagintitle = document.getElementById("Sent-code-agin");
  timerSentcodeagintitle?.addEventListener("click", (e) => {
    e.preventDefault();
    showLoaderThen(() => {
      if (expiredtimer) expiredtimer.classList.add("hidden");
      startCountdown(30);
    });
  });

  // التحقق من رمز التحقق
  const verificationBtn = document.getElementById("Verification-code");
  const verificationInput = document.getElementById("VerificationCode");

  // حفظ كود التحقق أثناء الكتابة
  verificationInput?.addEventListener("input", () => {
    const savedState = getSavedState() || {};
    saveState(savedState.currentState || APP_STATES.EMAIL_CODE, {
      ...savedState,
      verificationCode: verificationInput.value.trim(),
    });
  });

  verificationBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const code = verificationInput.value.trim();
    const isValidCode = /^\d{6}$/.test(code);

    if (!code) {
      alert("Please enter the verification code.");
    } else if (!isValidCode) {
      alert("The verification code must be exactly 6 digits.");
    } else {
      changeState(APP_STATES.RESET_PASSWORD, { verificationCode: code });
    }
  });

  // عناصر إعادة تعيين كلمة المرور
  const passwordInput = document.getElementById("Newpassword");
  const confirmPasswordInput = document.getElementById("ConfirmNewpassword");
  const toggleBtn = document.getElementById("toggle-password");
  const ConfirmtoggleBtn = document.getElementById("Confirm-toggle-password");
  const eyeOpen = document.getElementById("eye-open");
  const eyeOpentwo = document.getElementById("eye-open-two");
  const eyeClosed = document.getElementById("eye-closed");
  const eyeClosedtwo = document.getElementById("eye-closed-two");

  // إظهار/إخفاء كلمة المرور الجديدة
  toggleBtn?.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    if (eyeOpen) eyeOpen.classList.toggle("hidden", !isHidden);
    if (eyeClosed) eyeClosed.classList.toggle("hidden", isHidden);
  });

  // إظهار/إخفاء تأكيد كلمة المرور
  ConfirmtoggleBtn?.addEventListener("click", () => {
    const isHidden = confirmPasswordInput.type === "password";
    confirmPasswordInput.type = isHidden ? "text" : "password";
    if (eyeOpentwo) eyeOpentwo.classList.toggle("hidden", !isHidden);
    if (eyeClosedtwo) eyeClosedtwo.classList.toggle("hidden", isHidden);
  });

  // متطلبات كلمة المرور
  const requirements = {
    number: /\d/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    special: /[^A-Za-z0-9]/,
    length: /.{8,}/,
  };

  const updateValidationUI = (isValid, rule) => {
    const item = document.querySelector(
      `.validation-item[data-rule="${rule}"] .check-circle`
    );
    if (item) {
      item.classList.remove("bg-zinc-500", "bg-green-700");
      item.classList.add(isValid ? "bg-button-red" : "bg-zinc-500");
    }
  };

  const validatePassword = (password) => {
    let isAllValid = true;
    for (const rule in requirements) {
      const isValid = requirements[rule].test(password);
      updateValidationUI(isValid, rule);
      if (!isValid) isAllValid = false;
    }
    return isAllValid;
  };

  passwordInput?.addEventListener("input", () => {
    const password = passwordInput.value;
    validatePassword(password);
  });

  // إرسال نموذج إعادة تعيين كلمة المرور
  const form = document.querySelector("form.form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const isValid = validatePassword(password);

    if (!isValid) {
      alert("Please meet all password requirements.");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      showLoaderThen(() => {
        changeState(APP_STATES.SUCCESS);
      });
    }
  });

  // زر العودة للتسجيل بعد نجاح إعادة التعيين
  const login = document.getElementById("login");
  login?.addEventListener("click", (e) => {
    e.preventDefault();
    clearState(); // مسح جميع البيانات المحفوظة
    showLoaderThen(() => {
      changeState(APP_STATES.SIGN_IN);
    });
  });

  // معالجة إغلاق النافذة/التاب
  window.addEventListener("beforeunload", () => {
    // يمكن إضافة تنبيه للمستخدم هنا إذا كان في منتصف عملية
    const savedState = getSavedState();
    if (savedState && savedState.currentState !== APP_STATES.SIGN_IN) {
      // حفظ الحالة قبل الإغلاق
      saveState(savedState.currentState, savedState);
    }
  });

  // معالجة الرجوع بالمتصفح (اختياري)
  window.addEventListener("popstate", (e) => {
    // يمكن التحكم في سلوك الرجوع هنا
    if (e.state && e.state.authState) {
      const { authState } = e.state;
      showForm(authState);
      changeImageWithFade(STATE_IMAGES[authState]);
    }
  });

  // تشغيل استعادة الحالة عند تحميل الصفحة
  restoreState();
});

// Project data
const projects = [
  {
    id: 1,
    title: "Manar Al-Haramain",
    description:
      "It is a destination for millions of people worldwide, as the Manar Al-Haramain community is located in the",
    location: "Riyadh",
    area: "5389269 m²",
    numbers: ["3", "4"],
    background:
      "https://api.builder.io/api/v1/image/assets/TEMP/f4a94f3797f61b7dbe7772707c389aa90eb59def?width=3088",
    images: [
      {
        thumb:
          "https://api.builder.io/api/v1/image/assets/TEMP/a85b5e428d1804650836ef38a123983512b86bea?width=722",
        bg: "https://api.builder.io/api/v1/image/assets/TEMP/f4a94f3797f61b7dbe7772707c389aa90eb59def?width=3088",
      },
      {
        thumb:
          "https://api.builder.io/api/v1/image/assets/TEMP/819270aa322c56420eeb26cbe37bf560d4ee3afa?width=722",
        bg: "https://api.builder.io/api/v1/image/assets/TEMP/446a11d7c36624223217d6d96c047c6c4476aa28?width=3074",
      },
    ],
  },
  {
    id: 2,
    title: "Al-Noor Gardens",
    description:
      "A luxurious residential complex featuring modern architecture and sustainable living solutions in the heart of",
    location: "Jeddah",
    area: "3245890 m²",
    numbers: ["2", "8"],
    background:
      "https://api.builder.io/api/v1/image/assets/TEMP/446a11d7c36624223217d6d96c047c6c4476aa28?width=3074",
    images: [
      {
        thumb:
          "https://api.builder.io/api/v1/image/assets/TEMP/819270aa322c56420eeb26cbe37bf560d4ee3afa?width=722",
        bg: "https://api.builder.io/api/v1/image/assets/TEMP/446a11d7c36624223217d6d96c047c6c4476aa28?width=3074",
      },
      {
        thumb:
          "https://api.builder.io/api/v1/image/assets/TEMP/a85b5e428d1804650836ef38a123983512b86bea?width=722",
        bg: "https://api.builder.io/api/v1/image/assets/TEMP/f4a94f3797f61b7dbe7772707c389aa90eb59def?width=3088",
      },
    ],
  },
  {
    id: 3,
    title: "Urban Vista",
    description:
      "Contemporary mixed-use development combining residential, commercial, and recreational spaces in a vibrant",
    location: "Dammam",
    area: "7123456 m²",
    numbers: ["5", "2"],
    background:
      "https://api.builder.io/api/v1/image/assets/TEMP/f4a94f3797f61b7dbe7772707c389aa90eb59def?width=3088",
    images: [
      {
        thumb:
          "https://api.builder.io/api/v1/image/assets/TEMP/a85b5e428d1804650836ef38a123983512b86bea?width=722",
        bg: "https://api.builder.io/api/v1/image/assets/TEMP/f4a94f3797f61b7dbe7772707c389aa90eb59def?width=3088",
      },
      {
        thumb:
          "https://api.builder.io/api/v1/image/assets/TEMP/819270aa322c56420eeb26cbe37bf560d4ee3afa?width=722",
        bg: "https://api.builder.io/api/v1/image/assets/TEMP/446a11d7c36624223217d6d96c047c6c4476aa28?width=3074",
      },
    ],
  },
];

let currentProjectIndex = 0;
let isTransitioning = false;

// DOM Elements
const backgroundContainer = document.getElementById("backgroundContainer");
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
const locationInfo = document.getElementById("locationInfo");
const areaInfo = document.getElementById("areaInfo");
const projectNumbers = document.getElementById("projectNumbers");
const projectImages = document.getElementById("projectImages");
const nextProjectBtn = document.getElementById("nextProjectBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const mainContent = document.getElementById("mainContent");

// Initialize the page
function init() {
  updateBackground(projects[currentProjectIndex].background);
  setupEventListeners();

  // Add scroll effect to header
  window.addEventListener("scroll", handleHeaderScroll);
}

// Setup event listeners
function setupEventListeners() {
  // Project image click events
  const imageElements = document.querySelectorAll(".project-image");
  imageElements.forEach((img, index) => {
    img.addEventListener("click", () => handleImageClick(img, index));
  });

  // Next project button
  nextProjectBtn.addEventListener("click", handleNextProject);
}

// Handle image click
function handleImageClick(clickedImg, index) {
  if (isTransitioning) return;

  // Remove active class from all images
  document.querySelectorAll(".project-image").forEach((img) => {
    img.classList.remove("active");
  });

  // Add active class to clicked image
  clickedImg.classList.add("active");

  // Get background from data attribute
  const newBackground = clickedImg.getAttribute("data-bg");
  if (newBackground) {
    updateBackground(newBackground);
  }
}

// Handle next project
function handleNextProject() {
  if (isTransitioning) return;

  isTransitioning = true;

  // Show loading indicator
  loadingIndicator.style.opacity = "1";

  // Fade out content
  mainContent.classList.add("content-fade-out");
  projectNumbers.classList.add("content-fade-out");
  locationInfo.classList.add("content-fade-out");
  areaInfo.classList.add("content-fade-out");

  setTimeout(() => {
    // Move to next project
    currentProjectIndex = (currentProjectIndex + 1) % projects.length;
    const currentProject = projects[currentProjectIndex];

    // Update content
    updateProjectContent(currentProject);
    updateBackground(currentProject.background);
    updateProjectImages(currentProject.images);

    // Fade in content
    setTimeout(() => {
      mainContent.classList.remove("content-fade-out");
      mainContent.classList.add("content-fade-in");
      projectNumbers.classList.remove("content-fade-out");
      projectNumbers.classList.add("content-fade-in");
      locationInfo.classList.remove("content-fade-out");
      locationInfo.classList.add("content-fade-in");
      areaInfo.classList.remove("content-fade-out");
      areaInfo.classList.add("content-fade-in");

      // Hide loading indicator
      loadingIndicator.style.opacity = "0";
      isTransitioning = false;

      // Reset content classes
      setTimeout(() => {
        mainContent.classList.remove("content-fade-in");
        projectNumbers.classList.remove("content-fade-in");
        locationInfo.classList.remove("content-fade-in");
        areaInfo.classList.remove("content-fade-in");
      }, 600);
    }, 100);
  }, 300);
}

// Update project content
function updateProjectContent(project) {
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;

  // Update location
  locationInfo.querySelector("span:last-child").textContent = project.location;

  // Update area
  areaInfo.querySelector("span:last-child").textContent = project.area;

  // Update numbers
  const numberElements = projectNumbers.querySelectorAll("div");
  numberElements[0].textContent = project.numbers[0];
  numberElements[2].textContent = project.numbers[1];
}

// Update project images
function updateProjectImages(images) {
  const imageContainer = projectImages;
  imageContainer.innerHTML = "";

  images.forEach((imageData, index) => {
    const img = document.createElement("img");
    img.src = imageData.thumb;
    img.setAttribute("data-bg", imageData.bg);
    img.alt = "Project image";
    img.className = `project-image object-cover cursor-pointer rounded-xl h-[120px] w-[260px] max-md:shrink-0 max-md:h-[140px] max-md:w-[280px] max-sm:w-60 max-sm:h-[120px] ${
      index === 0 ? "active" : ""
    }`;

    // Add click event
    img.addEventListener("click", () => handleImageClick(img, index));

    imageContainer.appendChild(img);
  });
}

// Update background with smooth transition
function updateBackground(backgroundUrl) {
  // Create a new image to preload
  const img = new Image();
  img.onload = function () {
    backgroundContainer.style.backgroundImage = `url('${backgroundUrl}')`;
  };
  img.src = backgroundUrl;
}

// Handle header scroll effect
function handleHeaderScroll() {
  const header = document.getElementById("mainHeader");
  if (window.scrollY > 50) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
}

// Smooth scroll animation for page load
function animateOnLoad() {
  const elements = document.querySelectorAll(
    ".fade-in-up, .slide-in-left, .slide-in-right"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}

// Add mouse movement parallax effect
function addParallaxEffect() {
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Apply subtle parallax to background
    const translateX = (mouseX - 0.5) * 30;
    const translateY = (mouseY - 0.5) * 30;

    backgroundContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
  });
}

// Add touch gestures for mobile
function addTouchGestures() {
  let startX = 0;
  let startY = 0;

  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Horizontal swipe for next project
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next project
        handleNextProject();
      }
    }
  });
}

// Keyboard navigation
function addKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case " ":
        e.preventDefault();
        handleNextProject();
        break;
      case "1":
        e.preventDefault();
        if (document.querySelectorAll(".project-image")[0]) {
          handleImageClick(document.querySelectorAll(".project-image")[0], 0);
        }
        break;
      case "2":
        e.preventDefault();
        if (document.querySelectorAll(".project-image")[1]) {
          handleImageClick(document.querySelectorAll(".project-image")[1], 1);
        }
        break;
    }
  });
}

// Performance optimization - debounce resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
const handleResize = debounce(() => {
  // Recalculate any size-dependent elements
  if (window.innerWidth <= 768) {
    // Mobile optimizations
    document.body.classList.add("mobile-view");
  } else {
    document.body.classList.remove("mobile-view");
  }
}, 250);

// Add preloader
function showPreloader() {
  const preloader = document.createElement("div");
  preloader.id = "preloader";
  preloader.innerHTML = `
                    <div class="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
                        <div class="flex space-x-2">
                            <div class="w-3 h-3 bg-white rounded-full loading-dot"></div>
                            <div class="w-3 h-3 bg-white rounded-full loading-dot"></div>
                            <div class="w-3 h-3 bg-white rounded-full loading-dot"></div>
                        </div>
                    </div>
                `;
  document.body.appendChild(preloader);

  // Hide preloader after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  showPreloader();
  init();
  animateOnLoad();
  addParallaxEffect();
  addTouchGestures();
  addKeyboardNavigation();
  window.addEventListener("resize", handleResize);

  // Initial background setup
  updateBackground(projects[currentProjectIndex].background);

  console.log("ZOOD Dynamic Homepage initialized successfully!");
});

// Add error handling for images
function handleImageError(img) {
  img.style.opacity = "0.5";
  img.alt = "Image could not be loaded";
}

// Add images error handling
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") {
      handleImageError(e.target);
    }
  },
  true
);

// Export functions for potential external use
window.ZoodHomepage = {
  nextProject: handleNextProject,
  setProject: (index) => {
    if (index >= 0 && index < projects.length && !isTransitioning) {
      currentProjectIndex = index;
      const currentProject = projects[currentProjectIndex];
      updateProjectContent(currentProject);
      updateBackground(currentProject.background);
      updateProjectImages(currentProject.images);
    }
  },
  getCurrentProject: () => projects[currentProjectIndex],
};
