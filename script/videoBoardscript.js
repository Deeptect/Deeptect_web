let page = 0;
const itemsPerPage = 50;
let isLoading = false;
let lastPage = false;

function loadVideos() {
  if (isLoading || lastPage) return;

  isLoading = true;
  document.getElementById("loading").style.display = "block";

  fetch(`https://zdznessqpctcnxhj.tunnel.elice.io/api/v1/video/videos?page=${page}&size=${itemsPerPage}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => {
      if (!res.data || !res.data.content) throw new Error("영상 데이터를 불러오지 못했습니다.");

      const videos = res.data.content;
      const grid = document.getElementById("videoGrid");

      if (videos.length === 0 && page === 0) {
        grid.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
        lastPage = true;
        isLoading = false;
        document.getElementById("loading").style.display = "none";
        return;
      }

      videos.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";

        const uploaded = timeAgo(new Date(video.uploadedAt));

        const attentionAvailable = video.attention === true;
        const attentionPred = video.attentionPred ? 1 : 0;
        const attentionDfProbRAW = video.attentionDfProb ?? "-";
        const attentionStatus = attentionAvailable
          ? (video.attentionPred ? "🛑 딥페이크 감지" : "✅ 정상")
          : "❌ 분석 없음";

        const convolutionAvailable = video.convolution === true;
        const convolutionPred = video.convolutionPred ? 1 : 0;
        const convolutionDfProbRAW = video.convolutionDfProb ?? "-";
        const convolutionStatus = convolutionAvailable
          ? (video.convolutionPred ? "🛑 딥페이크 감지" : "✅ 정상")
          : "❌ 분석 없음";

        const attentionDfProb = `${Math.round(attentionDfProbRAW * 100)}%`;
        const convolutionDfProb = `${Math.round(convolutionDfProbRAW * 100)}%`;

        const maxDfProb = Math.max(
          video.attentionDfProbRAW ?? 0,
          video.convolutionDfProbRAW ?? 0
        );
        const percent = Math.round(maxDfProb * 100);
        const scoreColor = percent >= 70 ? "red" : percent >= 40 ? "orange" : "green";

        card.innerHTML = `
          <img src="${video.thumbnailUrl}" alt="썸네일" class="video-thumbnail" />
          <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-meta">
              📅 ${uploaded}<br><br>

              <strong>🧠 Attention 분석</strong><br>
              상태: ${attentionStatus}<br>
              <!-- 딥페이크 여부: ${attentionPred}<br>-->
              딥페이크 확률: ${attentionDfProb}<br><br>

              <strong>⚡ Convolution 분석</strong><br>
              상태: ${convolutionStatus}<br>
              <!--딥페이크 여부: ${convolutionPred}<br>-->
              딥페이크 확률: ${convolutionDfProb}<br><br>

              <!-- <span style="color: ${scoreColor}; font-weight: bold;">
                ▶ 최대 딥페이크 확률: ${percent}%
              </span> -->
            </div>
          </div>
        `;
        card.onclick = () => playVideo(video.videoUrl);
        grid.appendChild(card);
      });

      lastPage = res.data.last || false;
      if (!lastPage) page++;

      isLoading = false;
      document.getElementById("loading").style.display = "none";
    })
    .catch(err => {
      console.error("영상 로딩 실패:", err);
      isLoading = false;
      document.getElementById("loading").style.display = "none";
    });
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

function resetVideos() {
  document.getElementById("videoGrid").innerHTML = '';
  page = 0;
  lastPage = false;
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
  document.getElementById('closeModal').addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById("videoModal")) {
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
  video.src = "";
  modal.style.display = "none";
}
