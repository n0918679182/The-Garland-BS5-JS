function memberLayoutInit() { 
    let memberPageCode = localStorage.getItem('memberPageCode');    // 取得頁面編號
    // 側邊選單
    const toMemberAccount = document.getElementById('toMemberAccount');
    const toMemberAccountSm = document.getElementById('toMemberAccountSm');

    const toMemberCourse = document.getElementById('toMemberCourse');
    const toMemberCourseSm = document.getElementById('toMemberCourseSm');

    const toMemberOrder = document.getElementById('toMemberOrder');
    const toMemberOrderSm = document.getElementById('toMemberOrderSm');

    const toMeberConsulation = document.getElementById('toMeberConsulation');
    const toMeberConsulationSm = document.getElementById('toMeberConsulationSm');

    if(memberPageCode == 1){
        toMemberAccount.classList.add('onPage');
        toMemberAccountSm.classList.remove('text-dark');
        toMemberAccountSm.classList.add('text-primary');

        toMemberCourse.classList.remove('onPage');
        toMemberCourseSm.classList.add('text-dark');
        toMemberCourseSm.classList.remove('text-primary');

        toMemberOrder.classList.remove('onPage');
        toMemberOrderSm.classList.add('text-dark');
        toMemberOrderSm.classList.remove('text-primary');

        toMeberConsulation.classList.remove('onPage');
        toMeberConsulationSm.classList.add('text-dark');
        toMeberConsulationSm.classList.remove('text-primary');

    } else if(memberPageCode==2){
        toMemberAccount.classList.remove('onPage');
        toMemberAccountSm.classList.add('text-dark');
        toMemberAccountSm.classList.remove('text-primary');

        toMemberCourse.classList.add('onPage');
        toMemberCourseSm.classList.remove('text-dark');
        toMemberCourseSm.classList.add('text-primary');

        toMemberOrder.classList.remove('onPage');
        toMemberOrderSm.classList.add('text-dark');
        toMemberOrderSm.classList.remove('text-primary');

        toMeberConsulation.classList.remove('onPage');
        toMeberConsulationSm.classList.add('text-dark');
        toMeberConsulationSm.classList.remove('text-primary');

    } else if(memberPageCode ==3){
        toMemberAccount.classList.remove('onPage');
        toMemberAccountSm.classList.add('text-dark');
        toMemberAccountSm.classList.remove('text-primary');

        toMemberCourse.classList.remove('onPage');
        toMemberCourseSm.classList.add('text-dark');
        toMemberCourseSm.classList.remove('text-primary');

        toMemberOrder.classList.add('onPage');
        toMemberOrderSm.classList.remove('text-dark');
        toMemberOrderSm.classList.add('text-primary');

        toMeberConsulation.classList.remove('onPage');
        toMeberConsulationSm.classList.add('text-dark');
        toMeberConsulationSm.classList.remove('text-primary');
        
    } else if(memberPageCode==4){
        toMemberAccount.classList.remove('onPage');
        toMemberAccountSm.classList.add('text-dark');
        toMemberAccountSm.classList.remove('text-primary');

        toMemberCourse.classList.remove('onPage');
        toMemberCourseSm.classList.add('text-dark');
        toMemberCourseSm.classList.remove('text-primary');

        toMemberOrder.classList.remove('onPage');
        toMemberOrderSm.classList.add('text-dark');
        toMemberOrderSm.classList.remove('text-primary');

        toMeberConsulation.classList.add('onPage');
        toMeberConsulationSm.classList.remove('text-dark');
        toMeberConsulationSm.classList.add('text-primary');
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