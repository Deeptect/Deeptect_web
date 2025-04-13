function login(event) {
    event.preventDefault();
    const userId = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    if (userId && password) {
        window.location.href = "videoBoard.html"; // 로그인 성공 시 이동
    } else {
        alert("ID와 Password를 입력하세요.");
    }
}

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function socialLogin(provider) {
    alert(provider + " 로그인 기능은 추후 구현됩니다.");
}

function sendVerificationCode() {
    document.getElementById("verifySection").style.display = "block";
    alert("인증코드가 이메일로 발송되었습니다.");
}

function verifyCode() {
    const code = document.getElementById("verificationCode").value;
    if (code === "123456") {
        alert("이메일 인증 완료!");
    } else {
        alert("인증코드가 올바르지 않습니다.");
    }
}

function resendCode() {
    alert("인증코드를 재발송했습니다.");
}

function signup(event) {
    event.preventDefault();

    const id = document.getElementById("signupId").value;
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupConfirm").value;
    const email = document.getElementById("signupEmail").value;

    // 아이디는 영어만 가능
    if (!/^[a-zA-Z]+$/.test(id)) {
        alert("아이디는 영어만 가능합니다.");
        return;
    }

    // 비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z\d!@#$%^&*()_+\-=]{8,20}$/.test(password)) {
        alert("비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자여야 합니다.");
        return;
    }

    if (password !== confirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    // 이메일 중복 체크 (예시)
    if (email === "used@example.com") {
        alert("이미 가입된 이메일입니다.");
        return;
    }

    alert("회원가입 성공!");
    closeModal('signupModal');
}
