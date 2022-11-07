var swiper = new Swiper(".bannerSwiper", {
  speed:2000,
  loop:true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  effect : 'fade',
  fadeEffect: {
    crossFade: true,
  }
});

var swiper = new Swiper(".worksSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  speed:1000,
  loop: true, 
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints:{
    576:{
      slidesPerView: 2,
    },
    992:{
      slidesPerView: 3,
    },
    1440:{
      slidesPerView: 4,
    }
  }
});

const navMenu =  document.querySelector('#nav-menu');
const navBurger = document.querySelector('#nav-burger');
const navClose = document.querySelector('#nav-burger-close');
const navCover = document.querySelector('#nav-cover');

navMenu.addEventListener('click',function(){
  navBurger.classList.toggle('d-none');
  navClose.classList.toggle('d-none');
  navCover.classList.toggle('h-100');
  navCover.classList.toggle('op20');
});


const navLoginBT = document.querySelector(".navLoginBT"); // 登入按鈕
const navMembereMenuBT = document.querySelector(".navMemberMenuBT"); // 登入後的會員選單按鈕
const backstageManagement = document.querySelector('#backstageManagement'); // 後台管理按鈕
const member = JSON.parse(localStorage.getItem('loginMember')); // 登入的會員

if(localStorage.getItem('loginMember') != null){
  navLoginBT.classList.add('d-none');
  navMembereMenuBT.classList.remove('d-none');
  navMembereMenuBT.textContent = member.name;
  if(member.permission == 'administrator'){
    backstageManagement.classList.remove('d-none')
  }
}else {
  navLoginBT.classList.remove('d-none');
  navMembereMenuBT.classList.add('d-none');
}

navMembereMenuBT.addEventListener('click',function(){
  location.href = 'index.html';
  localStorage.removeItem('loginMember');
})
