function courseDetailInit() {
    let url = location.href;
    let articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length));//取得網址參數並轉成數字

    axios.get('http://localhost:3000/courses').then(function (response) {

        // 渲染表單選項
        axios.get('http://localhost:3000/courses').then(resp => {
            resp.data.forEach(o => {
                courseId.options.add(new Option(o.courseName, o.id - 1));
            })
            courseDetailRender(response.data);
        })
    });

    axios.get(`http://localhost:3000/courseOrders?courseId=${articalNum + 1}`).then(function (response) {

        const member = JSON.parse(localStorage.getItem('loginMember'));
        const courseStud = document.querySelector('.courseStud');
        courseStud.textContent = response.data.length;

    });


    const courseId = document.querySelector('#courseId');
    const studName = document.querySelector('#studName');
    const studPhoneNum = document.querySelector('#studPhoneNum');
    const studMail = document.querySelector('#studMail');
    const courseTableBtn = document.querySelector('#courseTableBtn');
    const member = JSON.parse(localStorage.getItem('loginMember'));



    if (localStorage.getItem('loginMember') != null) {
        studName.value = member.name;
        studPhoneNum.value = member.phone;
        studMail.value = member.mail;
    }

    // 渲染頁面的方法
    function courseDetailRender(aryData) {
        courseId.value = articalNum;
        const titles = document.querySelectorAll('.title-js');
        titles.forEach(o => o.innerHTML = aryData[articalNum].courseName);
        const courseImage = document.querySelector('.courseList-img');
        courseImage.setAttribute('style', `background-image: url('assets/images/${aryData[articalNum].courseImage}');`);
        const courseBeginDate = document.querySelector('.courseBeginDate');
        courseBeginDate.innerHTML = `開課日期： ${aryData[articalNum].courseBeginDate}`;
        const coursePrice = document.querySelector('.coursePrice');
        coursePrice.innerHTML = `NT$ ${aryData[articalNum].coursePrice}`;
        const courseLimit = document.querySelector('.courseLimit');
        courseLimit.textContent = aryData[articalNum].courseMaximumStud;
        const courseContent = document.querySelector('.courseContent');
        courseContent.innerHTML = aryData[articalNum].courseContent;
    }

    // 送出課程訂單
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

                let obj = {};
                obj.id = null;
                obj.userId = member.id;
                obj.courseId = parseInt(courseId.value) + 1;
                // 取得所有課程訂單
                axios.get('http://localhost:3000/courseOrders?userId=' + member.id).then(resp => {

                    // 判斷該位學員是否已經報名過了
                    let alreadyHaveCourse = false;
                    resp.data.forEach(o => {
                        if (o.courseId == (parseInt(courseId.value) + 1)) {
                            alreadyHaveCourse = true;
                        }
                    })
                    // 如果已經報名過了
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


    })
}

function courseSignupTable(){
    const courseTableTab = document.getElementById('courseTable-tab');
    courseTableTab.click();
}