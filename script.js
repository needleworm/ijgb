document.addEventListener('DOMContentLoaded', () => {
  // 1. 야간 모드(다크 모드) 토글 로직
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // 저장된 테마 불러오기 또는 시스템 테마 확인
  const savedTheme = localStorage.getItem('nhi-theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('nhi-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('.theme-text');
    
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      text.textContent = '주간 모드';
      themeToggle.title = '주간 모드로 보기';
    } else {
      icon.className = 'fa-solid fa-moon';
      text.textContent = '야간 모드';
      themeToggle.title = '야간 모드로 보기';
    }
  }

  // 2. 숫자 카운트업 애니메이션
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const startCountUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCountUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));

  // 3. 모바일 내비게이션 토글
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // 메뉴 링크 클릭 시 모바일 메뉴 닫기
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. 인터랙티브 4대 핵심업무 탭 기능
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // 5. FAQ 아코디언 토글
  const accordionButtons = document.querySelectorAll('.accordion-btn');

  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');

      // 모두 닫기 (아코디언 모드)
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        const c = i.querySelector('.accordion-content');
        if (c) c.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });

  // 첫 번째 FAQ 열어두기
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    const firstContent = firstAccordion.querySelector('.accordion-content');
    firstAccordion.classList.add('open');
    firstContent.style.maxHeight = firstContent.scrollHeight + 30 + 'px';
  }
});

// 6. 퀴즈 인터랙션
function checkQuiz(isCorrect, buttonElement) {
  const resultDiv = document.getElementById('quizResult');
  const buttons = document.querySelectorAll('.quiz-btn');

  // 모든 버튼 비활성화
  buttons.forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = 'none';
  });

  if (isCorrect) {
    buttonElement.classList.add('correct');
    resultDiv.innerHTML = `<span style="color: #4ade80;"><i class="fa-solid fa-circle-check"></i> 정답입니다! 🎉</span><br><span style="font-size:0.9rem; font-weight:normal; color:#e2e8f0;">NHI는 <strong>National Human Resources Development Institute</strong>의 약자로, 국가 인재 육성을 총괄하는 대한민국 공직 HRD의 중심입니다.</span>`;
  } else {
    buttonElement.classList.add('wrong');
    // 정답 버튼 표시
    buttons[1].classList.add('correct');
    resultDiv.innerHTML = `<span style="color: #fda4af;"><i class="fa-solid fa-circle-xmark"></i> 아쉽지만 오답입니다!</span><br><span style="font-size:0.9rem; font-weight:normal; color:#e2e8f0;">정답은 <strong>2번 National Human Resources Development Institute</strong>입니다.</span>`;
  }
}
