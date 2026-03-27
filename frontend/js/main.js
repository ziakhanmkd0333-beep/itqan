/**
 * Al-Itqan Institute - Main JavaScript
 * Handles: Language, Theme, Auth, API, Utils
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  API_BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://itqaninstitute.com/api',
  DEFAULT_LANG: 'en',
  DEFAULT_THEME: 'islamic-green',
  TOKEN_KEY: 'itqan_token',
  USER_KEY: 'itqan_user',
  LANG_KEY: 'itqan_language',
  THEME_KEY: 'itqan_theme'
};

// ============================================
// TRANSLATIONS
// ============================================

const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    courses: 'Courses',
    blogs: 'Blogs',
    admission: 'Admission',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    login: 'Login',
    signup: 'Signup',
    logout: 'Logout',
    
    // Hero
    heroTitle: 'Al-Itqan Institute for Islamic & Arabic Studies',
    heroSubtitle: 'Authentic Islamic & Arabic Knowledge by Qualified Scholars',
    heroDescription: 'A world-class Islamic education platform providing complete and structured Islamic knowledge from foundational level to advanced scholarly specialization.',
    exploreCourses: 'Explore Courses',
    applyNow: 'Apply Now',
    
    // Daily Cards
    dailyHadith: 'Daily Hadith',
    dailyAyah: 'Daily Ayah',
    
    // Courses
    ourCourses: 'Our Courses',
    coursesSubtitle: 'Explore a complete and structured journey of Islamic and Arabic education',
    viewAll: 'View All',
    enroll: 'Enroll',
    duration: 'Duration',
    students: 'Students',
    level: 'Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    
    // Why Choose Us
    whyChooseUs: 'Why Choose Us',
    flexibleTimings: 'Flexible Timings',
    certifiedScholars: 'Certified Scholars',
    recordedLessons: 'Recorded Lessons',
    liveClasses: 'Live Classes',
    groupDiscussions: 'Group Discussions',
    certificates: 'Certificates',
    
    // Footer
    quickLinks: 'Quick Links',
    contact: 'Contact',
    support: '24/7 Support',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved',
    
    // Forms
    fullName: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone Number',
    message: 'Message',
    submit: 'Submit',
    sending: 'Sending...',
    
    // Notifications
    newAdmissionsOpen: 'New Admissions Open!',
    
    // Auth
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember me',
    orContinueWith: 'Or continue with',
    
    // Validation
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email',
    passwordMin: 'Password must be at least 8 characters',
    passwordsMatch: 'Passwords do not match'
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    courses: 'الدورات',
    blogs: 'المدونات',
    admission: 'القبول',
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    
    // Hero
    heroTitle: 'معهد الإتقان للدراسات الإسلامية والعربية',
    heroSubtitle: 'معرفة إسلامية وعربية أصيلة من علماء مؤهلين',
    heroDescription: 'منصة تعليم إسلامي عالمية المستوى تقدم معرفة إسلامية كاملة ومنظمة من المستوى الأساسي إلى التخصص العلمي المتقدم.',
    exploreCourses: 'استكشف الدورات',
    applyNow: 'قدم الآن',
    
    // Daily Cards
    dailyHadith: 'الحديث اليومي',
    dailyAyah: 'الآية اليومية',
    
    // Courses
    ourCourses: 'دوراتنا',
    coursesSubtitle: 'استكشف رحلة تعليمية كاملة ومنظمة في الدراسات الإسلامية والعربية',
    viewAll: 'عرض الكل',
    enroll: 'سجل الآن',
    duration: 'المدة',
    students: 'الطلاب',
    level: 'المستوى',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    
    // Why Choose Us
    whyChooseUs: 'لماذا تختارنا',
    flexibleTimings: 'مواعيد مرنة',
    certifiedScholars: 'علماء معتمدون',
    recordedLessons: 'دروس مسجلة',
    liveClasses: 'حصص مباشرة',
    groupDiscussions: 'نقاشات جماعية',
    certificates: 'شهادات',
    
    // Footer
    quickLinks: 'روابط سريعة',
    contact: 'تواصل',
    support: 'دعم 24/7',
    followUs: 'تابعنا',
    allRightsReserved: 'جميع الحقوق محفوظة',
    
    // Forms
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    phone: 'رقم الهاتف',
    message: 'الرسالة',
    submit: 'إرسال',
    sending: 'جاري الإرسال...',
    
    // Notifications
    newAdmissionsOpen: 'القبول مفتوح الآن!',
    
    // Auth
    welcomeBack: 'مرحباً بعودتك',
    createAccount: 'إنشاء حساب جديد',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    orContinueWith: 'أو تابع باستخدام',
    
    // Validation
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
    passwordMin: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
    passwordsMatch: 'كلمات المرور غير متطابقة'
  },
  
  ur: {
    // Navigation
    home: 'ہوم',
    courses: 'کورسز',
    blogs: 'بلاگز',
    admission: 'داخلہ',
    aboutUs: 'ہمارے بارے میں',
    contactUs: 'رابطہ کریں',
    login: 'لاگ ان',
    signup: 'سائن اپ',
    logout: 'لاگ آؤٹ',
    
    // Hero
    heroTitle: 'معہد الإتقان برائے اسلامی و عربی مطالعہ',
    heroSubtitle: 'اہل علما سے مستند اسلامی اور عربی علم',
    heroDescription: 'ایک عالمی معیار کی اسلامی تعلیمی پلیٹ فارم جو بنیادی سطح سے لے کر جدید علمی تخصص تک مکمل اور منظم اسلامی علم فراہم کرتا ہے۔',
    exploreCourses: 'کورسز دیکھیں',
    applyNow: 'اب درخواست دیں',
    
    // Daily Cards
    dailyHadith: 'روزانہ حدیث',
    dailyAyah: 'روزانہ آیت',
    
    // Courses
    ourCourses: 'ہمارے کورسز',
    coursesSubtitle: 'اسلامی اور عربی تعلیم کا ایک مکمل اور منظم سفر دریافت کریں',
    viewAll: 'سب دیکھیں',
    enroll: 'داخلہ لیں',
    duration: 'مدت',
    students: 'طلباء',
    level: 'سطح',
    beginner: 'ابتدائی',
    intermediate: 'درمیانی',
    advanced: 'جدید',
    
    // Why Choose Us
    whyChooseUs: 'ہمیں کیوں منتخب کریں',
    flexibleTimings: 'مستقل اوقات',
    certifiedScholars: 'مجاز علما',
    recordedLessons: 'ریکارڈ شدہ اسباق',
    liveClasses: 'لائیو کلاسز',
    groupDiscussions: 'گروپ بحث',
    certificates: 'سرٹیفکیٹس',
    
    // Footer
    quickLinks: 'فوری روابط',
    contact: 'رابطہ',
    support: '24/7 سپورٹ',
    followUs: 'ہمیں فالو کریں',
    allRightsReserved: 'جملہ حقوق محفوظ ہیں',
    
    // Forms
    fullName: 'پورا نام',
    email: 'ای میل ایڈریس',
    password: 'پاس ورڈ',
    confirmPassword: 'پاس ورڈ تصدیق',
    phone: 'فون نمبر',
    message: 'پیغام',
    submit: 'جمع کرائیں',
    sending: ' also send...',
    
    // Notifications
    newAdmissionsOpen: 'داخلہ کھلا ہے!',
    
    // Auth
    welcomeBack: 'خوش آمدید',
    createAccount: 'نیا اکاؤنٹ بنائیں',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    rememberMe: 'مجھے یاد رکھیں',
    orContinueWith: 'یا اس کے ساتھ جاری رکھیں',
    
    // Validation
    required: 'یہ فیلڈ ضروری ہے',
    invalidEmail: 'براہ کرم درست ای میل درج کریں',
    passwordMin: 'پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے',
    passwordsMatch: 'پاس ورڈز مطابقت نہیں رکھتے'
  }
};

// ============================================
// APP CLASS
// ============================================

class ItqanApp {
  constructor() {
    this.currentLang = localStorage.getItem(CONFIG.LANG_KEY) || CONFIG.DEFAULT_LANG;
    this.currentTheme = localStorage.getItem(CONFIG.THEME_KEY) || CONFIG.DEFAULT_THEME;
    this.user = null;
    this.token = null;
    
    this.init();
  }
  
  init() {
    this.loadUser();
    this.setupLanguage();
    this.setupTheme();
    this.setupNavigation();
    this.setupEventListeners();
    this.setupScrollEffects();
  }
  
  // ============================================
  // LANGUAGE SYSTEM
  // ============================================
  
  setupLanguage() {
    document.body.setAttribute('lang', this.currentLang);
    this.updateLanguageSwitcher();
    this.translatePage();
  }
  
  setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    
    this.currentLang = lang;
    localStorage.setItem(CONFIG.LANG_KEY, lang);
    document.body.setAttribute('lang', lang);
    
    this.updateLanguageSwitcher();
    this.translatePage();
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
  }
  
  updateLanguageSwitcher() {
    const switcherBtn = document.querySelector('.lang-switcher .switcher-btn');
    if (switcherBtn) {
      const flags = { en: '🇬🇧', ar: '🇸🇦', ur: '🇵🇰' };
      const labels = { en: 'English', ar: 'العربية', ur: 'اردو' };
      switcherBtn.innerHTML = `<span class="flag">${flags[this.currentLang]}</span> <span>${labels[this.currentLang]}</span> <i class="chevron">▼</i>`;
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.lang-switcher .dropdown-item').forEach(item => {
      item.classList.toggle('active', item.dataset.lang === this.currentLang);
    });
  }
  
  translatePage() {
    const texts = TRANSLATIONS[this.currentLang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (texts[key]) {
        el.textContent = texts[key];
      }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (texts[key]) {
        el.placeholder = texts[key];
      }
    });
  }
  
  t(key) {
    return TRANSLATIONS[this.currentLang]?.[key] || TRANSLATIONS.en[key] || key;
  }
  
  // ============================================
  // THEME SYSTEM
  // ============================================
  
  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeSwitcher();
  }
  
  setTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem(CONFIG.THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeSwitcher();
  }
  
  updateThemeSwitcher() {
    const switcherBtn = document.querySelector('.theme-switcher .switcher-btn');
    if (switcherBtn) {
      const icons = {
        'light': '☀️',
        'dark': '🌙',
        'islamic-green': '🌿'
      };
      const labels = {
        'light': this.t('lightMode') || 'Light',
        'dark': this.t('darkMode') || 'Dark',
        'islamic-green': this.t('islamicGreen') || 'Green'
      };
      switcherBtn.innerHTML = `<span>${icons[this.currentTheme]}</span> <span>${labels[this.currentTheme]}</span> <i class="chevron">▼</i>`;
    }
    
    document.querySelectorAll('.theme-switcher .dropdown-item').forEach(item => {
      item.classList.toggle('active', item.dataset.theme === this.currentTheme);
    });
  }
  
  // ============================================
  // AUTHENTICATION
  // ============================================
  
  loadUser() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const userData = localStorage.getItem(CONFIG.USER_KEY);
    
    if (token && userData) {
      this.token = token;
      this.user = JSON.parse(userData);
      this.updateAuthUI();
    }
  }
  
  async login(email, password) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem(CONFIG.TOKEN_KEY, this.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(this.user));
        this.updateAuthUI();
        this.hideModal('loginModal');
        this.showToast('success', this.t('loginSuccess') || 'Logged in successfully');
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      this.showToast('error', error.message || 'Login failed');
      return false;
    }
  }
  
  async register(userData) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.showToast('success', this.t('registerSuccess') || 'Account created successfully');
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      this.showToast('error', error.message || 'Registration failed');
      return false;
    }
  }
  
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    this.updateAuthUI();
    window.location.href = '/';
  }
  
  updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (this.user) {
      authButtons.innerHTML = `
        <div class="user-menu">
          <button class="btn btn-secondary btn-sm user-btn">
            <span>${this.user.name}</span>
            <i class="chevron">▼</i>
          </button>
          <div class="user-dropdown">
            <a href="/panel/${this.user.role}.html">${this.t('dashboard') || 'Dashboard'}</a>
            <a href="#" class="logout-link">${this.t('logout')}</a>
          </div>
        </div>
      `;
      
      authButtons.querySelector('.logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    } else {
      authButtons.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="app.showModal('loginModal')">${this.t('login')}</button>
        <button class="btn btn-primary btn-sm" onclick="app.showModal('registerModal')">${this.t('signup')}</button>
      `;
    }
  }
  
  // ============================================
  // API METHODS
  // ============================================
  
  async api(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  async getCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.api(`/courses?${queryString}`);
  }
  
  async getBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.api(`/blogs?${queryString}`);
  }
  
  async submitAdmission(type, data) {
    return this.api(`/admissions/${type}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async submitContact(data) {
    return this.api('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  // ============================================
  // UI UTILITIES
  // ============================================
  
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  showToast(type, message, duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : '!'}</i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  formatDate(date) {
    return new Date(date).toLocaleDateString(
      this.currentLang === 'ar' ? 'ar-SA' : this.currentLang === 'ur' ? 'ur-PK' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  }
  
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat(
      this.currentLang === 'ar' ? 'ar-SA' : this.currentLang === 'ur' ? 'ur-PK' : 'en-US',
      { style: 'currency', currency }
    ).format(amount);
  }
  
  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  setupEventListeners() {
    // Language switcher
    document.querySelectorAll('.lang-switcher .dropdown-item').forEach(item => {
      item.addEventListener('click', () => this.setLanguage(item.dataset.lang));
    });
    
    // Theme switcher
    document.querySelectorAll('.theme-switcher .dropdown-item').forEach(item => {
      item.addEventListener('click', () => this.setTheme(item.dataset.theme));
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarNav = document.querySelector('.navbar-nav');
    if (menuToggle && navbarNav) {
      menuToggle.addEventListener('click', () => {
        navbarNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });
    }
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
    
    // Close modals on close button
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Switcher dropdown toggles
    document.querySelectorAll('.switcher-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.nextElementSibling;
        if (dropdown) {
          dropdown.classList.toggle('active');
          // Close other dropdowns
          document.querySelectorAll('.switcher-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
          });
        }
      });
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.switcher-dropdown').forEach(d => d.classList.remove('active'));
    });
  }
  
  setupNavigation() {
    // Highlight active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkPage = link.getAttribute('href')?.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  }
  
  setupScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.card, .section-title, .feature-card').forEach(el => {
      observer.observe(el);
    });
  }
}

// ============================================
// FORM VALIDATION UTILITIES
// ============================================

const Validation = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value),
  password: (value) => value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value),
  required: (value) => value.trim().length > 0,
  
  validateForm(form) {
    const errors = [];
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      const value = input.value;
      const type = input.type;
      
      if (input.required && !this.required(value)) {
        errors.push({ field: input.name, message: 'This field is required' });
      }
      
      if (type === 'email' && value && !this.email(value)) {
        errors.push({ field: input.name, message: 'Invalid email address' });
      }
      
      if (type === 'tel' && value && !this.phone(value)) {
        errors.push({ field: input.name, message: 'Invalid phone number' });
      }
      
      if (input.name === 'password' && value && !this.password(value)) {
        errors.push({ field: input.name, message: 'Password must be at least 8 characters with 1 uppercase and 1 number' });
      }
      
      if (input.name === 'confirmPassword') {
        const password = form.querySelector('[name="password"]')?.value;
        if (value && value !== password) {
          errors.push({ field: input.name, message: 'Passwords do not match' });
        }
      }
    });
    
    return errors;
  }
};

// ============================================
// INITIALIZE APP
// ============================================

const app = new ItqanApp();

// Expose for global access
window.app = app;
window.Validation = Validation;
window.CONFIG = CONFIG;
