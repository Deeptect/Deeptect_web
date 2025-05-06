// 페이지 로드 시 로그인 상태 확인
document.addEventListener("DOMContentLoaded", function() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "index.html"; // 로그인 페이지로 리디렉션
    } else {
        // 로그인된 상태로 처리할 내용
        fetchUserInfo(accessToken);
    }
});

function fetchUserInfo(token) {
    fetch('/api/v1/user/show', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log("로그인한 사용자 정보:", data.data);
            // 사용자 정보 처리 (예: 닉네임 표시)
        } else {
            alert("사용자 정보를 가져오는 데 실패했습니다.");
        }
    })
    .catch(error => {
        console.error("사용자 정보 조회 오류:", error);
        alert("사용자 정보를 가져오는 데 문제가 발생했습니다.");
    });
}