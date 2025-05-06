// 최초 진입 시 사용자 정보 조회
function fetchUserInfo() {
  const accessToken = localStorage.getItem('accessToken');  // 로컬 스토리지에서 토큰 가져오기

  if (!accessToken) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";  // 로그인 페이지로 리다이렉트
      return;
  }

  // 사용자 정보 요청
  fetch('/api/v1/user/show', {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`  // Authorization 헤더에 토큰 포함
      }
  })
  .then(response => response.json())
  .then(data => {
      switch (data.code) {
          case 200:
              document.getElementById("nickname").textContent = data.data.nickname;
              document.getElementById("email").textContent = data.data.email;
              document.getElementById("profileImage").src = data.data.profileImageUrl || "defaultProfile.jpg";
              document.getElementById("verified").textContent = data.data.verified ? "인증됨" : "미인증";
              break;

          case 401:
              alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
              window.location.href = "login.html";
              break;

          case 500:
              alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
              break;

          default:
              alert(`알 수 없는 오류 (code: ${data.code})`);
              break;
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("네트워크 오류가 발생했습니다.");
  });
}

// 마이페이지 회원정보 수정
function updateUserInfo(event) {
  event.preventDefault();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";  // 로그인 페이지로 리다이렉트
      return;
  }

  const updatedInfo = {
      nickname: document.getElementById("editNickname").value,
      email: document.getElementById("editEmail").value,
      profileImageUrl: document.getElementById("editProfileImage").value
  };

  fetch('/api/v1/user/update', {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(updatedInfo)
  })
  .then(response => response.json())
  .then(data => {
      if (data.code === 200) {
          alert("회원정보가 수정되었습니다.");
          fetchUserInfo();  // 수정된 정보 다시 조회
      } else {
          alert(`오류: ${data.message}`);
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("네트워크 오류가 발생했습니다.");
  });
}

// 마이페이지 회원 탈퇴
function withdrawAccount(event) {
  event.preventDefault();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";  // 로그인 페이지로 리다이렉트
      return;
  }

  const password = document.getElementById("withdrawPassword").value;

  fetch('/api/v1/user/delete', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.code === 200) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = "login.html";
      } else {
          alert(`오류: ${data.message}`);
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("네트워크 오류가 발생했습니다.");
  });
}
