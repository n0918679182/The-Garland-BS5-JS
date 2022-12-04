// 頁面初始化
function signUpInit() {
    
    
    
    const SignUpBT = document.getElementById('SignUpBT');



    SignUpBT.addEventListener('click', function () {
        axios.get('http://localhost:3000/users').then(users=>{
            if (validSignUp(users)) {
                const member = newMember();
                axios.post('http://localhost:3000/users', member).then(resp => {
                    location.href = 'login.html';
                })
            }
        })
    })

}

// 新增會員物件的方法
function newMember() {
    let member = {}
    member.id = null;
    member.name = singUpName.value;
    member.account = singUpAccount.value;
    member.password = singUpPwd.value;
    member.mail = signUpMail.value;
    member.phone = signUpPhone.value;
    member.address = signUpAddress.value;
    member.permission = 'commenUser';
    return member;
}

// 註冊表單驗證
function validSignUp(users) {
    const singUpName = document.getElementById('singUpName');
    const signUpPhone = document.getElementById('signUpPhone');
    const signUpAddress = document.getElementById('signUpAddress');
    const singUpAccount = document.getElementById('singUpAccount');
    const sameAccountErrMSG = document.getElementById('sameAccountErrMSG');
    const signUpMail = document.getElementById('signUpMail');
    const sameMailErrMSG = document.getElementById('sameMailErrMSG');
    const singUpPwd = document.getElementById('singUpPwd');
    const checkPwd = document.getElementById('checkPwd');

    let checkAccount = false;
    let chenkMail = false;

    sameAccountErrMSG.textContent = '';
    sameMailErrMSG.textContent = '';

    users.data.forEach(o=>{
        if (singUpAccount.value == o.account) {
            sameAccountErrMSG.textContent = '帳號已註冊! 請直接登入或使用其他帳號!';
            checkAccount = true;
        } else {
            checkAccount = false;
        }
        if (signUpMail.value == o.mail) {
            sameMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
            chenkMail = true;
        } else {
            chenkMail = false;
        }
    })
    if (singUpAccount.value == '' || singUpPwd.value == '' || checkPwd.value == '' || singUpName.value == '' || signUpMail.value == '' || signUpPhone.value == '' || signUpAddress.value == '') {
        alert('表單輸入不完整! 請在檢查是否有未填欄位!');
        location.href = 'signUp.html#';
        return false;
    } else if (checkPassword()) {
        alert('確認密碼與第一次輸入的密碼不相符!');
        location.href = 'signUp.html#singUpPwd';
        return false;
    } else if (checkAccount) {
        alert('帳號已註冊!');
        location.href = 'signUp.html#singUpAccount';
        return false;
    } else if (chenkMail) {
        alert('信箱已註冊!');
        location.href = 'signUp.html#singUpMail';
        return false;
    } else {
        return true;
    }
}

// 判斷第二次輸入的密碼是否與第一次相同
function checkPassword() {
    const singUpPwd = document.getElementById('singUpPwd');
    const checkPwd = document.getElementById('checkPwd');
    const checkPwdErrMSG = document.getElementById('checkPwdErrMSG');

    checkPwdErrMSG.textContent = '';
    if (singUpPwd.value !== checkPwd.value) {
        checkPwdErrMSG.textContent = '請輸入與第一次相同的密碼!';
        return true;
    } else {
        return false;
    }
}

// 判斷帳號是否已註冊
function checkAccount() {
    const singUpAccount = document.getElementById('singUpAccount');
    const sameAccountErrMSG = document.getElementById('sameAccountErrMSG');
    sameAccountErrMSG.textContent = '';
    axios.get('http://localhost:3000/users').then(resp => {
        resp.data.forEach(o => {
            if (singUpAccount.value == o.account) {
                sameAccountErrMSG.textContent = '帳號已註冊! 請直接登入或使用其他帳號!';
                return true;
            } else {
                return false;
            }
        })
    })
}

// 判斷信箱是否已註冊
function chenkMail() {
    const signUpMail = document.getElementById('signUpMail');
    const sameMailErrMSG = document.getElementById('sameMailErrMSG');
    sameMailErrMSG.textContent = '';
    axios.get('http://localhost:3000/users').then(resp => {
        resp.data.forEach(o => {
            if (signUpMail.value == o.mail) {
                sameMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
                return true;
            } else {
                return false;
            }
        })
    })
}