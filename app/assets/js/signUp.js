// 頁面初始化
function signUpInit(){
    const singUpAccount = document.getElementById('singUpAccount');
    const singUpPwd = document.getElementById('singUpPwd');
    const checkPwd = document.getElementById('checkPwd');
    const singUpName = document.getElementById('singUpName');
    const signUpMail = document.getElementById('signUpMail');
    const signUpPhone = document.getElementById('signUpPhone');
    const signUpAddress = document.getElementById('signUpAddress');
    const SignUpBT = document.getElementById('SignUpBT');
    const checkPwdErrMSG = document.getElementById('checkPwdErrMSG');
    const sameAccountErrMSG = document.getElementById('sameAccountErrMSG');
    const sameMailErrMSG = document.getElementById('sameMailErrMSG');



    SignUpBT.addEventListener('click',function(){
        if(validSignUp()){
            const member = newMember();
            axios.post('http://localhost:3000/users', member).then(resp=>{
                location.href = 'login.html';
            })
        }
        
    })

}

// 新增會員物件的方法
function newMember(){
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
function validSignUp(){
    if(singUpAccount.value=='' || singUpPwd.value=='' || checkPwd.value=='' || singUpName.value=='' || signUpMail.value=='' || signUpPhone.value=='' || signUpAddress.value==''){
        alert('表單輸入不完整! 請在檢查是否有未填欄位!');
        location.href = 'signUp.html#';
        return false;
    } else if(checkPassword()){
        alert('確認密碼與第一次輸入的密碼不相符!');
        location.href = 'signUp.html#singUpPwd';
        return false;
    } else if(checkAccount()){
        alert('帳號已註冊!');
        location.href = 'signUp.html#singUpAccount';
        return false;
    } else if(chenkMail()){
        alert('信箱已註冊!');
        location.href = 'signUp.html#singUpMail';
        return false;
    } else {
        return true;
    }
}

// 判斷第二次輸入的密碼是否與第一次相同
function checkPassword(){
    checkPwdErrMSG.textContent = '';
    if(singUpPwd.value !== checkPwd.value){
        checkPwdErrMSG.textContent = '請輸入與第一次相同的密碼!';
        return true;
    } else {
        return false;
    }
}

// 判斷帳號是否已註冊
function checkAccount(){
    sameAccountErrMSG.textContent = '';
    axios.get('http://localhost:3000/users').then(resp => {
        console.log(resp.data);
        resp.data.forEach(o=>{
            if(singUpAccount.value == o.account){
                sameAccountErrMSG.textContent = '帳號已註冊! 請直接登入或使用其他帳號!';
                return true;
            } else {
                return false;
            }
        })
    })
}

// 判斷信箱是否已註冊
function chenkMail(){
    sameMailErrMSG.textContent = '';
    axios.get('http://localhost:3000/users').then(resp => {
        console.log(resp.data);
        resp.data.forEach(o=>{
            if(signUpMail.value == o.mail){
                sameMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
                return true;
            } else {
                return false;
            }
        })
    })
}