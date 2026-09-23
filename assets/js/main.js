/**
 * Portfolio JavaScript - Lưu Thế Kiệt (Senior Sales Executive)
 * Features: Dark/Light Mode, Scroll Animations, KPI Counter, Project Filter, Modal Case Studies, Contact Form & Toast.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollAnimations();
  initKpiCounters();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initCopyToClipboard();
  initBackToTop();
  initScrollSpy();
});

/* ----------------------------------------------------
 * 1. THEME TOGGLE (DARK / LIGHT MODE)
 * ---------------------------------------------------- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const html = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        showToast('Đã chuyển sang giao diện Sáng ☀️', 'info');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        showToast('Đã chuyển sang giao diện Tối 🌙', 'info');
      }
    });
  });
}

/* ----------------------------------------------------
 * 2. MOBILE NAVIGATION DRAWER
 * ---------------------------------------------------- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    mobileBackdrop.classList.remove('hidden', 'opacity-0');
    mobileBackdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    mobileBackdrop.classList.remove('opacity-100');
    mobileBackdrop.classList.add('opacity-0');
    setTimeout(() => {
      mobileBackdrop.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ----------------------------------------------------
 * 3. SCROLL REVEAL ANIMATIONS
 * ---------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------
 * 4. KPI COUNTER ANIMATION
 * ---------------------------------------------------- */
function initKpiCounters() {
  const counterElements = document.querySelectorAll('.kpi-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1800;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.getElementById('stats-bar');
  if (statsSection) observer.observe(statsSection);
}

/* ----------------------------------------------------
 * 5. PROJECT CATEGORY FILTER
 * ---------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active-filter', 'bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
      });

      btn.classList.add('active-filter', 'bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ----------------------------------------------------
 * 6. PROJECT CASE STUDY MODAL DATA & HANDLER
 * ---------------------------------------------------- */
const projectData = {
  1: {
    title: 'Tối Ưu Chuỗi Phân Phối Rau Củ Quả Sạch WinEco Kênh Minimart',
    company: 'Công Ty TNHH Đầu tư sản xuất và PTNN WinEco (Masan Group)',
    role: 'Nhân viên kinh doanh Minimart (Chuỗi Winmart+)',
    time: '09/2024 – 01/2025',
    category: 'Kênh Minimart / Nông sản sạch',
    highlights: ['97% Hoàn thành KPI doanh số', '30+ Cửa hàng Winmart+ quản lý', 'Giảm tỷ lệ hủy hàng < 3%'],
    challenge: 'Mặt hàng rau củ quả tươi sạch có vòng đời bảo quản ngắn (perishable), đòi hỏi tiếp nhận đơn hàng chuẩn xác, luân chuyển nhanh và phối hợp chặt chẽ với từng cửa hàng trưởng để giảm thiểu tối đa hao hụt và tồn kho.',
    solution: [
      'Thiết lập mối quan hệ tin cậy với bộ phận nhận hàng và cửa hàng trưởng tại từng điểm bán Winmart+.',
      'Ứng dụng biểu đồ dự báo bán hàng theo ngày/tuần để tư vấn số lượng đặt hàng (Order forecasting) hợp lý cho cửa hàng.',
      'Phối hợp đa phòng ban (Kho, Logistics, Kế toán, Quản lý chất lượng) để xử lý tức thì các phát sinh về chất lượng hoặc chứng từ giao nhận.',
      'Kiểm soát hạn sử dụng, hỗ trợ trưng bày kệ hàng bắt mắt thu hút người tiêu dùng.'
    ],
    results: [
      'Đạt 97% chỉ tiêu KPI doanh thu hàng tháng được Ban giám đốc giao phó.',
      'Duy trì tỷ lệ On-Time-In-Full (OTIF) đạt trên 98% cho toàn chuỗi Winmart+ phụ trách.',
      'Xây dựng mối quan hệ đối tác vững chắc, tạo tiền đề gia tăng sản lượng tiêu thụ các dòng sản phẩm rau củ chuẩn VietGAP/GlobalGAP.'
    ],
    skillsUsed: ['Quản lý chuỗi Minimart (Winmart+)', 'Dự báo & Tiếp nhận đơn hàng', 'Antigravity AI (Tự động hóa báo cáo)', 'Codex (Data Scripting)']
  },
  2: {
    title: 'Phát Triển Thị Phần Hàng Mát & Đông Lạnh Kênh MT & CVS',
    company: 'PARADISE FINE FOODS VIETNAM JSC',
    role: 'Nhân viên kinh doanh Kênh MT & CVS',
    time: '03/2021 – 05/2022',
    category: 'Kênh MT & CVS / Thực phẩm cao cấp',
    highlights: ['Đối tác lớn: AEON, Satra, BHX, Win+', 'Tăng 25% giá trị đơn hàng', '100% Giải quyết khiếu nại trong 24h'],
    challenge: 'Ngành hàng thực phẩm mát/đông lạnh cạnh tranh khốc liệt về diện tích tủ đông/tủ mát tại các siêu thị lớn và chuỗi tiện lợi. Chi phí vận hành và rủi ro chuỗi lạnh (cold-chain) rất cao nếu không quản lý đơn hàng chặt chẽ.',
    solution: [
      'Chăm sóc chuyên sâu mạng lưới siêu thị và chuỗi tiện ích: Win+, Satra, Bách Hóa Xanh, AEON.',
      'Chủ động tiếp cận, thương thảo và tiếp nhận các đơn hàng quy mô lớn từ bộ phận thu mua (Purchasing Department) của đối tác.',
      'Xây dựng mạng lưới quan hệ sâu sắc với nhân viên ngành hàng và cửa hàng trưởng để ưu tiên vị trí trưng bày hàng hóa nổi bật.',
      'Xử lý nhanh các vấn đề phát sinh tại điểm bán (hàng lỗi bao bì, nhiệt độ bảo quản, trả hàng) thông qua tham vấn ý kiến kỹ thuật và các bộ phận liên quan.'
    ],
    results: [
      'Mở rộng sản lượng phân phối tại chuỗi Bách Hóa Xanh và AEON với mức tăng trưởng đơn hàng đạt trên 25%.',
      'Được đối tác đánh giá là nhà cung ứng có dịch vụ chăm sóc và xử lý sự cố nhanh nhất khu vực.',
      'Bảo toàn tiêu chuẩn chất lượng hàng hóa đông lạnh, tối ưu hóa doanh số Sell-in và Sell-out.'
    ],
    skillsUsed: ['Đàm phán B2B với Chuỗi MT & CVS', 'Quản lý chuỗi Win+, Satra, BHX, AEON', 'Claude Code (Phân tích đối tác)', 'Xử lý sự cố chuỗi cung ứng lạnh']
  },
  3: {
    title: 'Tối Ưu Diện Tích Trưng Bày & Doanh Số Tại Đại Siêu Thị AEON Mall',
    company: 'Công Ty TNHH TM DV SX Vạn Thịnh Phú',
    role: 'Nhân viên kinh doanh Kênh MT (Hệ thống AEON)',
    time: '05/2020 – 12/2020',
    category: 'Kênh MT / Tiêu dùng & Bán lẻ',
    highlights: ['Chiếm lĩnh vị trí "Golden Shelf"', 'Tăng 30% tỷ lệ chuyển đổi khách hàng', 'Đối tác chiến lược ngành hàng AEON'],
    challenge: 'AEON Mall là hệ thống đại siêu thị tiêu chuẩn Nhật Bản với quy định cực kỳ khắt khe về tiêu chuẩn trưng bày, diện tích mặt tiền (facing) và chất lượng tư vấn khách hàng.',
    solution: [
      'Thiết lập mối quan hệ chặt chẽ với Trưởng ngành hàng và nhân sự quản lý tại từng trung tâm AEON.',
      'Thường xuyên kiểm tra, kéo mặt sản phẩm (pulling faces), thương thuyết xin thêm chân kệ phụ, đầu kệ (end-cap) để tối đa diện tích tiếp xúc với người mua.',
      'Trực tiếp tư vấn khách hàng tiêu dùng tại quầy, nắm bắt thị hiếu thực tế để phản hồi về bộ phận Marketing.',
      'Sẵn sàng hỗ trợ ngành hàng khi có yêu cầu cao điểm (sự kiện khuyến mãi, lễ Tết, hội chợ tiêu dùng Nhật Bản).'
    ],
    results: [
      'Gia tăng diện tích trưng bày (shelf space) của sản phẩm công ty tại hệ thống AEON lên thêm 35%.',
      'Thúc đẩy doanh số bán lẻ tại điểm bán (Sell-out) tăng trưởng vượt bậc trong suốt thời gian phụ trách.',
      'Tạo dựng hình ảnh đối tác chuyên nghiệp, uy tín hàng đầu trong mắt ban quản lý ngành hàng AEON.'
    ],
    skillsUsed: ['Quản lý Kênh MT (Hệ thống AEON)', 'Nghệ thuật trưng bày (Planogram / Facing)', 'Thương thuyết vị trí kệ hàng', 'Tư vấn bán hàng trực tiếp']
  },
  4: {
    title: 'Phát Triển Điểm Bán Lẻ Kênh GT & Tối Ưu Mạng Lưới Nhà Phân Phối',
    company: 'Công Ty TNHH Nước Giải Khát Coca-Cola Việt Nam',
    role: 'Nhân viên kinh doanh Kênh GT',
    time: '07/2019 – 04/2020',
    category: 'Kênh GT / Nước giải khát (FMCG)',
    highlights: ['Mở mới 80+ điểm bán lẻ/tạp hóa', 'Tối ưu tuyến bán hàng (Route-to-market)', 'Phân phối nhanh chóng, chuẩn xác'],
    challenge: 'Kênh truyền thống (GT) có đặc thù địa bàn rộng, chủ tiệm tạp hóa đa dạng tính cách và yêu cầu tiếp cận trực tiếp kiên trì để thuyết phục họ nhập hàng hoặc thay đổi danh mục đồ uống trưng bày.',
    solution: [
      'Khảo sát chi tiết địa bàn được giao, lên lộ trình bán hàng (routing) khoa học để tối đa số lượng cuộc gặp gỡ mỗi ngày.',
      'Hỗ trợ Quản lý thương thuyết với các khách hàng tiềm năng, đại lý lớn trong khu vực.',
      'Chăm sóc tận tâm các điểm bán lẻ hiện hữu, tư vấn chính sách khuyến mãi, giá bán và quyền lợi từ Coca-Cola.',
      'Tiếp nhận đơn hàng chính xác, phối hợp nhịp nhàng với Nhà Phân Phối (NPP) để phân phối sản phẩm nhanh chóng, đúng địa điểm yêu cầu.'
    ],
    results: [
      'Phát triển thành công hơn 80 điểm bán lẻ mới trong khu vực được phân công.',
      'Tăng doanh số bán hàng của tuyến phụ trách lên 20% so với cùng kỳ.',
      'Kết nối mượt mà giữa tiệm tạp hóa - nhân viên kinh doanh - nhà phân phối, không để đứt gãy nguồn hàng.'
    ],
    skillsUsed: ['Phát triển Kênh GT (Tạp hóa & Đại lý)', 'Thương thuyết Bán Lẻ & Mở điểm bán mới', 'Phối hợp Nhà Phân Phối (NPP)', 'Quản lý tuyến bán hàng FMCG']
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('close-modal-btn');
  const viewDetailBtns = document.querySelectorAll('.view-project-btn');

  if (!modalBackdrop) return;

  function openModal(id) {
    const data = projectData[id];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-company').textContent = data.company;
    document.getElementById('modal-role-time').textContent = `${data.role} • ${data.time}`;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-challenge').textContent = data.challenge;

    // Highlights
    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = '';
    data.highlights.forEach(h => {
      const badge = document.createElement('span');
      badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      badge.innerHTML = `✓ ${h}`;
      highlightsContainer.appendChild(badge);
    });

    // Solutions
    const solutionsList = document.getElementById('modal-solutions');
    solutionsList.innerHTML = '';
    data.solution.forEach(sol => {
      const li = document.createElement('li');
      li.className = 'flex items-start text-sm text-slate-700 dark:text-slate-300 leading-relaxed';
      li.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span><span>${sol}</span>`;
      solutionsList.appendChild(li);
    });

    // Results
    const resultsList = document.getElementById('modal-results');
    resultsList.innerHTML = '';
    data.results.forEach(res => {
      const li = document.createElement('li');
      li.className = 'flex items-start text-sm text-slate-700 dark:text-slate-300 leading-relaxed';
      li.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-3 flex-shrink-0"></span><span>${res}</span>`;
      resultsList.appendChild(li);
    });

    // Skills
    const skillsContainer = document.getElementById('modal-skills');
    skillsContainer.innerHTML = '';
    data.skillsUsed.forEach(skill => {
      const badge = document.createElement('span');
      badge.className = 'px-2.5 py-1 text-xs rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-medium';
      badge.textContent = skill;
      skillsContainer.appendChild(badge);
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      openModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ----------------------------------------------------
 * 7. CONTACT FORM VALIDATION & TOAST
 * ---------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    // Validation
    if (!nameInput.value.trim()) {
      showToast('Vui lòng nhập Họ và Tên của bạn.', 'error');
      nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showToast('Vui lòng nhập địa chỉ Email hợp lệ.', 'error');
      emailInput.focus();
      return;
    }

    if (!messageInput.value.trim()) {
      showToast('Vui lòng để lại lời nhắn hoặc yêu cầu hợp tác.', 'error');
      messageInput.focus();
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Đang gửi tin nhắn...
    `;

    // Simulate sending network request
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      showToast('Cảm ơn bạn! Lời nhắn đã được gửi thành công đến anh Lưu Thế Kiệt. Anh Kiệt sẽ phản hồi sớm nhất!', 'success');
    }, 1200);
  });
}

/* ----------------------------------------------------
 * 8. COPY TO CLIPBOARD
 * ---------------------------------------------------- */
function initCopyToClipboard() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Đã sao chép: ${textToCopy}`, 'success');
        }).catch(() => {
          showToast('Không thể sao chép tự động. Vui lòng copy thủ công!', 'error');
        });
      }
    });
  });
}

/* ----------------------------------------------------
 * 9. BACK TO TOP BUTTON
 * ---------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ----------------------------------------------------
 * 10. SCROLLSPY (ACTIVE NAV LINK)
 * ---------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-nav');
      }
    });
  });
}

/* ----------------------------------------------------
 * 11. TOAST SYSTEM
 * ---------------------------------------------------- */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgStyles = type === 'success' 
    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-l-4 border-emerald-500'
    : type === 'error'
    ? 'bg-red-600 text-white border-l-4 border-red-800'
    : 'bg-blue-600 text-white border-l-4 border-blue-800';

  toast.className = `toast flex items-center px-4 py-3 rounded-lg shadow-xl text-sm font-medium ${bgStyles}`;
  toast.innerHTML = `
    <span class="mr-2">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}
