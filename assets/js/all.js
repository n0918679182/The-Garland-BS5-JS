"use strict";

var updateCourseId; // 儲存點擊編輯後產生的課程id

var deleteCourseId; // 儲存點擊刪除後產生的課程id

function adminCourseInit() {
  // 控制左側選單 選中時的效果
  localStorage.setItem("pageCode", 2); // 所有表單欄位

  var courseName = document.getElementById('courseName');
  var courseRoom = document.getElementById('courseRoom');
  var courseTeacher = document.getElementById('courseTeacher');
  var fileUploader = document.getElementById('file-uploader');
  var courseBeginDate = document.getElementById('courseBeginDate');
  var courseTime = document.getElementById('courseTime');
  var coursePrice = document.getElementById('coursePrice');
  var studLimit = document.getElementById('studLimit');
  var courseSimpleIntro = document.getElementById('courseSimpleIntro');
  var courseContent = document.getElementById('courseContent');
  var courseGuildline = document.getElementById('courseGuildline');
  var modalTitle = document.getElementById('modalTitle'); // model標題

  var cancelBT = document.getElementById('cancelBT'); // 取消按鈕

  var newCourseBT = document.getElementById('newCourseBT'); // 新增課程按鈕

  var updateCourseBT = document.getElementById('updateCourseBT'); // 編輯課程按鈕

  var btnClose = document.querySelector('.btn-close'); // 叉叉按鈕

  var imgName = ''; // 儲存上傳的圖片的變數

  var adminCourseArea = document.getElementById('adminCourseArea'); // 要渲染所有課程的區塊

  var renderAdminCourseTemp = ''; // 儲存渲染的HTML的變數

  var renderUpdateCourseFun; // 儲存axios裡面方法的變數

  var getCourseId; // 儲存axios裡面方法的變數

  var studListBody = document.getElementById('studListBody'); // 要渲染學生名單的區塊
  // 獲取上傳的圖片資訊

  fileUploader.addEventListener('change', function (e) {
    imgName = e.target.files[0].name;
  }); // 新增課程的關閉按鈕

  cancelBT.addEventListener('click', function (e) {
    clearNewCourseTable();
  });
  btnClose.addEventListener('click', function (e) {
    clearNewCourseTable();
  }); // 新增課程

  newCourseBT.addEventListener('click', function (e) {
    var newCourseObj = {};
    newCourseObj.id = null;
    newCourseObj.courseName = courseName.value;
    newCourseObj.courseBeginDate = courseBeginDate.value;
    newCourseObj.courseTime = courseTime.value;
    newCourseObj.coursePlace = courseRoom.value;
    newCourseObj.courseTeacher = courseTeacher.value;
    newCourseObj.courseMaximumStud = studLimit.value;
    newCourseObj.courseState = "未開課";
    newCourseObj.courseImage = imgName;
    newCourseObj.courseSimpleIntro = changeNewLineTag(courseSimpleIntro.value);
    newCourseObj.courseContent = changeNewLineTag(courseContent.value);
    newCourseObj.courseGuildline = changeNewLineTag(courseGuildline.value);
    newCourseObj.coursePrice = coursePrice.value;
    axios.post('http://localhost:3000/courses', newCourseObj).then(function (resp) {
      console.log("123" + resp.data);
    });
    alert('新建成功!');
    btnClose.click();
    location.href = 'admin-course.html';
  }); // 清空新增課程的資料表

  function clearNewCourseTable() {
    courseName.value = "";
    courseRoom.value = "0";
    courseTeacher.value = "0";
    fileUploader.value = "";
    courseBeginDate.value = "";
    courseTime.value = "";
    coursePrice.value = "";
    studLimit.value = "";
    courseSimpleIntro.value = "";
    courseContent.value = "";
    courseGuildline.value = "";
  } // 渲染畫面


  Promise.all([axios.get('http://localhost:3000/courses'), axios.get('http://localhost:3000/courseOrders')]).then(function (response) {
    var courseArray = response[0].data;
    var orderArray = response[1].data;
    renderAdminCourse(courseArray, orderArray);
  }); // 渲染admin課程管理的方法

  function renderAdminCourse(courseArray, orderArray) {
    courseArray.forEach(function (o) {
      renderAdminCourseTemp += "<div class=\"col-4 mb-5\">\n                <div class=\"border border-dark border-2 rounded px-3 py-5\">\n                    <h3 class=\"h5 fw-bolder text-dark mb-8\">".concat(o.courseName, "</h3>\n                    <ul class=\"list-unstyled\">\n                        <li class=\"mb-3\">\u958B\u8AB2\u65E5\u671F\uFF1A ").concat(o.courseBeginDate, "</li>\n                        <li class=\"mb-3\">\u958B\u8AB2\u72C0\u614B\uFF1A ").concat(o.courseState, "</li>\n                        <li class=\"mb-3\">\u5831\u540D\u4EBA\u6578\uFF1A").concat(orderArray.filter(function (a) {
        return a.courseId == o.id;
      }).length, " / ").concat(o.courseMaximumStud, " \u4F4D</li>\n                        <li class=\"mb-3\">\u8B1B\u5E2B\uFF1A ").concat(o.courseTeacher, "</li>\n                        <li>\u6559\u5BA4\uFF1A ").concat(o.coursePlace, "</li>\n                    </ul>\n                    <div class=\"d-flex justify-content-between\">\n                        <div class=\"btn-small\">\n                            <a class=\"w-100 d-none d-lg-flex justify-content-lg-center\" href=\"#\" data-bs-toggle=\"modal\" data-bs-target=\"#courseTable\" onclick=\"updatCourse(").concat(o.id, ")\">\u7DE8\u8F2F\u8AB2\u7A0B</a>\n                        </div>\n                        <div class=\"btn-small\">\n                            <a class=\"w-100 d-none d-lg-flex justify-content-lg-center\" href=\"#\" data-bs-toggle=\"modal\" data-bs-target=\"#staticBackdrop\" onclick=\"getDeleteId(").concat(o.id, ")\">\u522A\u9664\u8AB2\u7A0B</a>\n                        </div>\n                        <div class=\"btn-small\">\n                            <a class=\"w-100 d-none d-lg-flex justify-content-lg-center\" href=\"#\" data-bs-toggle=\"modal\" data-bs-target=\"#studList\" onclick=\"renderStudentList(").concat(o.id, ")\">\u5B78\u54E1\u540D\u55AE</a>\n                        </div>\n                    </div>\n                </div>\n            </div>");
    });
    adminCourseArea.innerHTML = renderAdminCourseTemp;
  } // 更新課程資訊


  updateCourseBT.addEventListener('click', function (e) {
    var data = {};
    data.courseName = courseName.value;
    data.courseBeginDate = courseBeginDate.value;
    data.courseTime = courseTime.value;
    data.coursePlace = courseRoom.value;
    data.courseTeacher = courseTeacher.value;
    data.courseMaximumStud = studLimit.value;
    data.courseImage = imgName == '' ? fileUploader.dataset.imgName : imgName;
    data.courseSimpleIntro = changeNewLineTag(courseSimpleIntro.value);
    data.courseContent = changeNewLineTag(courseContent.value);
    data.courseGuildline = changeNewLineTag(courseGuildline.value);
    data.coursePrice = coursePrice.value;
    axios.patch("http://localhost:3000/courses/" + updateCourseId, data).then(function (res) {
      console.log(res, 'patch');
      location.href = 'admin-course.html';
    });
  });
} // 更新課程資訊


function updatCourse(id) {
  console.log(id);
  updateCourseId = id;
  var fileUploader = document.getElementById('file-uploader');
  axios.get('http://localhost:3000/courses/' + id).then(function (resp) {
    var theCourse = resp.data;
    modalTitle.textContent = "編輯課程";
    updateCourseBT.classList.remove('d-none');
    newCourseBT.classList.add('d-none'); // 將db的資料渲染給表單

    courseName.value = theCourse.courseName;
    courseBeginDate.value = theCourse.courseBeginDate;
    courseTime.value = theCourse.courseTime;
    courseRoom.value = theCourse.coursePlace;
    courseTeacher.value = theCourse.courseTeacher;
    studLimit.value = theCourse.courseMaximumStud; // fileUploader.value = theCourse.courseImage;

    fileUploader.dataset.imgName = theCourse.courseImage;
    courseSimpleIntro.value = changeNewLineTagInHTML(theCourse.courseSimpleIntro);
    courseContent.value = changeNewLineTagInHTML(theCourse.courseContent);
    courseGuildline.value = changeNewLineTagInHTML(theCourse.courseGuildline);
    coursePrice.value = theCourse.coursePrice;
    console.log(fileUploader.dataset.imgName);
  });
} // 將換行符號 \n 改成html標籤


function changeNewLineTag(str) {
  return str.split('\n').join('<br />');
} // 將換行符號 html標籤 改成 \n 


function changeNewLineTagInHTML(str) {
  return str.split('<br />').join('\n');
} // 將id儲存在外部


function getDeleteId(id) {
  deleteCourseId = id;
} // 刪除課程


function deleteCourse() {
  axios["delete"]("http://localhost:3000/courses/" + deleteCourseId).then(function (res) {
    console.log(res, 'patch');
    location.href = 'admin-course.html';
  });
} // 渲染學生名單


function renderStudentList(id) {
  var studListCourseName = document.getElementById('studList-courseName'); // 學生名單的課程標題

  axios.get('http://localhost:3000/courses/' + id).then(function (resp) {
    studListCourseName.textContent = resp.data.courseName;
  });
  Promise.all([axios.get('http://localhost:3000/courseOrders?courseId=' + id), axios.get('http://localhost:3000/users')]).then(function (r) {
    var result = [];
    r[0].data.forEach(function (e) {
      r[1].data.forEach(function (o) {
        if (e.userId == o.id) {
          result.push(o);
        }
      });
    });
    renderStudList(result, id);
  });
} // 渲染學生名單的方法


function renderStudList(ary, courseId) {
  var renderStudListTemp = ''; // 儲存渲染的HTML的變數

  ary.forEach(function (o) {
    renderStudListTemp += "<tr class=\"py-1\">\n                            <td><p class=\"mb-0 mt-2\">".concat(o.name, "</p></td>\n                            <td><p class=\"mb-0 mt-2\">").concat(o.mail, "</p></td>\n                            <td><p class=\"mb-0 mt-2\">").concat(o.phone, "</p></td>\n                            <td>\n                              <div class=\"btn-small\">\n                                  <a class=\"w-100 d-none d-lg-flex justify-content-lg-center\" href=\"#\" onclick=\"deleteStudInCourse(").concat(o.id, ", ").concat(courseId, ")\">\u522A\u9664</a>\n                              </div>\n                            </td>\n                          </tr>");
  });
  studListBody.innerHTML = renderStudListTemp;
} // 刪除課程中的學生


function deleteStudInCourse(id, courseId) {
  console.log(id);
  console.log(courseId);
  axios.get('http://localhost:3000/courseOrders').then(function (resp) {
    resp.data.forEach(function (o) {
      if (o.userId == id && o.courseId == courseId) {
        axios["delete"]("http://localhost:3000/courseOrders/" + o.id).then(function (res) {
          console.log(res, 'patch');
          location.href = 'admin-course.html';
        });
      }
    });
  });
}
"use strict";

function adminLayoutInit() {
  var pageCode = localStorage.getItem('pageCode');
  var memberPage = document.getElementById('memberPage');
  var coursePage = document.getElementById('coursePage');
  var ConsultationPage = document.getElementById('ConsultationPage');

  if (pageCode == 0) {
    memberPage.classList.remove('onPage');
    coursePage.classList.remove('onPage');
    ConsultationPage.classList.remove('onPage');
  } else if (pageCode == 1) {
    memberPage.classList.add('onPage');
    coursePage.classList.remove('onPage');
    ConsultationPage.classList.remove('onPage');
  } else if (pageCode == 2) {
    memberPage.classList.remove('onPage');
    coursePage.classList.add('onPage');
    ConsultationPage.classList.remove('onPage');
  } else if (pageCode == 3) {
    memberPage.classList.remove('onPage');
    coursePage.classList.remove('onPage');
    ConsultationPage.classList.add('onPage');
  }

  function logout() {
    location.href = 'index.html';
    localStorage.removeItem('loginMember');
  } // const memberNavLoginBT = document.querySelector("#member-loginBT"); // 登入按鈕
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
"use strict";
"use strict";

function indexInit() {
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
}

function layoutInit() {
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

  var adminPanel = document.querySelector('#adminPanel'); // 後台管理按鈕

  var member = JSON.parse(localStorage.getItem('loginMember')); // 登入的會員

  if (localStorage.getItem('loginMember') != null) {
    navLoginBT.classList.add('d-none');
    navMembereMenuBT.classList.remove('d-none');
    navMembereMenuBT.textContent = member.name;

    if (member.permission == 'administrator') {
      adminPanel.classList.remove('d-none');
    }
  } else {
    navLoginBT.classList.remove('d-none');
    navMembereMenuBT.classList.add('d-none');
  }
}
"use strict";

function blogArticalInit() {
  var url = location.href; //取得網址

  var articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length)); //取得網址參數並轉成數字

  var blogArticalContent = document.querySelector('.blogArticalContent'); //取得html要渲染的div

  axios.get('http://localhost:3000/blogArticles').then(function (response) {
    // console.log(response.data);
    blogArticalRender(response.data);
  });

  function blogArticalRender(aryData) {
    blogArticalContent.innerHTML = "<div class=\"col-lg-8\">\n            <h3 class=\"h4 fw-bolder mb-2 mb-lg-4 text-dark lh-150 ls-2helf\">".concat(aryData[articalNum - 1].title, "</h3>\n            <p class=\"text-dark h7 fsz-lg-16 mb-6 mb-lg-8 ms-1\">By ").concat(aryData[articalNum - 1].author, " | ").concat(aryData[articalNum - 1].releaseDate[0], " | ").concat(aryData[articalNum - 1].tags.join('\ '), "</p>\n            <p class=\"h5 text-dark lh-150 ls-2helf mb-5 mb-lg-8\">").concat(aryData[articalNum - 1].contentOne, "</p>\n            <img class=\"w-100 radious20 mb-5 mb-lg-8\" src=\"assets/images/").concat(aryData[articalNum - 1].contentImg, "\" alt=\"flower\">\n            <p class=\"h5 text-dark lh-150 ls-2helf mb-5 mb-lg-8\">").concat(aryData[articalNum - 1].contentTwo, "</p>\n            <a class=\"h5 text-dark lh-150 ls-2helf articalSource\" href=\"https://esence.travel/essence-experience/flower-art-faq/\">").concat(aryData[articalNum - 1].articalFrom, "</a>\n        </div>"); //渲染
  }
}
"use strict";

var blogListtemp = ''; //迴圈暫存字串變數

function blogListInit() {
  axios.get('http://localhost:3000/blogArticles').then(function (response) {
    // console.log(response.data);
    blogListRender(response.data);
  });

  function blogListRender(aryData) {
    var blogContent = document.querySelector('.blogContent'); // 要渲染的div

    aryData.forEach(function (o) {
      blogListtemp += "<div class=\"col-md-6 col-lg-4 mb-11 mb-lg-20 blog-artical radious8\">\n                        <a href=\"blog-artical.html?articalNum=".concat(o.articalNum, "\">\n                            <div class=\"position-relative p-5 mb-5 mb-md-10\">\n                                <div class=\"img-line-x bg-danger\"></div>\n                                <img class=\"w-100 radious20 shadow\" style=\"height: 288px;\" src=\"assets/images/").concat(o.image, "\" alt=\"").concat(o.title, "\">\n                                <div class=\"img-line-y\"></div>\n                                <p class=\"m-0 artical-date\">").concat(o.releaseDate[1], "</p>\n                            </div>\n                            <div class=\"w-100 d-flex flex-column justify-content-between py-1 px-6\" style=\"height: 90px;\">\n                                <h3 class=\"h5 text-dark\">").concat(o.title, "</h3>\n                                <div class=\"d-flex justify-content-end\">\n                                    <a href=\"blog-artical.html?articalNum=").concat(o.articalNum, "\">READ MORE</a>\n                                </div>\n                            </div>\n                        </a>\n                    </div>");
    });
    blogContent.innerHTML = blogListtemp;
  }
}
"use strict";

function courseDetailInit() {
  var url = location.href;
  var articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length)); //取得網址參數並轉成數字

  axios.get('http://localhost:3000/courses').then(function (response) {
    // 渲染表單選項
    axios.get('http://localhost:3000/courses').then(function (resp) {
      resp.data.forEach(function (o) {
        courseId.options.add(new Option(o.courseName, o.id - 1));
      });
      courseDetailRender(response.data);
    });
  });
  axios.get("http://localhost:3000/courseOrders?courseId=".concat(articalNum + 1)).then(function (response) {
    var member = JSON.parse(localStorage.getItem('loginMember'));
    var courseStud = document.querySelector('.courseStud');
    courseStud.textContent = response.data.length;
  });
  var courseId = document.querySelector('#courseId');
  var studName = document.querySelector('#studName');
  var studPhoneNum = document.querySelector('#studPhoneNum');
  var studMail = document.querySelector('#studMail');
  var courseTableBtn = document.querySelector('#courseTableBtn');
  var member = JSON.parse(localStorage.getItem('loginMember'));

  if (localStorage.getItem('loginMember') != null) {
    studName.value = member.name;
    studPhoneNum.value = member.phone;
    studMail.value = member.mail;
  } // 渲染頁面的方法


  function courseDetailRender(aryData) {
    courseId.value = articalNum;
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
    var courseLimit = document.querySelector('.courseLimit');
    courseLimit.textContent = aryData[articalNum].courseMaximumStud;
    var courseContent = document.querySelector('.courseContent');
    courseContent.innerHTML = aryData[articalNum].courseContent;
  } // 送出課程訂單


  courseTableBtn.addEventListener('click', function () {
    // 先判定是否有欄位未填
    if (courseId.value == '' || studName.value == '' || studPhoneNum.value == '' || studMail.value == '') {
      alert('表單輸入不完全');
    } else {
      // 判斷是否有登入
      if (member == null) {
        alert('請先登入喔!');
        location.href = 'login.html';
      } else {
        var obj = {};
        obj.id = null;
        obj.userId = member.id;
        obj.courseId = parseInt(courseId.value) + 1; // 取得所有課程訂單

        axios.get('http://localhost:3000/courseOrders?userId=' + member.id).then(function (resp) {
          // 判斷該位學員是否已經報名過了
          var alreadyHaveCourse = false;
          resp.data.forEach(function (o) {
            if (o.courseId == parseInt(courseId.value) + 1) {
              alreadyHaveCourse = true;
            }
          }); // 如果已經報名過了

          if (alreadyHaveCourse) {
            alert('課程已經報名過了喔~不要重複報名!');
            courseId.value = '';
            studName.value = '';
            studPhoneNum.value = '';
            studMail.value = '';
          } else {
            // 送出表單
            axios.post('http://localhost:3000/courseOrders', obj).then(function (resp) {
              console.log("123" + resp.data);
            });
            alert('資料送出成功');
          }

          location.href = 'course-list.html';
        });
      }
    }
  });
}
"use strict";

function courseListInit() {
  var screenWidth = window.screen.availWidth; // 獲取螢幕寬度

  var courseList = document.querySelector('.course-list');
  var over992 = screenWidth >= 992;
  var courseListTemp = '';
  axios.get('http://localhost:3000/courses').then(function (response) {
    courseListRender(response.data);
  });

  function courseListRender(aryData) {
    aryData.forEach(function (o) {
      courseListTemp += "<div class=\"row ".concat(o.id % 2 == 0 ? "flex-row" : "flex-row-reverse", " justify-content-center \">\n                            <div class=\"col-11 col-lg-5 mb-8 mb-lg-10 mb-xl-20\">\n                                <div class=\"courseList-img ").concat(o.id % 2 == 0 ? "imgOutline-odd" : "imgOutline-even", "  w-100 radious8 shadow\" style=\"background-image: url('assets/images/").concat(o.courseImage, "');\"></div>\n                            </div>\n                            <div class=\"col-11 col-lg-5 mb-10\">\n                                <div class=\"px-1 d-flex flex-column ").concat(over992 ? o.id % 2 != 0 ? 'align-items-end text-end' : '' : '', "\">\n                                    <h3 class=\"text-dark fw-bold mb-4 mb-xl-10 ls-2helf\">").concat(o.courseName, "</h3>\n                                    <p class=\"text-dark h5 mb-3 mb-xl-6\">\u958B\u8AB2\u65E5\u671F\uFF1A").concat(o.courseBeginDate, "</p>\n                                    <p class=\"text-dark lh-2 mb-5 mb-xl-7\">").concat(o.courseSimpleIntro, "</p>\n                                    <div class=\"btn-big \">\n                                        <a class=\"w-100\"  href=\"course-detail.html?id=").concat(o.id - 1, "\">MORE </a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>");
    });
    courseList.innerHTML = courseListTemp;
  }
}
"use strict";

function loginInit() {
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
          if (password.value == o.password) {
            wrongInput = false;
            localStorage.setItem('loginMember', JSON.stringify(o));
          }
        }
      });

      if (wrongInput) {
        alert("您輸入的帳號或密碼有誤!");
        account.value = "";
        password.value = "";
      } else {
        var member = JSON.parse(localStorage.getItem('loginMember'));
        alert("歡迎 " + member.name + " 登入!");
        location.href = "index.html";
      }
    });
  }
}
"use strict";

function memberAccountInit() {
  // 控制左側選單 選中時的效果
  localStorage.setItem("memberPageCode", 1);
  var loginMember = JSON.parse(localStorage.getItem('loginMember')); // 取得登入的會員資訊
  // 會員資料表單欄位

  var memberAcc = document.getElementById('memberAcc');
  var memberPwd = document.getElementById('memberPwd');
  var checkMemberPwd = document.getElementById('checkMemberPwd');
  var memberName = document.getElementById('memberName');
  var memberMail = document.getElementById('memberMail');
  var memberPhone = document.getElementById('memberPhone');
  var memberAddress = document.getElementById('memberAddress');
  var updateMemberDetailBT = document.getElementById('updateMemberDetailBT'); // 更新按鈕
  // 渲染表單

  memberAcc.value = loginMember.account;
  memberPwd.value = loginMember.password;
  checkMemberPwd.value = loginMember.password;
  memberName.value = loginMember.name;
  memberMail.value = loginMember.mail;
  memberPhone.value = loginMember.phone;
  memberAddress.value = loginMember.address;
  updateMemberDetailBT.addEventListener('click', function () {
    if (updateMemberValid()) {
      var data = {};
      data.password = memberPwd.value;
      data.name = memberName.value;
      data.mail = memberMail.value;
      data.phone = memberPhone.value;
      data.address = memberAddress.value;
      axios.patch('http://localhost:3000/users/' + loginMember.id, data).then(function (resp) {
        axios.get('http://localhost:3000/users/' + loginMember.id).then(function (r) {
          localStorage.setItem('loginMember', JSON.stringify(r.data));
          location.href = 'memberAccount.html';
        });
      });
    }
  });

  function updateMemberValid() {
    if (memberAcc.value == '' || memberPwd.value == '' || checkMemberPwd.value == '' || memberName.value == '' || memberMail.value == '' || memberPhone.value == '' || memberAddress.value == '') {
      alert('表單輸入不完整! 請在檢查是否有未填欄位!');
      location.href = 'memberAccount.html#';
      return false;
    } else if (chenkMemberMail()) {
      alert('信箱已註冊!');
      location.href = 'memberAccount.html#memberMail';
      return false;
    } else if (checkMemberPassword()) {
      alert('確認密碼與第一次輸入的密碼不相符!');
      location.href = 'memberAccount.html#memberPwd';
      return false;
    } else {
      return true;
    }
  }
} // 檢查更新信箱


function chenkMemberMail() {
  var loginMember = JSON.parse(localStorage.getItem('loginMember')); // 取得登入的會員資料

  var sameMemberMailErrMSG = document.getElementById('sameMemberMailErrMSG'); // 錯誤訊息區塊

  sameMemberMailErrMSG.textContent = '';

  if (loginMember.mail != memberMail.value) {
    axios.get('http://localhost:3000/users').then(function (resp) {
      resp.data.forEach(function (o) {
        if (memberMail.value == o.mail) {
          sameMemberMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
          return true;
        } else {
          return false;
        }
      });
    });
  }
}

function checkMemberPassword() {
  var checkMemberPwdErrMSG = document.getElementById('checkMemberPwdErrMSG');
  checkMemberPwdErrMSG.textContent = '';

  if (checkMemberPwd.value !== memberPwd.value) {
    checkMemberPwdErrMSG.textContent = '請輸入與第一次相同的密碼!';
    return true;
  } else {
    return false;
  }
}
"use strict";

function memberCourseInit() {
  // 控制左側選單 選中時的效果
  localStorage.setItem("memberPageCode", 2);
  var memberCourseListArea = document.getElementById('memberCourseListArea'); // 渲染會員課程的區塊

  var memberCourseName = document.getElementById('memberCourseName');
  var memberCourseGuildLine = document.getElementById('memberCourseGuildLine');
  var memberCourseBeginDate = document.getElementById('memberCourseBeginDate');
  var memberCourseTime = document.getElementById('memberCourseTime');
  var memberCoursePlace = document.getElementById('memberCoursePlace');
  var memberCourseTeacher = document.getElementById('memberCourseTeacher');
  var loginMember = JSON.parse(localStorage.getItem('loginMember'));
  Promise.all([axios.get('http://localhost:3000/courseOrders?userId=' + loginMember.id), axios.get('http://localhost:3000/courses')]).then(function (resp) {
    var memberCourseAry = resp[0].data;
    var courseAry = resp[1].data;
    console.log(memberCourseAry);
    console.log(courseAry);
    renderMemberCourse(memberCourseAry, courseAry);
  });
}

function renderMemberCourse(memberCourseAry, courseAry) {
  var renderMemberCourseTemp = '';
  memberCourseAry.forEach(function (mc) {
    renderMemberCourseTemp += "\n        <li class=\"col-lg-6 mb-10\">\n            <div class=\"border border-primary80 border-2 py-10 px-6 radious8 memberCourseItemBG\">\n                <h3 class=\"h5 fw-bolder text-dark text-center mb-10\" id=\"memberCourseName\">".concat(courseAry.filter(function (o) {
      return o.id == mc.courseId;
    })[0].courseName, "</h3>\n                <p class=\"mb-10 text-dark\" id=\"memberCourseGuildLine\">").concat(courseAry.filter(function (o) {
      return o.id == mc.courseId;
    })[0].courseGuildline, "</p>\n                <p class=\"mb-3 text-dark\" id=\"memberCourseBeginDate\">\u958B\u8AB2\u65E5\u671F\uFF1A").concat(courseAry.filter(function (o) {
      return o.id == mc.courseId;
    })[0].courseBeginDate, "</p>\n                <p class=\"mb-3 text-dark\" id=\"memberCourseTime\">\u4E0A\u8AB2\u6642\u9593\uFF1A").concat(courseAry.filter(function (o) {
      return o.id == mc.courseId;
    })[0].courseTime, "</p>\n                <p class=\"mb-3 text-dark\" id=\"memberCoursePlace\">\u4F7F\u7528\u6559\u5BA4\uFF1A").concat(courseAry.filter(function (o) {
      return o.id == mc.courseId;
    })[0].coursePlace, "</p>\n                <p class=\"mb-3 text-dark\" id=\"memberCourseTeacher\">\u8B1B\u5E2B\uFF1A").concat(courseAry.filter(function (o) {
      return o.id == mc.courseId;
    })[0].courseTeacher, "</p>\n            </div>\n        </li>");
  });
  memberCourseListArea.innerHTML = renderMemberCourseTemp;
}
"use strict";

function memberLayoutInit() {
  var memberPageCode = localStorage.getItem('memberPageCode'); // 取得頁面編號
  // 側邊選單

  var toMemberAccount = document.getElementById('toMemberAccount');
  var toMemberCourse = document.getElementById('toMemberCourse');
  var toMemberAccountSm = document.getElementById('toMemberAccountSm');
  var toMemberCourseSm = document.getElementById('toMemberCourseSm');

  if (memberPageCode == 1) {
    toMemberAccount.classList.add('onPage');
    toMemberAccountSm.classList.remove('text-dark');
    toMemberAccountSm.classList.add('text-primary');
    toMemberCourse.classList.remove('onPage');
    toMemberCourseSm.classList.add('text-dark');
    toMemberCourseSm.classList.remove('text-primary');
  } else if (memberPageCode == 2) {
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
      clickable: true
    },
    breakpoints: {
      576: {
        slidesPerView: 5
      },
      992: {
        slidesPerView: 6
      }
    }
  });
} // 登出


function logout() {
  location.href = 'index.html';
  localStorage.removeItem('loginMember');
}
"use strict";

function productInit() {
  // 渲染表單
  axios.get('http://localhost:3000/products').then(function (resp) {
    renderProductFlowerList(resp.data);
    renderProductVaseList(resp.data);
  });
} // 渲染花卉的方法


function renderProductFlowerList(dataAry) {
  var productFlowerRenderArea = document.getElementById('productFlowerRenderArea');
  var tempStr = '';
  dataAry.filter(function (o) {
    return o.type == "flower";
  }).forEach(function (o) {
    tempStr += "\n        <li class=\"col-6 col-md-4 col-lg-3 col-xl-2 mb-5 diy".concat(o.id, "-li\">\n            <label class=\"text-center w-100\" for=\"diy").concat(o.id, "\">\n                <div class=\"border border-primary80 w-100 p-1 mb-5 radious20 itemImage imgHover\" >\n                    <div class=\"productItem\" style=\"background-image: url('assets/images/diy/").concat(o.imgName, "');\">\n\n                    </div>\n                </div>\n                \n                <h3 class=\"h5 text-dark\">").concat(o.name, "</h3>\n                \n            </label>\n            <input type=\"checkbox\" name=\"flower\" id=\"diy").concat(o.id, "\" value=\"").concat(o.name, "\" data-price=\"").concat(o.price, "\" onclick=\"chedkedItem(").concat(o.id, ")\" class=\"d-none\">\n        </li>\n        ");
  });
  productFlowerRenderArea.innerHTML = tempStr;
} // 給已選取的選項加上css效果
// 花卉


function chedkedItem(id) {
  var itemImage = document.querySelector('.diy' + id + '-li > label > .itemImage');
  itemImage.classList.toggle('productItemBorder');
  itemImage.classList.toggle('imgHover');
} // 花瓶


function checkedVase(id) {
  var thisVaseImage = document.querySelector('.diy' + id + '-li > label > .vaseImage'); // 當前點擊的容器圖片

  var allVaseImage = document.querySelectorAll('.vaseImage'); // 所有容器圖片

  var allVaseInput = document.querySelectorAll('input[name=vase]'); // 所有容器input
  // 先拿掉所有的選中效果

  allVaseImage.forEach(function (o) {
    o.classList.remove('productItemBorder');
    o.classList.add('imgHover');
  }); // 逐個判斷若是選中則加上效果

  allVaseInput.forEach(function (o) {
    if (o.checked) {
      thisVaseImage.classList.add('productItemBorder');
      thisVaseImage.classList.remove('imgHover');
    }
  });
} // 渲染花瓶包裝的方法


function renderProductVaseList(dataAry) {
  var productVaseRenderArea = document.getElementById('productVaseRenderArea');
  var tempStr = '';
  dataAry.filter(function (o) {
    return o.type == "decorate";
  }).forEach(function (o) {
    tempStr += "\n        <li class=\"col-6 col-md-4 col-lg-3 col-xl-2 mb-5 diy".concat(o.id, "-li\">\n            <label class=\"text-center w-100\" for=\"diy").concat(o.id, "\">\n                <div class=\"border border-primary80 w-100 p-1 mb-5 radious20 vaseImage imgHover\">\n                    <div class=\"productItem\" style=\"background-image: url('assets/images/diy/").concat(o.imgName, "');\">\n\n                    </div>\n                </div>\n                \n                <h3 class=\"h5 text-dark\">").concat(o.name, "</h3>\n                \n            </label>\n            <input type=\"radio\" name=\"vase\" id=\"diy").concat(o.id, "\" value=\"").concat(o.name, "\" data-price=\"").concat(o.price, "\" onclick=\"checkedVase(").concat(o.id, ")\" class=\"d-none\">\n        </li>\n        ");
  });
  productVaseRenderArea.innerHTML = tempStr;
} // 送出訂單 + 表單驗證


function sendProductOrder() {
  var flowers = document.querySelectorAll('input[name="flower"]');
  var vases = document.querySelectorAll('input[name = "vase"]');
  var orderName = document.getElementById('orderName');
  var orderPhoneNum = document.getElementById('orderPhoneNum');
  var orderMail = document.getElementById('orderMail');
  var orderAddress = document.getElementById('orderAddress');
  var loginMember = JSON.parse(localStorage.getItem("loginMember"));
  var vaseName = '';
  var serialNumTemp = '';
  var orderDate = new Date();
  var order = {
    "flowers": []
  };
  flowers.forEach(function (o) {
    if (o.checked) {
      var flower = {};
      flower.name = o.value;
      flower.price = o.dataset.price;
      order.flowers.push(flower);
    }
  });
  vases.forEach(function (o) {
    if (o.checked) {
      var vase = {};
      vase.name = o.value;
      vase.price = o.dataset.price;
      order.vases = vase;
      vaseName = o.value;
    }
  });
  order.name = orderName.value;
  order.phone = orderPhoneNum.value;
  order.mail = orderMail.value;
  order.address = orderAddress.value;
  order.usersId = loginMember.id;
  order.orderDate = orderDate;
  order.state = 1; // 1:訂單處理中 2:包裹配送中 3:包裹已送達 4:買家完成取貨付款

  serialNumTemp += orderDate.getFullYear() + '' + (orderDate.getMonth() + 1) + orderDate.getDate() + createSerialNum();
  order.serialNum = serialNumTemp; // console.log(order);

  if (order.flowers.length == 0) {
    alert('請選擇想使用的花卉');
    location.href = 'product.html#';
  } else if (vaseName == '') {
    alert('請選擇想使用的容器或裝飾');
    location.href = 'product.html#';
  } else if (orderName.value == '' || orderPhoneNum.value == '' || orderMail.value == '' || orderAddress.value == '') {
    alert('表單填寫不完全');
  } else {
    axios.post('http://localhost:3000/flowerOrders', order).then(function (resp) {
      alert('訂單已送出');
      location.href = 'product.html';
    })["catch"](function (resp) {
      alert('訂單送出失敗');
    });
  }
} // 新增流水號


function createSerialNum() {
  var serialNum = '';

  for (var i = 0; i < 5; i++) {
    serialNum += Math.floor(Math.random() * 10);
  }

  return serialNum;
}
"use strict";

// 頁面初始化
function signUpInit() {
  var singUpAccount = document.getElementById('singUpAccount');
  var singUpPwd = document.getElementById('singUpPwd');
  var checkPwd = document.getElementById('checkPwd');
  var singUpName = document.getElementById('singUpName');
  var signUpMail = document.getElementById('signUpMail');
  var signUpPhone = document.getElementById('signUpPhone');
  var signUpAddress = document.getElementById('signUpAddress');
  var SignUpBT = document.getElementById('SignUpBT');
  var checkPwdErrMSG = document.getElementById('checkPwdErrMSG');
  var sameAccountErrMSG = document.getElementById('sameAccountErrMSG');
  var sameMailErrMSG = document.getElementById('sameMailErrMSG');
  SignUpBT.addEventListener('click', function () {
    if (validSignUp()) {
      var member = newMember();
      axios.post('http://localhost:3000/users', member).then(function (resp) {
        location.href = 'login.html';
      });
    }
  });
} // 新增會員物件的方法


function newMember() {
  var member = {};
  member.id = null;
  member.name = singUpName.value;
  member.account = singUpAccount.value;
  member.password = singUpPwd.value;
  member.mail = signUpMail.value;
  member.phone = signUpPhone.value;
  member.address = signUpAddress.value;
  member.permission = 'commenUser';
  return member;
} // 註冊表單驗證


function validSignUp() {
  if (singUpAccount.value == '' || singUpPwd.value == '' || checkPwd.value == '' || singUpName.value == '' || signUpMail.value == '' || signUpPhone.value == '' || signUpAddress.value == '') {
    alert('表單輸入不完整! 請在檢查是否有未填欄位!');
    location.href = 'signUp.html#';
    return false;
  } else if (checkPassword()) {
    alert('確認密碼與第一次輸入的密碼不相符!');
    location.href = 'signUp.html#singUpPwd';
    return false;
  } else if (checkAccount()) {
    alert('帳號已註冊!');
    location.href = 'signUp.html#singUpAccount';
    return false;
  } else if (chenkMail()) {
    alert('信箱已註冊!');
    location.href = 'signUp.html#singUpMail';
    return false;
  } else {
    return true;
  }
} // 判斷第二次輸入的密碼是否與第一次相同


function checkPassword() {
  checkPwdErrMSG.textContent = '';

  if (singUpPwd.value !== checkPwd.value) {
    checkPwdErrMSG.textContent = '請輸入與第一次相同的密碼!';
    return true;
  } else {
    return false;
  }
} // 判斷帳號是否已註冊


function checkAccount() {
  sameAccountErrMSG.textContent = '';
  axios.get('http://localhost:3000/users').then(function (resp) {
    console.log(resp.data);
    resp.data.forEach(function (o) {
      if (singUpAccount.value == o.account) {
        sameAccountErrMSG.textContent = '帳號已註冊! 請直接登入或使用其他帳號!';
        return true;
      } else {
        return false;
      }
    });
  });
} // 判斷信箱是否已註冊


function chenkMail() {
  sameMailErrMSG.textContent = '';
  axios.get('http://localhost:3000/users').then(function (resp) {
    console.log(resp.data);
    resp.data.forEach(function (o) {
      if (signUpMail.value == o.mail) {
        sameMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
        return true;
      } else {
        return false;
      }
    });
  });
}
//# sourceMappingURL=all.js.map
