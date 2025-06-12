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

// 섹션 전환 함수
function showSection(id) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === `section-${id}`);
  });
}

// 검색 버튼 클릭 시 검색어 전달 후 이동
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `videoBoard.html?search=${encodeURIComponent(query)}`;
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchButton.click();
  });
}

// 회원정보 조회 API 호출
window.addEventListener('DOMContentLoaded', () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
    return;
  }

  fetch("https://zdznessqpctcnxhj.tunnel.elice.io/api/v1/user/show", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200) {
        const infoBox = document.querySelector("#section-view .info-box");
        infoBox.innerHTML = `
          <p><strong>닉네임:</strong> ${data.data.nickname}</p>
          <p><strong>이메일:</strong> ${data.data.email}</p>

        
          `
          // <p><strong>이메일 인증여부:</strong> ${data.data.verified ? "인증됨" : "미인증"}</p>
          // <p><strong>프로필 이미지:</strong> ${data.data.profileImageUrl || "없음"}</p>
        ;
      } else {
        alert("회원정보를 불러오지 못했습니다. 다시 로그인해주세요.");
        window.location.href = "login.html";
      }
    })
    .catch((err) => {
      console.error("조회 오류:", err);
      alert("회원 정보를 불러오지 못했습니다.");
    });
});

// 회원정보 수정
function updateInfo() {
  const nickname = document.querySelector("#section-edit input[placeholder='닉네임']").value.trim();
  // const email = document.querySelector("#section-edit input[placeholder='전화번호']").value.trim();
  const accessToken = localStorage.getItem("accessToken");

  fetch("https://zdznessqpctcnxhj.tunnel.elice.io/api/v1/user/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ nickname}),
    // body: JSON.stringify({ nickname, email }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200) {
        alert("회원정보가 성공적으로 수정되었습니다.");
        location.reload();
      } else {
        alert(`회원정보 수정 실패 (code: ${data.code})`);
      }
    })
    .catch((err) => {
      console.error("수정 오류:", err);
      alert("회원정보 수정 중 오류가 발생했습니다.");
    });
}

// 회원 탈퇴
function withdrawAccount() {
  const password = document.querySelector("#section-delete input[type='password']").value;
  const accessToken = localStorage.getItem("accessToken");

  if (!password) {
    alert("비밀번호를 입력하세요.");
    return;
  }

  fetch("https://zdznessqpctcnxhj.tunnel.elice.io/api/v1/user/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200) {
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.clear();
        window.location.href = "login.html";
      } else {
        alert(`회원 탈퇴 실패 (code: ${data.code})`);
      }
    })
    .catch((err) => {
      console.error("탈퇴 오류:", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    });
}
