function memberLayoutInit() { 
    let memberPageCode = localStorage.getItem('memberPageCode');    // 取得頁面編號
    // 側邊選單
    const toMemberAccount = document.getElementById('toMemberAccount');
    const toMemberCourse = document.getElementById('toMemberCourse');

    if(memberPageCode == 1){
        toMemberAccount.classList.add('onPage');
        toMemberCourse.classList.remove('onPage');
    } else if(memberPageCode==2){
        toMemberAccount.classList.remove('onPage');
        toMemberCourse.classList.add('onPage');
    }

 }

 // 登出
 function logout(){
    location.href = 'index.html';
    localStorage.removeItem('loginMember');
 }