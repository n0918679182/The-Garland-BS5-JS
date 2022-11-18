function adminLayoutInit(){
    const pageCode = localStorage.getItem('pageCode');
    const memberPage = document.getElementById('memberPage');
    const coursePage = document.getElementById('coursePage');
    const ConsultationPage = document.getElementById('ConsultationPage');
    if(pageCode == 0){
      memberPage.classList.remove('onPage');
      coursePage.classList.remove('onPage');
      ConsultationPage.classList.remove('onPage');
    } else if(pageCode == 1){
      memberPage.classList.add('onPage');
      coursePage.classList.remove('onPage');
      ConsultationPage.classList.remove('onPage');
    } else if(pageCode == 2){
      memberPage.classList.remove('onPage');
      coursePage.classList.add('onPage');
      ConsultationPage.classList.remove('onPage');
    } else if(pageCode == 3){
      memberPage.classList.remove('onPage');
      coursePage.classList.remove('onPage');
      ConsultationPage.classList.add('onPage');
    }

    function logout(){
      location.href = 'index.html';
      localStorage.removeItem('loginMember');
    }




    // const memberNavLoginBT = document.querySelector("#member-loginBT"); // 登入按鈕
    // const memberMenuBT = document.querySelector("#member-menuBT"); // 登入後的會員選單按鈕
    // const memberAdminPanel = document.querySelector('#member-adminPanel'); // 後台管理按鈕
    // const theMember = JSON.parse(localStorage.getItem('loginMember')); // 登入的會員

    // if(localStorage.getItem('loginMember') != null){
    //   memberNavLoginBT.classList.add('d-none');
    //   memberMenuBT.classList.remove('d-none');
    //   memberMenuBT.textContent = theMember.name;
    //   if(theMember.permission == 'administrator'){
    //     memberAdminPanel.classList.remove('d-none')
    //   }
    // }else {
    //   memberNavLoginBT.classList.remove('d-none');
    //   memberMenuBT.classList.add('d-none');
    // }





}