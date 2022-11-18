function memberAccountInit(){
    // 控制左側選單 選中時的效果
    localStorage.setItem("memberPageCode",1);

    const loginMember = JSON.parse(localStorage.getItem('loginMember')); // 取得登入的會員資訊

    // 會員資料表單欄位
    const memberAcc = document.getElementById('memberAcc');
    const memberPwd = document.getElementById('memberPwd');
    const checkMemberPwd = document.getElementById('checkMemberPwd');
    const memberName = document.getElementById('memberName');
    const memberMail = document.getElementById('memberMail');
    const memberPhone = document.getElementById('memberPhone');
    const memberAddress = document.getElementById('memberAddress');
    const updateMemberDetailBT = document.getElementById('updateMemberDetailBT');   // 更新按鈕

    // 渲染表單
    memberAcc.value = loginMember.account;
    memberPwd.value = loginMember.password;
    checkMemberPwd.value = loginMember.password;
    memberName.value = loginMember.name;
    memberMail.value = loginMember.mail;
    memberPhone.value = loginMember.phone;
    memberAddress.value = loginMember.address;

    
    updateMemberDetailBT.addEventListener('click', function(){
        if(updateMemberValid()){
            let data = {}
            data.password = memberPwd.value;
            data.name = memberName.value;
            data.mail = memberMail.value;
            data.phone = memberPhone.value;
            data.address = memberAddress.value;
            axios.patch('http://localhost:3000/users/'+loginMember.id, data).then(resp=>{
                axios.get('http://localhost:3000/users/'+loginMember.id).then(r=>{
                    localStorage.setItem('loginMember',JSON.stringify(r.data));
                    location.href = 'memberAccount.html';
                })
                
            })
        }
    })

    function updateMemberValid(){
        if(memberAcc.value == '' || memberPwd.value == '' || checkMemberPwd.value == '' || memberName.value == '' || memberMail.value == '' || memberPhone.value == '' || memberAddress.value == ''){
            alert('表單輸入不完整! 請在檢查是否有未填欄位!');
            location.href = 'memberAccount.html#';
            return false;
        } else if(chenkMemberMail()){
            alert('信箱已註冊!');
            location.href = 'memberAccount.html#memberMail';
            return false;
        } else if(checkMemberPassword()){
            alert('確認密碼與第一次輸入的密碼不相符!');
            location.href = 'memberAccount.html#memberPwd';
            return false;
        } else {
            return true;
        }
    }
}

// 檢查更新信箱
function chenkMemberMail(){
    const loginMember = JSON.parse(localStorage.getItem('loginMember'));    // 取得登入的會員資料
    const sameMemberMailErrMSG = document.getElementById('sameMemberMailErrMSG'); // 錯誤訊息區塊

    sameMemberMailErrMSG.textContent = '';
    if(loginMember.mail != memberMail.value){
        axios.get('http://localhost:3000/users').then(resp=>{
            resp.data.forEach(o=>{
                if(memberMail.value == o.mail){
                    sameMemberMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
                    return true;
                }else {
                    return false;
                }
            })
        })
    }
}
function checkMemberPassword(){
    const checkMemberPwdErrMSG = document.getElementById('checkMemberPwdErrMSG');
    checkMemberPwdErrMSG.textContent = '';
    if(checkMemberPwd.value !== memberPwd.value){
        checkMemberPwdErrMSG.textContent = '請輸入與第一次相同的密碼!';
        return true;
    }else {
        return false;
    }
}


