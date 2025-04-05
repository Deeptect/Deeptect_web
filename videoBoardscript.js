let currentCategory = '전체';
let currentSort = '최신순';
let currentSearch = '';
let page = 1;
let isLoading = false;
const sampleVideos = [
    { title: '딥페이크 분석 예시', thumbnail: 'thumb1.jpg', views: 1000, category: 'AI' },
    { title: 'AI 탐지 기술 소개', thumbnail: 'thumb2.jpg', views: 2000, category: '기술' },
    { title: '보안 영상 분석', thumbnail: 'thumb3.jpg', views: 1500, category: '보안' },
  ];
let currentPage = 1;
let itemsPerPage = 12;

  
// 임시 영상 데이터 생성
const allVideos = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  title: `샘플 영상 ${i + 1}`,
  views: Math.floor(Math.random() * 10000),
  date: Date.now() - i * 10000000,
  category: ['스포츠', '뉴스', '연예', '정치', '예술'][i % 5],
  isDeepfake: i % 4 === 0,
  thumbnail: `https://picsum.photos/300/180?random=${i}`,
}));

function loadVideos() {
  if (isLoading) return;
  isLoading = true;
  document.getElementById("loading").style.display = "block";

  setTimeout(() => {
    const filtered = allVideos.filter(v => {
      const categoryMatch = currentCategory === '전체' || v.category === currentCategory;
      const searchMatch = v.title.toLowerCase().includes(currentSearch);
      return categoryMatch && searchMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (currentSort === '최신순') return b.date - a.date;
      if (currentSort === '조회수순') return b.views - a.views;
      return 0;
    });

    const perPage = 12;
    const videos = sorted.slice((page - 1) * perPage, page * perPage);
    const grid = document.getElementById("videoGrid");
    
    if (videos.length === 0 && page === 1) {
        grid.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
        isLoading = false;
        document.getElementById("loading").style.display = "none";
        return; // 더 이상 진행하지 않도록 return
      }

    videos.forEach(video => {
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <img src="${video.thumbnail}" alt="썸네일" class="video-thumbnail" />
        <div class="video-info">
          <div class="video-title">${video.title}</div>
          <div class="video-meta">
            조회수 ${video.views}회 · ${timeAgo(video.date)}<br>
            ${video.isDeepfake ? '🛑 딥페이크 감지' : '✅ 정상 영상'}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    isLoading = false;
    page++;
    document.getElementById("loading").style.display = "none";
  }, 500);
}

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
};

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', searchVideos);
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') searchVideos();
});


