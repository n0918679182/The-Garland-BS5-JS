"use strict";

var swiper = new Swiper(".bannerSwiper", {
  speed: 2000,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  }
});
var swiper = new Swiper(".worksSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  speed: 1000,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    576: {
      slidesPerView: 2
    },
    992: {
      slidesPerView: 3
    },
    1440: {
      slidesPerView: 4
    }
  }
});
var navMenu = document.querySelector('#nav-menu');
var navBurger = document.querySelector('#nav-burger');
var navClose = document.querySelector('#nav-burger-close');
var navCover = document.querySelector('#nav-cover');
navMenu.addEventListener('click', function () {
  navBurger.classList.toggle('d-none');
  navClose.classList.toggle('d-none');
  navCover.classList.toggle('h-100');
  navCover.classList.toggle('op20');
}); // const courseIntro = document.querySelector('#intro-tab');
// const courseTable = document.querySelector('#courseTable-tab');
// courseIntro.addEventListener('click',function(){
//   courseIntro.classList.add('courseIntroOutline');
//   courseTable.classList.remove('courseTableOutline');
// })
// courseTable.addEventListener('click',function(){
//   courseIntro.classList.remove('courseIntroOutline');
//   courseTable.classList.add('courseTableOutline');
// })
//# sourceMappingURL=all.js.map
