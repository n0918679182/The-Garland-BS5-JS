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
});
var navLoginBT = document.querySelector(".navLoginBT"); // 登入按鈕

var navMembereMenuBT = document.querySelector(".navMemberMenuBT"); // 登入後的會員選單按鈕

var backstageManagement = document.querySelector('#backstageManagement'); // 後台管理按鈕

var member = JSON.parse(localStorage.getItem('loginMember')); // 登入的會員

if (localStorage.getItem('loginMember') != null) {
  navLoginBT.classList.add('d-none');
  navMembereMenuBT.classList.remove('d-none');
  navMembereMenuBT.textContent = member.name;

  if (member.permission == 'administrator') {
    backstageManagement.classList.remove('d-none');
  }
} else {
  navLoginBT.classList.remove('d-none');
  navMembereMenuBT.classList.add('d-none');
}

navMembereMenuBT.addEventListener('click', function () {
  location.href = 'index.html';
  localStorage.removeItem('loginMember');
});
"use strict";

var url = location.href; //取得網址

var articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length)); //取得網址參數並轉成數字

var blogArticalContent = document.querySelector('.blogArticalContent'); //取得html要渲染的div

axios.get('http://localhost:3000/blogArticals').then(function (response) {
  // console.log(response.data);
  blogArticalRender(response.data);
});

function blogArticalRender(aryData) {
  blogArticalContent.innerHTML = "<div class=\"col-lg-8\">\n        <h3 class=\"h4 fw-bolder mb-2 mb-lg-4 text-dark lh-150 ls-2helf\">".concat(aryData[articalNum - 1].title, "</h3>\n        <p class=\"text-dark h7 fsz-lg-16 mb-6 mb-lg-8 ms-1\">By ").concat(aryData[articalNum - 1].author, " | ").concat(aryData[articalNum - 1].releaseDate[0], " | ").concat(aryData[articalNum - 1].tags.join('\ '), "</p>\n        <p class=\"h5 text-dark lh-150 ls-2helf mb-5 mb-lg-8\">").concat(aryData[articalNum - 1].contentOne, "</p>\n        <img class=\"w-100 radious20 mb-5 mb-lg-8\" src=\"assets/images/").concat(aryData[articalNum - 1].contentImg, "\" alt=\"flower\">\n        <p class=\"h5 text-dark lh-150 ls-2helf mb-5 mb-lg-8\">").concat(aryData[articalNum - 1].contentTwo, "</p>\n        <a class=\"h5 text-dark lh-150 ls-2helf articalSource\" href=\"https://esence.travel/essence-experience/flower-art-faq/\">").concat(aryData[articalNum - 1].articalFrom, "</a>\n    </div>"); //渲染
}
"use strict";

var blogContent = document.querySelector('.blogContent'); // 要渲染的div

var blogListtemp = ''; //迴圈暫存字串變數

axios.get('http://localhost:3000/blogArticals').then(function (response) {
  // console.log(response.data);
  blogListRender(response.data);
});

function blogListRender(aryData) {
  aryData.forEach(function (o) {
    blogListtemp += "<div class=\"col-md-6 col-lg-4 mb-11 mb-lg-20 blog-artical radious8\">\n                    <a href=\"blog-artical.html?articalNum=".concat(o.articalNum, "\">\n                        <div class=\"position-relative p-5 mb-5 mb-md-10\">\n                            <div class=\"img-line-x bg-danger\"></div>\n                            <img class=\"w-100 radious20 shadow\" style=\"height: 288px;\" src=\"assets/images/").concat(o.image, "\" alt=\"").concat(o.title, "\">\n                            <div class=\"img-line-y\"></div>\n                            <p class=\"m-0 artical-date\">").concat(o.releaseDate[1], "</p>\n                        </div>\n                        <div class=\"w-100 d-flex flex-column justify-content-between py-1 px-6\" style=\"height: 90px;\">\n                            <h3 class=\"h5 text-dark\">").concat(o.title, "</h3>\n                            <div class=\"d-flex justify-content-end\">\n                                <a href=\"blog-artical.html?articalNum=").concat(o.articalNum, "\">READ MORE</a>\n                            </div>\n                        </div>\n                    </a>\n                </div>");
  });
  blogContent.innerHTML = blogListtemp;
}
"use strict";

var url = location.href;
var articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length)); //取得網址參數並轉成數字

axios.get('http://localhost:3000/courses').then(function (response) {
  console.log(response.data);
  courseDetailRender(response.data);
});
var courseId = document.querySelector('#courseId');
var studName = document.querySelector('#studName');
var studPhoneNum = document.querySelector('#studPhoneNum');
var studMail = document.querySelector('#studMail');
var courseTableBtn = document.querySelector('#courseTableBtn');
courseTableBtn.addEventListener('click', function () {
  var obj = {};
  obj.courseId = courseId.value;
  obj.studName = studName.value;
  obj.studPhoneNum = studPhoneNum.value;
  obj.studMail = studMail.value;
  console.log(obj);
  alert('資料送出成功');
  courseId.value = '';
  studName.value = '';
  studPhoneNum.value = '';
  studMail.value = '';
});

function courseDetailRender(aryData) {
  var titles = document.querySelectorAll('.title-js');
  titles.forEach(function (o) {
    return o.innerHTML = aryData[articalNum].courseName;
  });
  var courseImage = document.querySelector('.courseList-img');
  courseImage.setAttribute('style', "background-image: url('assets/images/".concat(aryData[articalNum].courseImage, "');"));
  var courseBeginDate = document.querySelector('.courseBeginDate');
  courseBeginDate.innerHTML = "\u958B\u8AB2\u65E5\u671F\uFF1A ".concat(aryData[articalNum].courseBeginDate);
  var coursePrice = document.querySelector('.coursePrice');
  coursePrice.innerHTML = "NT$ ".concat(aryData[articalNum].coursePrice);
  var courseStudNum = document.querySelector('.courseStudNum');
  courseStudNum.innerHTML = "\u5DF2\u5831\u540D\u4EBA\u6578 ".concat(aryData[articalNum].courseStud.length, " / ").concat(aryData[articalNum].courseMaximumStud);
  var courseContent = document.querySelector('.courseContent');
  courseContent.innerHTML = aryData[articalNum].courseContent;
}
"use strict";

var screenWidth = window.screen.availWidth; // 獲取螢幕寬度

var courseList = document.querySelector('.course-list');
console.log(courseList);
var over992 = screenWidth >= 992;
var courseListTemp = '';
axios.get('http://localhost:3000/course').then(function (response) {
  console.log(response.data);
  courseListRender(response.data);
});

function courseListRender(aryData) {
  aryData.forEach(function (o) {
    courseListTemp += "<div class=\"row ".concat(o.id % 2 == 0 ? "flex-row" : "flex-row-reverse", " justify-content-center \">\n                            <div class=\"col-11 col-lg-5 mb-8 mb-lg-10 mb-xl-20\">\n                                <div class=\"courseList-img ").concat(o.id % 2 == 0 ? "imgOutline-odd" : "imgOutline-even", "  w-100 radious8 shadow\" style=\"background-image: url('assets/images/").concat(o.courseImage, "');\"></div>\n                            </div>\n                            <div class=\"col-11 col-lg-5 mb-10\">\n                                <div class=\"px-1 d-flex flex-column ").concat(over992 ? o.id % 2 != 0 ? 'align-items-end text-end' : '' : '', "\">\n                                    <h3 class=\"text-dark fw-bold mb-4 mb-xl-10 ls-2helf\">").concat(o.courseName, "</h3>\n                                    <p class=\"text-dark h5 mb-3 mb-xl-6\">\u958B\u8AB2\u65E5\u671F\uFF1A").concat(o.courseBeginDate, "</p>\n                                    <p class=\"text-dark lh-2 mb-5 mb-xl-7\">").concat(o.courseSimpleIntro, "</p>\n                                    <div class=\"btn-big \">\n                                        <a class=\"w-100\"  href=\"course-detail.html?courseNum=").concat(o.id, "\">MORE </a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>");
  });
  courseList.innerHTML = courseListTemp;
}
"use strict";

var account = document.getElementById("account");
var password = document.getElementById("password");
var loginBT = document.getElementById("loginBT");
axios.get('http://localhost:3000/users').then(function (response) {
  console.log(response.data);
  validAccount(response.data);
});

function validAccount(aryData) {
  loginBT.addEventListener("click", function () {
    console.log(account.value);
    console.log(password.value);
    var wrongInput = true;
    aryData.forEach(function (o) {
      if (account.value == o.account) {
        alert('777');

        if (password.value == o.password) {
          wrongInput = false;
          alert('999');
          localStorage.setItem('loginMember', JSON.stringify(o));
          alert('000');
        }
      }
    });

    if (wrongInput) {
      alert("您輸入的帳號或密碼有誤!");
      account.value = "";
      password.value = "";
    } else {
      var member = JSON.parse(localStorage.getItem('loginMember'));
      alert("歡迎 " + member.name + " 登入!"); // location.href = "index.html";
    }
  });
}
//# sourceMappingURL=all.js.map
