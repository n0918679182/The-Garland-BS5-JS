function memberLayoutInit() { 
    let memberPageCode = localStorage.getItem('memberPageCode');    // 取得頁面編號
    // 側邊選單
    const toMemberAccount = document.getElementById('toMemberAccount');
    const toMemberCourse = document.getElementById('toMemberCourse');
    const toMemberAccountSm = document.getElementById('toMemberAccountSm');
    const toMemberCourseSm = document.getElementById('toMemberCourseSm');

    if(memberPageCode == 1){
        toMemberAccount.classList.add('onPage');
        toMemberAccountSm.classList.remove('text-dark');
        toMemberAccountSm.classList.add('text-primary');
        toMemberCourse.classList.remove('onPage');
        toMemberCourseSm.classList.add('text-dark');
        toMemberCourseSm.classList.remove('text-primary');

    } else if(memberPageCode==2){
        toMemberAccount.classList.remove('onPage');
        toMemberAccountSm.classList.add('text-dark');
        toMemberAccountSm.classList.remove('text-primary');
        toMemberCourse.classList.add('onPage');
        toMemberCourseSm.classList.remove('text-dark');
        toMemberCourseSm.classList.add('text-primary');
    }


    var swiper = new Swiper(".memberNavSwiper", {
        slidesPerView: 5,
        spaceBetween: 10,
        freeMode: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints:{
            576:{
              slidesPerView: 5,
            },
            992:{
              slidesPerView: 6,
            }
        }
    });
 }

 // 登出
 function logout(){
    location.href = 'index.html';
    localStorage.removeItem('loginMember');
 }