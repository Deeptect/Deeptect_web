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

// 추가: 검색 버튼 눌렀을 때 videoBoard.html로 이동하면서 검색어 넘기기
document.getElementById('searchButton').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput').value;
  if (searchInput.trim() !== '') {
    window.location.href = `videoBoard.html?search=${encodeURIComponent(searchInput)}`;
  }
});

// 추가: 엔터키로도 검색 가능
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchButton').click();
  }
});
