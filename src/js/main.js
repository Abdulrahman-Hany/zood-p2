document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    const selects = document.querySelectorAll(".custom-select");

    // Add interaction effects
    selects.forEach((select) => {
      select.addEventListener("change", function () {
        if (this.value) {
          this.style.color = "#ffffff";
        }
      });

      select.addEventListener("focus", function () {
        this.parentElement.style.transform = "scale(1.02)";
        this.parentElement.style.transition = "transform 0.2s ease";
      });

      select.addEventListener("blur", function () {
        this.parentElement.style.transform = "scale(1)";
      });
    });

    // Form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const selections = {};

      for (let [key, value] of formData.entries()) {
        if (value) selections[key] = value;
      }

      // Simple success message
      const button = this.querySelector('button[type="submit"]');
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML =
          '<span class="text-base font-bold text-text-white max-sm:text-sm">Searching...</span>';

        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    });
  }

  const pageNumbers = document.querySelectorAll("aside div");
  if (pageNumbers.length > 0) {
    pageNumbers.forEach((page, index) => {
      page.addEventListener("click", function () {
        // Remove active state from all
        pageNumbers.forEach((p) => {
          p.className =
            "text-sm text-center text-text-white opacity-60 cursor-pointer";
        });

        // Add active state to clicked
        this.className =
          "text-xl relative -left-1.5 text-center text-text-white font-bold";
      });
    });
  }
});

const header = document.getElementById("mainHeader");
const logoImg = document.getElementById("logoImg");
const registerBtnWrapper = document.getElementById("registerBtnWrapper");
const registerBtn = document.getElementById("registerBtn");

// المسارات المحتملة
const logoDefaultPaths = ["images/logo.svg"];

const logoWhitePaths = ["images/logo-wihte.svg"];

// مسارات الصور بعد ما نتحقق منها
let finalLogoDefault = "";
let finalLogoWhite = "";

// دالة تحاول تحميل أول صورة موجودة من القائمة
function getValidImagePath(paths, callback) {
  let index = 0;

  function tryNext() {
    if (index >= paths.length) {
      console.warn("⚠️ مفيش ولا مسار اشتغل من:", paths);
      return;
    }

    const img = new Image();
    img.src = paths[index];
    img.onload = () => callback(paths[index]);
    img.onerror = () => {
      index++;
      tryNext(); // جرّب اللي بعده
    };
  }

  tryNext();
}

function updateHeaderOnScroll() {
  if (!header || !logoImg) return;

  const isScrolled = window.scrollY > 10;
  const hasDarkClass = logoImg.classList.contains("dark");

  header.classList.toggle("px-14", !isScrolled);
  header.classList.toggle("pt-8", !isScrolled);
  header.classList.toggle("pb-0", !isScrolled);
  header.classList.toggle("backdrop-blur-md", isScrolled);
  header.classList.toggle("bg-[#0d1f35]", isScrolled);
  header.classList.toggle("shadow-md", isScrolled);
  header.classList.toggle("p-[20px]", isScrolled);
  header.classList.toggle("text-white", isScrolled);

  document
    .querySelectorAll("#mainHeader .text-text-white, #mainHeader .text-black")
    .forEach((el) => {
      el.classList.toggle("text-text-white", !isScrolled);
      el.classList.toggle("text-white", isScrolled);
    });

  // بدّل بين الصورتين حسب السكروول
  if (logoImg && finalLogoWhite && finalLogoDefault) {
    if (hasDarkClass) {
      logoImg.src = isScrolled ? finalLogoWhite : finalLogoDefault; // أسود → أبيض
    } else {
      logoImg.src = isScrolled ? finalLogoWhite : finalLogoWhite; // أبيض → أسود
    }
  }

  // ✅ تبديل الزرار مع السكروول
  if (registerBtnWrapper && registerBtn) {
    if (isScrolled) {
      registerBtnWrapper.setAttribute("href", "src/contact.html");
      registerBtn.className =
        "flex justify-center items-center bg-white rounded-xl border-white border-solid border-[0.5px] h-[35px] opacity-[0.94] w-[161px] max-sm:h-8 max-sm:w-[120px] transition-all duration-300 hover:shadow-xl";
      registerBtn.innerHTML =
        '<span class="text-sm font-bold leading-3 uppercase text-text-black">REGISTER NOW</span>';
    } else {
      registerBtnWrapper.setAttribute("href", "contact.html");
      registerBtn.className =
        "flex justify-center items-center bg-black rounded-xl border-solid border-[0.5px] h-[45px] w-[131px] max-sm:h-8 max-sm:w-[120px] transition-all duration-300 hover:shadow-xl";
      registerBtn.innerHTML =
        '<span class="text-sm text-white font-semibold leading-3 uppercase">REGISTER NOW</span>';
    }
  }
}

// ✅ نبدأ هنا: نحط الصورة الأولى (العادية) ونعمل تهيئة
if (header && logoImg) {
  getValidImagePath(logoDefaultPaths, (validSrc) => {
    finalLogoDefault = validSrc;
    logoImg.src = validSrc; // حط الصورة في البداية

    // بعد كده، نتحقق من اللوجو التاني ونربط الاسكرول
    getValidImagePath(logoWhitePaths, (whiteSrc) => {
      finalLogoWhite = whiteSrc;

      // أربط حدث السكروول
      window.addEventListener("scroll", updateHeaderOnScroll);
      updateHeaderOnScroll(); // شغّل مرة عند التحميل
    });
  });
}

// فقط إذا العناصر موجودة
if (header && logoImg) {
  window.addEventListener("scroll", updateHeaderOnScroll);
  updateHeaderOnScroll();
}

// Background slider - فحص وجود العناصر
document.addEventListener("DOMContentLoaded", function () {
  const background = document.getElementById("background");
  const pageNumbers = document.querySelectorAll("#page-numbers div");

  // إذا العناصر مش موجودة، ماتشغلش الكود
  if (!background || pageNumbers.length === 0) return;

  const backgroundImages = [
    "url('./src/images/home-img-1.png')",
    "url('./src/images/home-img-2.png')",
    "url('./src/images/home-img-3.png')",
    "url('./src/images/home-img-4.png')",
    "url('./src/images/home-img-5.png')",
  ];

  let currentIndex = 0;
  let interval;

  function setActive(index) {
    pageNumbers.forEach((el, i) => {
      el.className =
        i === index
          ? "text-xl relative -left-1.5 text-center text-text-white font-bold"
          : "text-sm text-center text-text-white opacity-60 cursor-pointer";
    });
    background.style.backgroundImage = backgroundImages[index];
    currentIndex = index;
  }

  // Click Event
  pageNumbers.forEach((page, index) => {
    page.addEventListener("click", function () {
      clearInterval(interval);
      setActive(index);
      startAutoSwitch();
    });
  });

  // Auto Switch
  function startAutoSwitch() {
    interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % backgroundImages.length;
      setActive(nextIndex);
    }, 4000);
  }

  // Initial Load
  setActive(0);
  startAutoSwitch();
});

// Scroll down button - فحص وجود العنصر
document.addEventListener("DOMContentLoaded", function () {
  const scrollDownBtn = document.getElementById("down");

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", function () {
      window.scrollBy({
        top: 700,
        behavior: "smooth",
      });
    });
  }
});

// Word animation - فحص وجود العناصر
document.addEventListener("DOMContentLoaded", function () {
  const words = document.querySelectorAll(".word");

  if (words.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("text-opacity-20");
            entry.target.classList.add("text-opacity-100");
          } else {
            entry.target.classList.remove("text-opacity-100");
            entry.target.classList.add("text-opacity-20");
          }
        });
      },
      {
        threshold: 1.0,
      }
    );

    words.forEach((word) => observer.observe(word));
  }
});

// Swiper - فحص وجود العنصر
document.addEventListener("DOMContentLoaded", function () {
  const swiperElement = document.querySelector(".swiper");

  if (swiperElement && typeof Swiper !== "undefined") {
    const swiper = new Swiper(".swiper", {
      loop: true,
      autoplay: {
        delay: 3000,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
});

// Navigation tabs - فحص وجود العناصر
document.addEventListener("DOMContentLoaded", function () {
  const navDivs = document.querySelectorAll("nav > div");
  const areaSection = document.getElementById("area-of-interest");
  const contactSection = document.getElementById("contact-details");
  const interestdetails = document.getElementById("interest-details");

  // إذا العناصر مش موجودة، ماتشغلش الكود
  if (navDivs.length === 0) return;

  function fadeIn(element) {
    if (!element) return;
    element.style.opacity = 0;
    element.style.display = "flex";

    let opacity = 0;
    const duration = 400;
    const interval = 20;
    const increment = interval / duration;

    const animate = setInterval(() => {
      opacity += increment;
      if (opacity >= 1) {
        opacity = 1;
        clearInterval(animate);
      }
      element.style.opacity = opacity;
    }, interval);
  }

  function hide(element) {
    if (!element) return;
    element.style.display = "none";
    element.style.opacity = 0;
  }

  navDivs.forEach((div) => {
    div.addEventListener("click", () => {
      navDivs.forEach((d) => {
        d.classList.remove("font-bold");
        d.classList.add("font-normal");
        const line = d.querySelector("div");
        if (line) {
          line.classList.remove("bg-black");
          line.classList.add("bg-stone-500");
        }
      });

      div.classList.remove("font-normal");
      div.classList.add("font-bold");
      const currentLine = div.querySelector("div");
      if (currentLine) {
        currentLine.classList.remove("bg-stone-500");
        currentLine.classList.add("bg-black");
      }

      const spanElement = div.querySelector("span");
      if (spanElement) {
        const text = spanElement.textContent;
        if (text.includes("Area of interest")) {
          hide(contactSection);
          hide(interestdetails);
          fadeIn(areaSection);
        } else if (text.includes("Contact Details")) {
          hide(areaSection);
          hide(interestdetails);
          fadeIn(contactSection);
        } else {
          hide(areaSection);
          hide(contactSection);
          fadeIn(interestdetails);
        }
      }
    });
  });

  // أول مرة الصفحة تفتح
  hide(contactSection);
  hide(interestdetails);
  fadeIn(areaSection);
});

// Accordion function - فحص وجود العناصر
function toggleAccordion(index) {
  const content = document.getElementById(`accordion-${index}`);
  if (!content) return;

  const arrow =
    content.previousElementSibling?.querySelector(".accordion-arrow");

  // أغلق كل العناصر الأخرى
  document.querySelectorAll(".accordion-content").forEach((item, i) => {
    if (i !== index) {
      item.classList.remove("active");
      const otherArrow = document
        .getElementById(`accordion-${i}`)
        ?.previousElementSibling?.querySelector(".accordion-arrow");
      if (otherArrow) otherArrow.classList.remove("rotated");
    }
  });

  // شغّل/أغلق الحالي
  content.classList.toggle("active");
  if (arrow) arrow.classList.toggle("rotated");
}
document.addEventListener("DOMContentLoaded", () => {
  // كل زر مع العنصر المطابق له
  const pairs = [
    { btn: "we-are", card: "Who-we-are-card" },
    { btn: "communities", card: "Communities-card" },
    { btn: "News-id", card: "news-card" },
  ];

  // إضافة الأزرار الخاصة بالجوال
  const mobilePairs = [
    { btn: "mobile-we-are", card: "Who-we-are-card" },
    { btn: "mobile-communities", card: "Communities-card" },
    { btn: "mobile-News-id", card: "news-card" },
  ];

  // دالة لإخفاء جميع الكروت
  function hideAll() {
    pairs.forEach(({ card }) => {
      const el = document.getElementById(card);
      el.classList.remove("opacity-100", "scale-100", "pointer-events-auto");
      el.classList.add("opacity-0", "scale-95", "pointer-events-none");
    });
  }

  // دالة لإغلاق القائمة المتنقلة
  function closeMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburger = document.getElementById("hamburgerBtn");
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("active");
  }

  // تهيئة الأحداث للأزرار العادية
  pairs.forEach(({ btn, card }) => {
    const button = document.getElementById(btn);
    const target = document.getElementById(card);

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = target.classList.contains("opacity-100");
      hideAll();
      if (!isVisible) {
        target.classList.remove("opacity-0", "scale-95", "pointer-events-none");
        target.classList.add("opacity-100", "scale-100", "pointer-events-auto");
      }
    });

    target.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // تهيئة الأحداث للأزرار المتنقلة
  mobilePairs.forEach(({ btn, card }) => {
    const button = document.getElementById(btn);
    const target = document.getElementById(card);

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = target.classList.contains("opacity-100");
      hideAll();
      if (!isVisible) {
        target.classList.remove("opacity-0", "scale-95", "pointer-events-none");
        target.classList.add("opacity-100", "scale-100", "pointer-events-auto");
      }
      // إغلاق القائمة المتنقلة بعد النقر
      closeMobileMenu();
    });

    target.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // إغلاق عند الضغط في أي مكان خارج الكروت
  document.addEventListener("click", () => hideAll());

  // التحكم في القائمة المتنقلة
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburgerBtn.classList.toggle("active");
    mobileMenu.classList.toggle("open");
  });

  // إغلاق القائمة المتنقلة عند النقر على رابط لا يفتح كارد
  document
    .querySelectorAll("#mobileMenu a:not(.mobile-nav-item)")
    .forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

  // إغلاق القائمة المتنقلة عند النقر خارجها
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // دالة عامة للتحكم في السلايدر
  function initSlider(wrapperId, prevBtnId, nextBtnId, progressLineId) {
    const wrapper = document.getElementById(wrapperId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const progressLine = document.getElementById(progressLineId);

    const card = wrapper.querySelector("a"); // أي كارت
    const cardWidth = card.offsetWidth + 16; // عرض الكارت + المسافة (gap)

    let scrollAmount = 0;
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

    function updateProgress() {
      const progress = (wrapper.scrollLeft / maxScroll) * 100;
      progressLine.style.width = `${progress}%`;
    }
          
    nextBtn.addEventListener("click", () => {
      wrapper.scrollBy({ left: cardWidth, behavior: "smooth" });
      setTimeout(updateProgress, 400);
    });

    prevBtn.addEventListener("click", () => {
      wrapper.scrollBy({ left: -cardWidth, behavior: "smooth" });
      setTimeout(updateProgress, 400);
    });

    wrapper.addEventListener("scroll", updateProgress);
  }

  // نهيئ السلايدرات الثلاثة
  initSlider("news-cardsWrapper", "news-prevBtn", "news-nextBtn", "news-progressLine");
  initSlider("who-cardsWrapper", "who-prevBtn", "who-nextBtn", "who-progressLine");
  initSlider("communities-cardsWrapper", "communities-prevBtn", "communities-nextBtn", "communities-progressLine");
});

