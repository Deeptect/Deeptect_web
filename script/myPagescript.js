function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (section.id === `section-${id}`) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
}
  
  function updateInfo() {
    alert("회원정보가 수정되었습니다.");
    // 실제 API 연동은 백엔드와 연결 필요
  }
  
  function withdrawAccount() {
    const confirmWithdraw = confirm("정말 회원 탈퇴하시겠습니까?");
    if (confirmWithdraw) {
      alert("회원 탈퇴가 완료되었습니다.");
      // 실제 API 연동은 백엔드와 연결 필요
    }
  }
  