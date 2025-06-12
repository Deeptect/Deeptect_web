let attentionResult = null;
let convolutionResult = null;

document.addEventListener("DOMContentLoaded", () => {
  const videoInput = document.getElementById("video");
  const preview = document.getElementById("preview");
  const detectBtnAttention = document.getElementById("detectBtnAttention");
  const detectBtnConvolution = document.getElementById("detectBtnConvolution");
  const uploadBtn = document.getElementById("uploadBtn");

  videoInput.addEventListener("change", () => {
    const file = videoInput.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.style.display = "block";
      attentionResult = null;
      convolutionResult = null;
      document.getElementById("status").textContent = "영상이 선택되었습니다. 분석을 진행해주세요.";
    }
  });

  detectBtnAttention.addEventListener("click", () => analyze("attention"));
  detectBtnConvolution.addEventListener("click", () => analyze("convolution"));

  uploadBtn.addEventListener("click", () => {
    if (!attentionResult || !convolutionResult) {
      alert("두 모델의 분석이 모두 완료되어야 업로드할 수 있습니다.");
      return;
    }
    uploadResults();
  });
});

async function analyze(type) {
  const videoInput = document.getElementById("video");
  const videoFile = videoInput.files[0];
  if (!videoFile) return alert("영상 파일을 선택해주세요.");

  const formData = new FormData();
  formData.append("video", videoFile);

  const accessToken = localStorage.getItem("accessToken");
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = `${type} 분석 중...`;

  try {
    const res = await fetch(`https://zdznessqpctcnxhj.tunnel.elice.io/api/v1/video/analysis/${type}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });

    const json = await res.json();
    const result = json.result || json.data || json;

    if (type === "attention") {
      attentionResult = result;
    } else {
      convolutionResult = result;
    }

    if (attentionResult && convolutionResult) {
      updateResultDisplay(attentionResult, convolutionResult);
    }
  } catch (err) {
    console.error(`${type} 분석 실패`, err);
    statusDiv.textContent = `❌ ${type} 분석 중 오류 발생`;
    statusDiv.style.color = "#d32f2f";
  }
}

async function uploadResults() {
  const videoInput = document.getElementById("video");
  const title = document.getElementById("videoTitle")?.innerText || "Untitled";
  const videoFile = videoInput.files[0];
  const accessToken = localStorage.getItem("accessToken");
  const uploadBtn = document.getElementById("uploadBtn");
  const statusDiv = document.getElementById("status");

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("title", title);
  formData.append("category", "뉴스");

  formData.append("attention", true);
  formData.append("attention_pred", attentionResult.prediction ?? false);
  formData.append("attention_og_prob", attentionResult.original_prob ?? 0.0);
  formData.append("attention_df_prob", attentionResult.deepfake_prob ?? 0.0);

  formData.append("convolution", true);
  formData.append("convolution_pred", convolutionResult.prediction ?? false);
  formData.append("convolution_og_prob", convolutionResult.original_prob ?? 0.0);
  formData.append("convolution_df_prob", convolutionResult.deepfake_prob ?? 0.0);

  statusDiv.textContent = "영상 업로드 중...";
  statusDiv.style.color = "#ffffff";

  try {
    const res = await fetch("https://zdznessqpctcnxhj.tunnel.elice.io/api/v1/video/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData
    });

    if (!res.ok) throw new Error("업로드 실패");

    statusDiv.textContent = "✅ 업로드 성공!";
    statusDiv.style.color = "#4ade80";
    uploadBtn.textContent = "✅ 업로드 완료!";
    uploadBtn.style.background = "linear-gradient(135deg, #4ade80, #22c55e)";
  } catch (err) {
    console.error("업로드 오류:", err);
    statusDiv.textContent = "❌ 업로드 실패: " + err.message;
    statusDiv.style.color = "#d32f2f";
  }
}
