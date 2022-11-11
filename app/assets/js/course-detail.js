let url = location.href;
let articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length));//取得網址參數並轉成數字

axios.get('http://localhost:3000/courses').then(function (response) {
    courseDetailRender(response.data);
    // courseTable(response.data);
});

axios.get(`http://localhost:3000/courseOrders?courseId=${articalNum+1}`).then(function (response) {
   
    const member = JSON.parse(localStorage.getItem('loginMember'));
    console.log("member: "+member.id);
    console.log(response.data)
    const courseStud = document.querySelector('.courseStud');
    courseStud.textContent = response.data.length;
    
});







const courseId = document.querySelector('#courseId');   
const studName = document.querySelector('#studName');
const studPhoneNum = document.querySelector('#studPhoneNum');
const studMail = document.querySelector('#studMail');
const courseTableBtn = document.querySelector('#courseTableBtn');
const member = JSON.parse(localStorage.getItem('loginMember'));


if(localStorage.getItem('loginMember') != null){
    studName.value = member.name;
    studPhoneNum.value = member.phone;
    studMail.value = member.mail;
}

// 渲染頁面
function courseDetailRender(aryData) {
    courseId.value = articalNum;
    const titles = document.querySelectorAll('.title-js');
    titles.forEach(o=>o.innerHTML = aryData[articalNum].courseName);
    const courseImage = document.querySelector('.courseList-img');
    courseImage.setAttribute('style',`background-image: url('assets/images/${aryData[articalNum].courseImage}');`);
    const courseBeginDate = document.querySelector('.courseBeginDate');
    courseBeginDate.innerHTML = `開課日期： ${aryData[articalNum].courseBeginDate}`;
    const coursePrice = document.querySelector('.coursePrice');
    coursePrice.innerHTML = `NT$ ${aryData[articalNum].coursePrice}`;
    // const courseStudNum = document.querySelector('.courseStudNum');
    // courseStudNum.innerHTML = `已報名人數 ${aryData[articalNum].courseStud.length} / ${aryData[articalNum].courseMaximumStud}`;
    const courseLimit = document.querySelector('.courseLimit');
    courseLimit.textContent =  aryData[articalNum].courseMaximumStud;
    const courseContent = document.querySelector('.courseContent');
    courseContent.innerHTML = aryData[articalNum].courseContent;

}

// 送出課程訂單
courseTableBtn.addEventListener('click', function () {
    
    if(member == null){
        alert('請先登入喔!');
        location.href = 'login.html';
    }else{
        let obj = {};
        obj.id=null;
        obj.userId = member.id;
        obj.courseId = articalNum+1;
        axios.post('http://localhost:3000/courseOrders',obj).then(function(resp){
            console.log("123"+resp.data)
        });
        alert('資料送出成功')
    }
    

    // 清空表單
    courseId.value = '';
    studName.value = '';
    studPhoneNum.value = '';
    studMail.value = '';
})


