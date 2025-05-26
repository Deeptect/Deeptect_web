const form = document.getElementById("uploadForm");
const videoInput = document.getElementById("video");
const thumbnailInput = document.getElementById("thumbnail");
const preview = document.getElementById("preview");
const thumbPreview = document.getElementById("thumbnailPreview");
const detectBtn = document.getElementById("detectBtn");
const submitBtn = document.getElementById("submitBtn");
const statusDiv = document.getElementById("status");
const placeholder = document.querySelector(".thumbnail-placeholder");

let uploadedVideoUrl = "";
let isDeepfake = null;
let generatedThumbnail = null;

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = "block";
    thumbPreview.style.display = "none";
    placeholder.style.display = "block";
    uploadedVideoUrl = "";
    isDeepfake = null;
    submitBtn.disabled = false;  // Deepfake 여부와 관계없이 버튼 활성화
  }
});

thumbnailInput.addEventListener("change", () => {
  const file = thumbnailInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      thumbPreview.src = reader.result;
      thumbPreview.style.display = "block";
      placeholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    thumbPreview.style.display = "none";
    placeholder.style.display = "block";
  }
});

function generateThumbnailFromVideo(videoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
}

detectBtn.addEventListener("click", () => {
  const videoFile = videoInput.files[0];
  if (!videoFile) return alert("영상을 선택해주세요.");

  statusDiv.textContent = "서버에 영상 업로드 및 Deepfake 감지 중...";

  setTimeout(() => {
    const result = Math.random() < 0.5 ? 0 : 1;
    isDeepfake = result;

    if (result === 1) {
      statusDiv.textContent = "⚠️ Deepfake 영상으로 감지되었습니다. 업로드는 가능하지만, 서버에선 감지된 상태로 처리됩니다.";
    } else {
      statusDiv.textContent = "✅ 정상 영상입니다. 업로드 가능합니다.";
    }

    // 썸네일이 없을 경우 첫 프레임으로 썸네일을 생성
    if (!thumbnailInput.files.length) {
      preview.addEventListener("loadeddata", () => {
        generatedThumbnail = generateThumbnailFromVideo(preview);
        thumbPreview.src = generatedThumbnail;
        thumbPreview.style.display = "block";
        placeholder.style.display = "none";
      }, { once: true });
    }
  }, 1000);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 기존의 "Deepfake 감지를 먼저 통과해야 합니다." 메시지 제거
  if (!uploadedVideoUrl && isDeepfake === null) {
    return alert("Deepfake 감지 후 업로드를 진행해주세요.");
  }

  const metadata = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value || "없음",
    videoUrl: "임시_URL",
    views: 0,
    isDeepfake: isDeepfake !== null ? isDeepfake : false, // Deepfake 감지 여부를 서버에 전송
    thumbnailBase64: null
  };

  if (thumbnailInput.files.length) {
    const reader = new FileReader();
    reader.onload = async () => {
      metadata.thumbnailBase64 = reader.result;
      await uploadPost(metadata);
    };
    reader.readAsDataURL(thumbnailInput.files[0]);
  } else {
    metadata.thumbnailBase64 = generatedThumbnail;
    await uploadPost(metadata);
  }
});

async function uploadPost(data) {
  const payload = {
    id: Date.now(), // 임시 ID
    title: data.title,
    views: data.views,
    date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
    category: data.category,
    isDeepfake: data.isDeepfake.toString(), // "true" 또는 "false" 문자열로
    thumbnail: data.thumbnailBase64, // base64 or URL
    videoUrl: data.videoUrl
  };

  try {
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("게시물 업로드 실패");

    statusDiv.textContent = "업로드 성공!";
    statusDiv.style.color = "#4caf50"; // 성공 메시지는 초록색
    form.reset();
    preview.style.display = "none";
    thumbPreview.style.display = "none";
    submitBtn.disabled = true;
  } catch (err) {
    statusDiv.textContent = "업로드 실패: " + err.message;
    statusDiv.style.color = "#d32f2f"; // 실패 메시지는 빨간색
  }
}

document.getElementById('searchButton').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput').value;
  if (searchInput.trim() !== '') {
    window.location.href = `videoBoard.html?search=${encodeURIComponent(searchInput)}`;
  }
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('searchButton').click();
  }
});
