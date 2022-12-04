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
  var orderPage = document.getElementById('orderPage');
  var ConsultationPage = document.getElementById('ConsultationPage');

  if (pageCode == 0) {
    memberPage.classList.remove('onPage');
    coursePage.classList.remove('onPage');
    orderPage.classList.remove('onPage');
  } else if (pageCode == 1) {
    memberPage.classList.add('onPage');
    coursePage.classList.remove('onPage');
    orderPage.classList.remove('onPage');
  } else if (pageCode == 2) {
    memberPage.classList.remove('onPage');
    coursePage.classList.add('onPage');
    orderPage.classList.remove('onPage');
  } else if (pageCode == 3) {
    memberPage.classList.remove('onPage');
    coursePage.classList.remove('onPage');
    orderPage.classList.add('onPage');
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

function adminMemberInit() {
  // 控制左側選單 選中時的效果
  localStorage.setItem("pageCode", 1); // 渲染會員清單

  axios.get('http://localhost:3000/users').then(function (resp) {
    renderMemberList(resp.data);
  });
  document.getElementById('searchMember').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      document.getElementById('searchMemberBT').click();
    }
  });
} // 渲染會員清單的方法


function renderMemberList(aryData) {
  var memberListRenderArea = document.getElementById('memberListRenderArea'); // 渲染會員清單的區域

  var memberListTemp = ''; // 暫存渲染的HTML

  aryData.forEach(function (o) {
    if (o.permission == "administrator") {
      return;
    } else {
      var n = o.name;
      memberListTemp += "<li class=\"col-2 mb-13\">\n                    <a class=\"rounded-circle bg-primary60 d-flex justify-content-center align-items-center memberPic\" \n                        data-bs-toggle=\"modal\" data-bs-target=\"#memberModal\" onclick=\"renderMemberModal('".concat(o.id, "')\">\n                        <h3 class=\"h5 text-white m-0\">").concat(o.name, "</h3>\n                    </a>\n                </li>");
    }
  });
  memberListRenderArea.innerHTML = memberListTemp;
} // 渲染會員modal的方法


function renderMemberModal(oid) {
  var mName = document.getElementById('memberModalLabel');
  var mAccount = document.getElementById('mAccount');
  var mPwd = document.getElementById('mPwd');
  var mMail = document.getElementById('mMail');
  var mPhone = document.getElementById('mPhone');
  var mAddress = document.getElementById('mAddress');
  var deleteMemberBT = document.getElementById('deleteMemberBT');
  axios.get('http://localhost:3000/users/' + oid).then(function (resp) {
    var obj = resp.data;
    mName.textContent = obj.name;
    mAccount.textContent = obj.account;
    mPwd.textContent = obj.password;
    mMail.textContent = obj.mail;
    mPhone.textContent = obj.phone;
    mAddress.textContent = obj.address;
    deleteMemberBT.dataset.memberId = obj.id;
  });
} // 讓原本的對話框消失


function didappearArea() {
  console.log('didappearArea');
  document.querySelector('.adminMemberModal').classList.add('op0');
} // 回復消失的對話框


function appearArea() {
  document.querySelector('.adminMemberModal').classList.remove('op0');
} // 刪除會員的方法


function deleteMember() {
  var deleteMemberBT = document.getElementById('deleteMemberBT');
  var memberId = deleteMemberBT.dataset.memberId;
  axios["delete"]('http://localhost:3000/users/' + memberId).then(function (resp) {
    location.href = 'admin-member.html';
  });
} // 關鍵字搜尋並重新渲染畫面


function searchMember() {
  var keyword = document.getElementById('searchMember');

  if (keyword.value == '') {
    axios.get('http://localhost:3000/users').then(function (resp) {
      renderMemberList(resp.data);
    });
  } else {
    axios.get('http://localhost:3000/users?q=' + keyword.value).then(function (resp) {
      renderMemberList(resp.data);
    });
  }
}
"use strict";

function adminOrderInit() {
  // 控制左側選單 選中時的效果
  localStorage.setItem("pageCode", 3);
  Promise.all([axios.get('http://localhost:3000/flowerOrders'), axios.get('http://localhost:3000/users')]).then(function (resp) {
    var orders = resp[0].data;
    var users = resp[1].data;
    renderAdminOrderList(orders, users);
  });
} // 渲染訂單清單的方法


function renderAdminOrderList(ordersAry, usersAry) {
  var adminOrderListArea = document.getElementById('adminOrderListArea');
  var temp = '';
  ordersAry.forEach(function (o) {
    var userData = usersAry.filter(function (u) {
      return u.id == o.usersId;
    });
    temp += "\n            <tr class=\"align-middle\">\n                <td>".concat(userData[0].name, "</td>\n                <td>").concat(o.serialNum, "</td>\n                <td>").concat(o.orderDate.substring(0, 10), "</td>\n                <td>\n                    <div class=\"btn-small adminOrderDetailBtn\">\n                        <a class=\"w-100 d-none d-lg-flex justify-content-lg-center\" href=\"#\" data-bs-toggle=\"modal\"\n                            data-bs-target=\"#adminOrderTable\" onClick=\"orderDetail(").concat(o.id, ")\">\u6AA2\u8996</a>\n                    </div>\n                </td>\n            </tr>");
  });
  adminOrderListArea.innerHTML = temp;
} // 依據輸入的關鍵字做查詢


function searchOrder() {
  var orderData2 = document.getElementById('orderData2');
  var orderData1 = document.getElementById('orderData1');
  var orderName = document.getElementById('orderName');
  var orderId = document.getElementById('orderId');
  var orderPhone = document.getElementById('orderPhone');

  if (orderData2.value == '' && orderData1.value == '' && orderName.value == '' && orderId.value == '' && orderPhone.value == '') {
    // 如果都沒有輸入就渲染全部
    Promise.all([axios.get('http://localhost:3000/flowerOrders'), axios.get('http://localhost:3000/users')]).then(function (resp) {
      var orders = resp[0].data;
      var users = resp[1].data;
      renderAdminOrderList(orders, users);
      ;
    });
  } else {
    // 否則在網址列使用方法做查詢
    axios.get('http://localhost:3000/users').then(function (resp) {
      var users = resp.data;
      axios.get('http://localhost:3000/flowerOrders' + filterName(users) + filterId() + filterPhone()).then(function (r) {
        var orders = r.data;

        if (orderData1.value != '' || orderData2.value != '') {
          var ordersInDate = filterDate(orderData1.value, orderData2.value, orders);
          renderAdminOrderList(ordersInDate, users);
        } else {
          renderAdminOrderList(orders, users);
        }
      });
    });
  }
} // 根據訂單姓名做篩選


function filterName(users) {
  var orderName = document.getElementById('orderName').value;
  var user = users.filter(function (o) {
    return o.name == orderName;
  })[0];
  users.forEach(function (u) {
    console.log(u.name);
  });
  console.log(orderName);

  if (orderName == '') {
    return '';
  } else {
    return '?usersId=' + user.id;
  }
} // 根據訂單編號做篩選


function filterId() {
  var orderId = document.getElementById('orderId').value;

  if (orderId == '') {
    return '';
  } else {
    if (filterName() == '') {
      return '?serialNum=' + orderId;
    } else {
      return '&serialNum=' + orderId;
    }
  }
} // 根據訂單電話做篩選


function filterPhone() {
  var orderPhone = document.getElementById('orderPhone').value;

  if (orderPhone == '') {
    return '';
  } else {
    if (filterName() == '' && filterId() == '') {
      return '?phone=' + orderPhone;
    } else {
      return '&phone=' + orderPhone;
    }
  }
} // 根據日期範圍做篩選


function filterDate(d1, d2, ary) {
  if (d1 == '') {
    d1 = new Date('1990/01/01');
  }

  if (d2 == '') {
    d2 = new Date().toLocaleDateString().split('/').join('-');
  }

  var newAry = ary.filter(function (o) {
    return new Date(o.orderDate.substring(0, 10)).getTime() >= new Date(d1).getTime() && new Date(o.orderDate.substring(0, 10)).getTime() <= new Date(d2).getTime();
  });
  return newAry;
} // 渲染訂單明細的方法


function orderDetail(id) {
  var adminOrderSerialNum = document.getElementById('adminOrderSerialNum'); //訂單編號

  var adminOrderUserName = document.getElementById('adminOrderUserName'); //訂單姓名

  var adminOrderPhone = document.getElementById('adminOrderPhone'); //連絡電話

  var adminOrderOrderDate = document.getElementById('adminOrderOrderDate'); //訂單日期

  var adminOrderShipDate = document.getElementById('adminOrderShipDate'); //預估出貨日期

  var adminOrderReceiveName = document.getElementById('adminOrderReceiveName'); //收貨人姓名

  var adminOrderAddress = document.getElementById('adminOrderAddress'); //出貨地址

  var adminOrderState = document.getElementById('adminOrderState'); //訂單狀態

  adminOrderState.dataset.orderId = id;
  Promise.all([axios.get('http://localhost:3000/flowerOrders?id=' + id), axios.get('http://localhost:3000/users')]).then(function (resp) {
    var order = resp[0].data[0];
    var users = resp[1].data;
    adminOrderSerialNum.textContent = order.serialNum;
    adminOrderUserName.textContent = users.filter(function (o) {
      return o.id == order.usersId;
    })[0].name;
    adminOrderPhone.textContent = order.phone;
    adminOrderOrderDate.textContent = order.orderDate.substring(0, 10);
    var orderDate = new Date(order.orderDate.substring(0, 10));
    adminOrderShipDate.textContent = orderDate.addDays(3);
    adminOrderReceiveName.textContent = order.name;
    adminOrderAddress.textContent = order.address;
    adminOrderState.value = order.state;
    renderAdminOrderProductArea(order);
  });
} // 指定日期加上天數的方法


Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + days);
  return this.toLocaleDateString().split('/').join('-');
}; // 渲染明細內的產品清單


function renderAdminOrderProductArea(ary) {
  var adminOrderProductArea = document.getElementById('adminOrderProductArea'); //訂購內容

  var temp = '';
  axios.get('http://localhost:3000/products').then(function (resp) {
    ary.flowers.forEach(function (o) {
      temp += "\n            <li class=\"d-flex justify-content-between mb-1\">\n                <p class=\"m-0\">".concat(resp.data.filter(function (p) {
        return p.id == o;
      })[0].name, "</p>\n                <p class=\"m-0\">").concat(resp.data.filter(function (p) {
        return p.id == o;
      })[0].price, " $</p>\n            </li>\n            ");
    });
    temp += "\n            <li class=\"d-flex justify-content-between mb-1\">\n                <p class=\"m-0\">\u904B\u8CBB</p>\n                <p class=\"m-0\">80 $</p>\n            </li>\n            <hr class=\"my-2\">\n            <li class=\"d-flex justify-content-between\">\n                <p class=\"m-0\">\u5C0F\u7D50</p>\n                <p class=\"m-0\">".concat(ary.totalCost + 80, " $</p>\n            </li>\n            ");
    adminOrderProductArea.innerHTML = temp;
  });
} // 修改訂單狀態的方法


function changeOrderState() {
  var adminOrderState = document.getElementById('adminOrderState'); //訂單狀態

  axios.patch('http://localhost:3000/flowerOrders/' + adminOrderState.dataset.orderId, {
    "state": parseInt(adminOrderState.value)
  }).then(function (resp) {
    console.log('狀態更改成功');
  });
} // 刪除訂單


function deleteOrder() {
  var adminOrderState = document.getElementById('adminOrderState'); //訂單狀態(單純要取得訂單id)

  console.log(adminOrderState.dataset.orderId);
  axios["delete"]('http://localhost:3000/flowerOrders/' + adminOrderState.dataset.orderId).then(function (resp) {
    alert('訂單已取消');
    location.href = 'admin-order.html';
  });
}
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
    // 判斷是否有登入
    if (member == null) {
      alert('請先登入喔!');
      location.href = 'login.html';
    } else {
      // 先判定是否有欄位未填
      if (courseId.value == '' || studName.value == '' || studPhoneNum.value == '' || studMail.value == '') {
        alert('表單輸入不完全');
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

function courseSignupTable() {
  var courseTableTab = document.getElementById('courseTable-tab');
  courseTableTab.click();
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
  var toMemberAccountSm = document.getElementById('toMemberAccountSm');
  var toMemberCourse = document.getElementById('toMemberCourse');
  var toMemberCourseSm = document.getElementById('toMemberCourseSm');
  var toMemberOrder = document.getElementById('toMemberOrder');
  var toMemberOrderSm = document.getElementById('toMemberOrderSm');
  var toMeberConsulation = document.getElementById('toMeberConsulation');
  var toMeberConsulationSm = document.getElementById('toMeberConsulationSm');

  if (memberPageCode == 1) {
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
  } else if (memberPageCode == 2) {
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
  } else if (memberPageCode == 3) {
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
  } else if (memberPageCode == 4) {
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

function memberOrderInit() {
  localStorage.setItem("memberPageCode", 3);
  var loginMember = JSON.parse(localStorage.getItem('loginMember'));
  Promise.all([axios.get('http://localhost:3000/flowerOrders?usersId=' + loginMember.id), axios.get('http://localhost:3000/products')]).then(function (resp) {
    var orders = resp[0].data;
    var products = resp[1].data;
    renderOrder(orders, products);
  });
} // 渲染訂單的方法


function renderOrder(orders, products) {
  var orderTemp = '';
  var accordionArea = document.getElementById('accordionArea'); // 先渲染出每筆訂單

  orders.forEach(function (o) {
    orderTemp += "\n        <div class=\"accordion-item\">\n            <h2 class=\"accordion-header\" id=\"headingOne".concat(o.id, "\">\n                <div class=\"accordion-button \" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapseOne").concat(o.id, "\" aria-expanded=\"true\" aria-controls=\"collapseOne").concat(o.id, "\">\n                    <div class=\"d-flex justify-content-between align-items-center w-100 pe-5\">\n                        <p class=\"m-0\">\u8A02\u55AE\u7DE8\u865F\uFF1A").concat(o.serialNum, "</p>\n                        <p class=\"m-0\">").concat(o.orderDate.substring(0, 10), "</p>\n                    </div>\n                </div>\n            </h2>\n            <div id=\"collapseOne").concat(o.id, "\" class=\"accordion-collapse collapse show\" aria-labelledby=\"headingOne").concat(o.id, "\" data-bs-parent=\"#accordionArea\">\n                <div class=\"accordion-body\" id=\"orderProductsArea\">\n                    <ul class=\"list-unstyled row\" id=\"productsArea").concat(o.id, "\">\n\n                        \n                    </ul>\n                </div>\n                <div class=\"w-100 bg-primaryTint py-3 pe-10 d-flex justify-content-end\">\n                    <div class=\"d-flex flex-column w-25 text-dark\">\n                        <div class=\"d-flex justify-content-between mb-1\">\n                            <p class=\"m-0\">\u5C0F\u8A08\uFF1A</p>\n                            <p class=\"m-0\">NT$ ").concat(o.totalCost, "</p>\n                        </div>\n                        <div class=\"d-flex justify-content-between mb-1\">\n                            <p class=\"m-0\">\u904B\u8CBB\uFF1A</p>\n                            <p class=\"m-0\">NT$ 80</p>\n                        </div>\n                        <div class=\"d-flex justify-content-between mb-1 fw-bolder\">\n                            <p class=\"m-0\">\u7E3D\u8A08\uFF1A</p>\n                            <p class=\"m-0\">NT$ ").concat(o.totalCost + 80, "</p>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"accordion-body\">\n                    <p>\u6536\u4EF6\u4EBA\uFF1A").concat(o.name, "</p>\n                    <p>\u8A02\u55AE\u72C0\u614B\uFF1A").concat(o.state == 1 ? '待出貨' : o.state == 2 ? '已出貨' : o.state == 3 ? '送達門市' : '已取貨', "</p>\n                    <p>\u4ED8\u6B3E\u65B9\u5F0F\uFF1A\u8CA8\u5230\u4ED8\u6B3E</p>\n                    <p>\u6536\u4EF6\u5730\u5740\uFF1A").concat(o.address, "</p>\n                </div>\n            </div>\n        </div>");
  });
  accordionArea.innerHTML = orderTemp; // 才能渲染每筆訂單內的所有商品

  orders.forEach(function (o) {
    var productTemp = '';
    var productsArea = document.getElementById("productsArea".concat(o.id));
    o.flowers.forEach(function (p) {
      productTemp += "\n                <li class=\"col-sm-6 col-xl-4 d-flex justify-content-around align-items-center mb-3\">\n                    <div class=\"radious8 orderProduct shadow\" style=\"background-image: url('assets/images/diy/".concat(products[parseInt(p) - 1].imgName, "');\"></div>\n                    <p class=\"m-0\">").concat(products[parseInt(p) - 1].name, "</p>\n                    <p class=\"m-0\">NT$").concat(products[parseInt(p) - 1].price, "</p>\n                </li>\n            ");
    });
    productTemp += "\n            <li class=\"col-sm-6 col-xl-4 d-flex justify-content-around align-items-center mb-3\">\n                <div class=\"radious8 orderProduct shadow\" style=\"background-image: url('assets/images/diy/".concat(products[parseInt(o.vases) - 1].imgName, "');\"></div>\n                <p class=\"m-0\">").concat(products[parseInt(o.vases) - 1].name, "</p>\n                <p class=\"m-0\">NT$").concat(products[parseInt(o.vases) - 1].price, "</p>\n            </li>\n        ");
    productsArea.innerHTML = productTemp;
  });
}
"use strict";

function productInit() {
  var loginMember = JSON.parse(localStorage.getItem("loginMember"));

  if (!loginMember) {
    alert('請先登入');
    location.href = 'login.html';
  } else {
    // 渲染表單
    axios.get('http://localhost:3000/products').then(function (resp) {
      renderProductFlowerList(resp.data);
      renderProductVaseList(resp.data);
    });
  }
} // 渲染花卉的方法


function renderProductFlowerList(dataAry) {
  var productFlowerRenderArea = document.getElementById('productFlowerRenderArea');
  var tempStr = '';
  dataAry.filter(function (o) {
    return o.type == "flower";
  }).forEach(function (o) {
    tempStr += "\n        <li class=\"col-6 col-md-4 col-lg-3 col-xl-2 mb-5 diy".concat(o.id, "-li\">\n            <label class=\"text-center w-100\" for=\"diy").concat(o.id, "\">\n                <div class=\"border border-primary80 w-100 p-1 mb-5 radious20 itemImage imgHover\" >\n                    <div class=\"productItem\" style=\"background-image: url('assets/images/diy/").concat(o.imgName, "');\">\n\n                    </div>\n                </div>\n                \n                <h3 class=\"h5 text-dark\">").concat(o.name, "</h3>\n                \n            </label>\n            <input type=\"checkbox\" name=\"flower\" id=\"diy").concat(o.id, "\" value=\"").concat(o.id, "\" data-price=\"").concat(o.price, "\" onclick=\"chedkedItem(").concat(o.id, ")\" class=\"d-none\">\n        </li>\n        ");
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
    tempStr += "\n        <li class=\"col-6 col-md-4 col-lg-3 col-xl-2 mb-5 diy".concat(o.id, "-li\">\n            <label class=\"text-center w-100\" for=\"diy").concat(o.id, "\">\n                <div class=\"border border-primary80 w-100 p-1 mb-5 radious20 vaseImage imgHover\">\n                    <div class=\"productItem\" style=\"background-image: url('assets/images/diy/").concat(o.imgName, "');\">\n\n                    </div>\n                </div>\n                \n                <h3 class=\"h5 text-dark\">").concat(o.name, "</h3>\n                \n            </label>\n            <input type=\"radio\" name=\"vase\" id=\"diy").concat(o.id, "\" value=\"").concat(o.id, "\" data-price=\"").concat(o.price, "\" onclick=\"checkedVase(").concat(o.id, ")\" class=\"d-none\">\n        </li>\n        ");
  });
  productVaseRenderArea.innerHTML = tempStr;
} // 送出訂單 + 表單驗證


function sendProductOrder() {
  var flowers = document.querySelectorAll('input[name="flower"]');
  var vases = document.querySelector('input[name = "vase"]');
  var orderName = document.getElementById('orderName');
  var orderPhoneNum = document.getElementById('orderPhoneNum');
  var orderMail = document.getElementById('orderMail');
  var orderAddress = document.getElementById('orderAddress');
  var loginMember = JSON.parse(localStorage.getItem("loginMember"));
  var vaseName = '';
  var serialNumTemp = '';
  var orderDate = new Date();
  var productTotalCost = 0;
  var order = {
    "flowers": []
  };
  flowers.forEach(function (o) {
    if (o.checked) {
      order.flowers.push(o.value);
      productTotalCost += parseInt(o.dataset.price);
    }
  });
  order.vases = vases.value;
  productTotalCost += parseInt(vases.dataset.price);
  order.totalCost = productTotalCost;
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
  } else if (order.vases == '') {
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
  var SignUpBT = document.getElementById('SignUpBT');
  SignUpBT.addEventListener('click', function () {
    axios.get('http://localhost:3000/users').then(function (users) {
      if (validSignUp(users)) {
        var member = newMember();
        axios.post('http://localhost:3000/users', member).then(function (resp) {
          location.href = 'login.html';
        });
      }
    });
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


function validSignUp(users) {
  var singUpName = document.getElementById('singUpName');
  var signUpPhone = document.getElementById('signUpPhone');
  var signUpAddress = document.getElementById('signUpAddress');
  var singUpAccount = document.getElementById('singUpAccount');
  var sameAccountErrMSG = document.getElementById('sameAccountErrMSG');
  var signUpMail = document.getElementById('signUpMail');
  var sameMailErrMSG = document.getElementById('sameMailErrMSG');
  var singUpPwd = document.getElementById('singUpPwd');
  var checkPwd = document.getElementById('checkPwd');
  var checkAccount = false;
  var chenkMail = false;
  sameAccountErrMSG.textContent = '';
  sameMailErrMSG.textContent = '';
  users.data.forEach(function (o) {
    if (singUpAccount.value == o.account) {
      sameAccountErrMSG.textContent = '帳號已註冊! 請直接登入或使用其他帳號!';
      checkAccount = true;
    } else {
      checkAccount = false;
    }

    if (signUpMail.value == o.mail) {
      sameMailErrMSG.textContent = '信箱已註冊! 請使用其他信箱!';
      chenkMail = true;
    } else {
      chenkMail = false;
    }
  });

  if (singUpAccount.value == '' || singUpPwd.value == '' || checkPwd.value == '' || singUpName.value == '' || signUpMail.value == '' || signUpPhone.value == '' || signUpAddress.value == '') {
    alert('表單輸入不完整! 請在檢查是否有未填欄位!');
    location.href = 'signUp.html#';
    return false;
  } else if (checkPassword()) {
    alert('確認密碼與第一次輸入的密碼不相符!');
    location.href = 'signUp.html#singUpPwd';
    return false;
  } else if (checkAccount) {
    alert('帳號已註冊!');
    location.href = 'signUp.html#singUpAccount';
    return false;
  } else if (chenkMail) {
    alert('信箱已註冊!');
    location.href = 'signUp.html#singUpMail';
    return false;
  } else {
    return true;
  }
} // 判斷第二次輸入的密碼是否與第一次相同


function checkPassword() {
  var singUpPwd = document.getElementById('singUpPwd');
  var checkPwd = document.getElementById('checkPwd');
  var checkPwdErrMSG = document.getElementById('checkPwdErrMSG');
  checkPwdErrMSG.textContent = '';

  if (singUpPwd.value !== checkPwd.value) {
    checkPwdErrMSG.textContent = '請輸入與第一次相同的密碼!';
    return true;
  } else {
    return false;
  }
} // 判斷帳號是否已註冊


function checkAccount() {
  var singUpAccount = document.getElementById('singUpAccount');
  var sameAccountErrMSG = document.getElementById('sameAccountErrMSG');
  sameAccountErrMSG.textContent = '';
  axios.get('http://localhost:3000/users').then(function (resp) {
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
  var signUpMail = document.getElementById('signUpMail');
  var sameMailErrMSG = document.getElementById('sameMailErrMSG');
  sameMailErrMSG.textContent = '';
  axios.get('http://localhost:3000/users').then(function (resp) {
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
