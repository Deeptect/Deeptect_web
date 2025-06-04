const videoInput = document.getElementById("video");
const preview = document.getElementById("preview");
const detectBtnAttention = document.getElementById("detectBtnAttention");
const detectBtnConvolution = document.getElementById("detectBtnConvolution");
const submitBtn = document.getElementById("submitBtn");
const statusDiv = document.getElementById("status");
const form = document.getElementById("uploadForm");

let attentionResult = null;
let convolutionResult = null;

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = "block";
    attentionResult = null;
    convolutionResult = null;
    statusDiv.textContent = "영상이 선택되었습니다. 딥페이크 분석을 진행해주세요.";
  }
});

detectBtnAttention.addEventListener("click", () => analyze("attention"));
detectBtnConvolution.addEventListener("click", () => analyze("convolution"));

async function analyze(type) {
  const videoFile = videoInput.files[0];
  const title = document.getElementById("title").value;
  if (!videoFile || !title) return alert("영상과 제목을 모두 입력해주세요.");

  const formData = new FormData();
  formData.append("video", videoFile);

  statusDiv.textContent = `${type} 분석 중...`;

  try {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:3000/api/v1/video/analysis/${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    });

    console.log(`${type} 분석 응답 상태:`, res.status);

    if (!res.ok) {
      const err = await res.json();
      console.error(`${type} 분석 에러:`, err);
      alert(`분석 실패: ${err.message || res.status}`);
      return;
    }

    const json = await res.json();
    console.log(`${type} 분석 응답 데이터:`, json);
    
    // 백엔드 응답 구조에 따라 수정 필요
    const result = json.result || json.data || json;

    if (type === "attention") {
      attentionResult = result;
      console.log("Attention 분석 결과:", attentionResult);
    } else {
      convolutionResult = result;
      console.log("Convolution 분석 결과:", convolutionResult);
    }

    updateStatus();
  } catch (error) {
    console.error(`${type} 분석 중 오류:`, error);
    statusDiv.textContent = `❌ ${type} 분석 실패: ${error.message}`;
    statusDiv.style.color = "#d32f2f";
  }
}

function updateStatus() {
  console.log("updateStatus 호출됨");
  console.log("attentionResult:", attentionResult);
  console.log("convolutionResult:", convolutionResult);

  let html = "";
  
  if (attentionResult) {
    const model = attentionResult.model || "Attention Model";
    const prediction = attentionResult.prediction === true
      ? "딥페이크 영상입니다!"
      : "원본 영상입니다!";
    const originalProbRAW = attentionResult.original_prob || attentionResult.originalProb || attentionResult.original_probability;
    const deepfakeProbRAW = attentionResult.deepfake_prob || attentionResult.deepfakeProb || attentionResult.deepfake_probability;

    const originalProb = `${Math.round(originalProbRAW * 100)}%`;
    const deepfakeProb = `${Math.round(deepfakeProbRAW * 100)}%`;

    html += `✅ 🧠 Attention 분석<br/>`;
    html += `모델: ${model}<br/>`;
    html += `예측 결과: ${prediction}<br/>`;
    html += `원본 확률: ${originalProb}<br/>`;
    html += `딥페이크 확률: ${deepfakeProb}<br/><br/>`;
  }
  
  if (convolutionResult) {
    const model = convolutionResult.model || "Convolution Model";
    const prediction = attentionResult.prediction === true
    ? "딥페이크 영상입니다!"
    : "원본 영상입니다!";
    const originalProbRAW = convolutionResult.original_prob || convolutionResult.originalProb || convolutionResult.original_probability;
    const deepfakeProbRAW = convolutionResult.deepfake_prob || convolutionResult.deepfakeProb || convolutionResult.deepfake_probability;
    
    const originalProb = `${Math.round(originalProbRAW * 100)}%`;
    const deepfakeProb = `${Math.round(deepfakeProbRAW * 100)}%`;

    html += `✅ ⚡ Convolution 분석<br/>`;
    html += `모델: ${model}<br/>`;
    html += `예측 결과: ${prediction}<br/>`;
    html += `원본 확률: ${originalProb}<br/>`;
    html += `딥페이크 확률: ${deepfakeProb}<br/>`;
  }
  
  if (html) {
    const attentionPred = attentionResult?.prediction !== undefined ? attentionResult.prediction : attentionResult?.pred;
    const convolutionPred = convolutionResult?.prediction !== undefined ? convolutionResult.prediction : convolutionResult?.pred;
    // const detected = attentionPred === 1 || convolutionPred === 1;
    console.log(attentionPred)
    console.log(convolutionPred)
    
    let resultText = "✅ 정상 영상입니다";
    if (attentionPred === true && convolutionPred === true) {
      resultText = "🛑 딥페이크";
    } else if (attentionPred === true || convolutionPred === true) {
      resultText = "⚠️ 딥페이크일 가능성이 있습니다";
    }
    html += `<br/><strong>결과: ${resultText}</strong>`;
    
    statusDiv.style.color = "#d6d2d2";
  }
  
  console.log("생성된 HTML:", html);
  statusDiv.innerHTML = html;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!attentionResult || !convolutionResult) {
    alert("두 분석 모두 완료되어야 업로드할 수 있습니다.");
    return;
  }

  const videoFile = videoInput.files[0];
  const title = document.getElementById("title").value;
  // const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("title", title);
  // formData.append("description", description);
  formData.append("category", category);

  formData.append("attention", true); // 또는 false, 실제 값
  formData.append("attention_pred", attentionResult.prediction ?? attentionResult.pred ?? false);
  formData.append("attention_og_prob", attentionResult.original_prob ?? attentionResult.originalProb ?? 0.0);
  formData.append("attention_df_prob", attentionResult.deepfake_prob ?? attentionResult.deepfakeProb ?? 0.0);

  formData.append("convolution", true); // 또는 false
  formData.append("convolution_pred", convolutionResult.prediction ?? convolutionResult.pred ?? false);
  formData.append("convolution_og_prob", convolutionResult.original_prob ?? convolutionResult.originalProb ?? 0.0);
  formData.append("convolution_df_prob", convolutionResult.deepfake_prob ?? convolutionResult.deepfakeProb ?? 0.0);

  statusDiv.textContent = "영상 업로드 중...";

  try {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:3000/api/v1/video/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type을 명시적으로 설정하지 않음 (브라우저가 자동으로 multipart/form-data로 설정)
      },
      body: formData,
    });

    if (!res.ok) throw new Error("업로드 실패");

    statusDiv.textContent = "✅ 업로드 성공!";
    statusDiv.style.color = "#4caf50";

    form.reset();
    preview.style.display = "none";
    attentionResult = null;
    convolutionResult = null;
  } catch (err) {
    console.error("업로드 오류:", err);
    statusDiv.textContent = "❌ 업로드 실패: " + err.message;
    statusDiv.style.color = "#d32f2f";
  }
});