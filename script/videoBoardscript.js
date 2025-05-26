let currentCategory = '전체';
let currentSort = '최신순';
let currentSearch = '';
let page = 1;
let isLoading = false;
let currentPage = 1;
let itemsPerPage = 12;

  
// 임시 영상 데이터 생성
// const allVideos = Array.from({ length: 15 }).map((_, i) => ({
//   id: i + 1,
//   title: `샘플 영상 ${i + 1}`,
//   views: Math.floor(Math.random() * 10000),
//   date: Date.now() - i * 10000000,
//   category: ['스포츠', '뉴스', '연예', '정치', '예술'][i % 5],
//   isDeepfake: i % 4 === 0,
//   thumbnail: `https://picsum.photos/300/180?random=${i}`,
// })).concat({

// // const allVideos = [
// //   {
//     id: 21,
//     title: "영상 1",
//     views: 100,
//     date: "2025-04-01",
//     category: "스포츠",
//     thumbnail: "https://picsum.photos/300/180?random=201",
//     videoUrl: "videos//1.mp4"
//   },
//   {
//     id: 22,
//     title: '영상 2',
//     views: 6789,
//     date: Date.now() - 500000,
//     category: '스포츠',
//     isDeepfake: true,
//     thumbnail: 'https://picsum.photos/300/180?random=202',
//     videoUrl: "videos//2.mp4"
//   },
//   {
//     id: 23,
//     title: '영상 3',
//     views: 9000,
//     date: Date.now() - 3000000,
//     category: '예술',
//     isDeepfake: false,
//     thumbnail: 'https://picsum.photos/300/180?random=203',
//     videoUrl: "videos//4.mp4"
//   },
//   {
//     id: 24,
//     title: '영상 4',
//     views: 10000,
//     date: Date.now() - 100000,
//     category: '뉴스',
//     isDeepfake: true,
//     thumbnail: 'https://picsum.photos/300/180?random=204',
//     videoUrl: "videos//1.mp4"
//   }
// );






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

      const filtered = allVideos.filter(v => {
        const categoryMatch = currentCategory === '전체' || v.originType === currentCategory;
        const searchMatch = v.title.toLowerCase().includes(currentSearch);
        return categoryMatch && searchMatch;
      });

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
        card.innerHTML = `
          <img src="${video.thumbnailUrl}" alt="썸네일" class="video-thumbnail" />
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">
              조회수 ${video.viewCount}회 · ${timeAgo(new Date(video.uploadTime))}<br>
              ${video.isDeepfake ? '🛑 딥페이크 감지' : '✅ 정상 영상'}
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




//백엔드안사용
// function loadVideos() {
//   if (isLoading) return;
//   isLoading = true;
//   document.getElementById("loading").style.display = "block";

//   setTimeout(() => {
//     const filtered = allVideos.filter(v => {
//       const categoryMatch = currentCategory === '전체' || v.category === currentCategory;
//       const searchMatch = v.title.toLowerCase().includes(currentSearch);
//       return categoryMatch && searchMatch;
//     });

//     const sorted = [...filtered].sort((a, b) => {
//       if (currentSort === '최신순') return b.date - a.date;
//       if (currentSort === '조회수순') return b.views - a.views;
//       return 0;
//     });

//     const perPage = 12;
//     const videos = sorted.slice((page - 1) * perPage, page * perPage);
//     const grid = document.getElementById("videoGrid");
    
//     if (videos.length === 0 && page === 1) {
//         grid.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
//         isLoading = false;
//         document.getElementById("loading").style.display = "none";
//         return; // 더 이상 진행하지 않도록 return
//       }

//     videos.forEach(video => {
//       const card = document.createElement("div");
//       card.className = "video-card";
//       card.innerHTML = `
//         <img src="${video.thumbnail}" alt="썸네일" class="video-thumbnail" />
//         <div class="video-info">
//           <div class="video-title">${video.title}</div>
//           <div class="video-meta">
//             조회수 ${video.views}회 · ${timeAgo(video.date)}<br>
//             ${video.isDeepfake ? '🛑 딥페이크 감지' : '✅ 정상 영상'}
//           </div>
//         </div>
//       `;
//       card.onclick = () => playVideo(video.videoUrl);
//       grid.appendChild(card);
//     });

//     isLoading = false;
//     page++;
//     document.getElementById("loading").style.display = "none";
//   }, 500);
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
