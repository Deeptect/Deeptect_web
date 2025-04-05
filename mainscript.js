window.onload = function () {
    const logo = document.querySelector('.logo');
    const buttons = document.querySelector('.buttons');
  
    // 로고 애니메이션 실행
    logo.style.animation = 'glitch-move 1.5s ease-out forwards';
  
    // 애니메이션 완료 후 버튼 fade-in
    setTimeout(() => {
      buttons.classList.remove('hidden');
      buttons.classList.add('show');
    }, 1600); // 로고 애니메이션이 1.5초니까 그 이후로
  };
  