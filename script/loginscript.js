// 로그인 처리 함수
function login(event) {
    event.preventDefault();

    const email = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("이메일과 비밀번호를 입력하세요.");
        return;
    }

    const loginData = {
        email: email,
        password: password
    };

    // 로그인 요청 API 호출
    fetch('http://localhost:8080/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        switch (data.code) {
            case 200:
                alert(`환영합니다, ${data.data.nickname}님!`);
                // 로그인 성공 후 토큰 저장
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                // 로그인 성공 시 메인 페이지로 리디렉션
                window.location.href = "videoBoard.html";
                break;

            case 400:
                alert("잘못된 요청입니다. 이메일 또는 비밀번호가 누락되었는지 확인하세요.");
                break;

            case 2106:
                alert("존재하지 않는 계정입니다. 이메일을 다시 확인하세요.");
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

// 모달 열기 함수
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

// 모달 닫기 함수
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// 소셜 로그인 함수 (구글, 카카오)
function socialLogin(provider) {
    alert(provider + " 로그인 기능은 추후 구현됩니다.");
}

// 회원가입 처리 함수
function signup(event) {
    event.preventDefault();

    const nickname = document.getElementById("signupNickname").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirm").value;

    // 비밀번호 유효성 검사
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z\d!@#$%^&*()_+\-=]{8,20}$/;
    if (!passwordPattern.test(password)) {
        alert("비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.");
        return;
    }

    if (password !== confirmPassword) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
    }

    const signupData = {
        nickname,
        email,
        password,
        confirmPassword
    };

    fetch('http://localhost:8080/api/v1/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
    .then(response => response.json())
    .then(data => {
        switch (data.code) {
            case 200:
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                closeModal('signupModal');
                break;

            case 400:
                alert("필수 입력값이 누락되었거나 잘못된 형식입니다.");
                break;

            case 2100:
                alert("이미 사용 중인 이메일입니다.");
                break;

            case 2601:
                alert("비밀번호 형식이 맞지 않습니다.");
                break;

            case 2602:
                alert("비밀번호가 일치하지 않습니다.");
                break;

            case 500:
                alert("서버 오류입니다. 잠시 후 다시 시도해주세요.");
                break;

            default:
                alert(`알 수 없는 오류 (code: ${data.code})`);
                break;
        }
    })
    .catch(error => {
        console.error("회원가입 오류:", error);
        alert("네트워크 오류가 발생했습니다.");
    });
}