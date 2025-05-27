let currentSort = '최신순';
let currentSearch = '';
let page = 1;
let isLoading = false;
let itemsPerPage = 12;

function loadVideos() {
  if (isLoading) return;
  isLoading = true;
  document.getElementById("loading").style.display = "block";

  fetch(`http://localhost:8080/api/v1/video/videos?page=${page}&size=${itemsPerPage}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      const allVideos = data.content || [];

      // 검색어 필터링
      const filtered = allVideos.filter(v => {
        return v.title.toLowerCase().includes(currentSearch);
      });

      // 정렬
      const sorted = [...filtered].sort((a, b) => {
        if (currentSort === '최신순') return new Date(b.uploadTime) - new Date(a.uploadTime);
        if (currentSort === '조회수순') return b.viewCount - a.viewCount;
        return 0;
      });

      const grid = document.getElementById("videoGrid");

      if (sorted.length === 0 && page === 1) {
        grid.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
        isLoading = false;
        document.getElementById("loading").style.display = "none";
        return;
      }

      sorted.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";

        const score = video.detectionScore;
        const isFake = score >= 50;

        card.innerHTML = `
          <img src="${video.thumbnailUrl}" alt="썸네일" class="video-thumbnail" />
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">
              조회수 ${video.viewCount}회 · ${timeAgo(new Date(video.uploadTime))}<br>
              감지 점수: ${score}% ${isFake ? '🛑 딥페이크 의심' : '✅ 정상 영상'}
            </div>
          </div>
        `;
        card.onclick = () => playVideo(video.storageUrl);
        grid.appendChild(card);
      });

      isLoading = false;
      page++;
      document.getElementById("loading").style.display = "none";
    })
    .catch(err => {
      console.error("영상 로딩 실패:", err);
      isLoading = false;
      document.getElementById("loading").style.display = "none";
    });
}

// 모달 재생
function playVideo(url) {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");

  video.src = url;
  modal.style.display = "flex";
}

// 모달 닫기
function closeModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");

  video.pause();
  video.currentTime = 0;
  video.src = "";
  modal.style.display = "none";
}

// 시간 포맷 함수
function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// 정렬/검색 관련
function setSort(sort) {
  currentSort = sort;
  resetVideos();
}

function searchVideos() {
  currentSearch = document.getElementById("searchInput").value.trim().toLowerCase();
  resetVideos();
}

function resetFilters() {
  currentSort = '최신순';
  currentSearch = '';
  document.getElementById("searchInput").value = '';
  resetVideos();
}

function resetVideos() {
  document.getElementById("videoGrid").innerHTML = '';
  page = 1;
  loadVideos();
}

// 무한 스크롤
window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    loadVideos();
  }
});

// 초기화
window.onload = () => {
  loadVideos();
  document.getElementById('closeModal').addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    const modal = document.getElementById("videoModal");
    if (e.target === modal) closeModal();
  });
};

// 검색 이벤트
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchVideos);
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') searchVideos();
});

// 로그아웃
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  alert('로그아웃 되었습니다.');
  window.location.href = 'login.html';
}
