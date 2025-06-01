let currentCategory = '전체';
let currentSort = '최신순';
let currentSearch = '';
let page = 1;
let isLoading = false;
let currentPage = 1;
let itemsPerPage = 12;


function loadVideos() {
  if (isLoading) return;
  isLoading = true;
  document.getElementById("loading").style.display = "block";

  fetch(`http://localhost:8081/api/v1/video/videos?page=${page}&size=${itemsPerPage}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      console.log("fetch res 확인:", res);
      return res.json(); // JSON 파싱
    })
    .then(data => {
      console.log("받은 data:", data);
      const allVideos = data.data.content || [];

      // 필터: 카테고리 + 검색어
      const filtered = allVideos.filter(v => {
        const categoryMatch = currentCategory === '전체' || v.originType === currentCategory;
        const searchMatch = v.title.toLowerCase().includes(currentSearch);
        return categoryMatch && searchMatch;
      });


      // 정렬: 최신순 또는 조회수순
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

      // 렌더링: 영상 카드 생성
      sorted.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.innerHTML = `
          <img src="${video.thumbnailUrl}" alt="썸네일" class="video-thumbnail" />
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">
              조회수 ${video.viewCount}회 · ${timeAgo(new Date(video.uploadedAt))}<br>
              ${video.isDeepfake ? '🛑 딥페이크 감지' : '✅ 정상 영상'}
            </div>
          </div>
        `;
        card.onclick = () => playVideo(video.videoUrl);
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


// for (let i = 1; i <= 30; i++) {
//   const num = String(i).padStart(3, '0'); // 001, 002, ...
//   const video = document.createElement('video');
//   video.src = `https://pub-82632047d4cb41b3bb0ae6097e6288de.r2.dev/video/${num}.mp4`;
//   video.controls = true;
//   video.autoplay = false;
//   video.muted = false;
//   video.playsInline = true;
//   video.style.width = "320px";
//   video.style.margin = "10px";
//   document.body.appendChild(video);
// }




function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function setCategory(cat) {
  currentCategory = cat;
  resetVideos();
}

function setSort(sort) {
  currentSort = sort;
  resetVideos();
}

function resetFilters() {
  currentCategory = '전체';
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

function searchVideos() {
    currentSearch = document.getElementById("searchInput").value.trim().toLowerCase();
    resetVideos();
  }

function goToUpload() {
  alert('업로드 페이지로 이동 (추후 구현)');
}

function goToMyPage() {
  alert('마이페이지 (추후 구현)');
}

window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    loadVideos();
  }
});

window.onload = () => {
  loadVideos();

  // 모달 닫기 버튼
  document.getElementById('closeModal').addEventListener('click', closeModal);

  // 모달 바깥 클릭 시 닫기
  window.addEventListener('click', (e) => {
    const modal = document.getElementById("videoModal");
    if (e.target === modal) {
      closeModal();
    }
  });
};


const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', searchVideos);
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') searchVideos();
});

function playVideo(url) {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");

  video.src = url;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");

  video.pause();
  video.currentTime = 0;
  video.src = ""; // 영상 중복 방지
  modal.style.display = "none";
}

function renderVideos(videos) {
  const grid = document.getElementById("videoGrid");
  grid.innerHTML = "";
  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}">
      <h3>${video.title}</h3>
    `;
    card.onclick = () => playVideo(video.videoUrl);
    grid.appendChild(card);
  });
  setupVideoModal();
}

// // ✅ 영상 목록 렌더링 시작
// renderVideos(allVideos);

// 모달 관련 스크립트
function setupVideoModal() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeBtn = document.getElementById('closeModal');

  // 각 video-card 클릭 시 모달 열기
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoSrc = card.getAttribute('data-video');
      modalVideo.src = videoSrc;
      modal.style.display = 'flex';
    });
  });

  // 닫기 버튼
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
  });

  // 바깥 영역 클릭 시 모달 닫기
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  });
}
