let url = location.href;
let articalNum = parseInt(url.substring(url.indexOf('=') + 1, url.length));//取得網址參數並轉成數字

axios.get('http://localhost:3000/courses').then(function (response) {
    console.log(response.data);
    courseDetailRender(response.data);
});


const courseId = document.querySelector('#courseId');
const studName = document.querySelector('#studName');
const studPhoneNum = document.querySelector('#studPhoneNum');
const studMail = document.querySelector('#studMail');

const courseTableBtn = document.querySelector('#courseTableBtn');

courseTableBtn.addEventListener('click', function () {
    let obj = {};
    obj.courseId = courseId.value;
    obj.studName = studName.value;
    obj.studPhoneNum = studPhoneNum.value;
    obj.studMail = studMail.value;
    console.log(obj);
    alert('資料送出成功')
    courseId.value = '';
    studName.value = '';
    studPhoneNum.value = '';
    studMail.value = '';
})

function courseDetailRender(aryData) {
    const titles = document.querySelectorAll('.title-js');
    titles.forEach(o=>o.innerHTML = aryData[articalNum].courseName);
    const courseImage = document.querySelector('.courseList-img');
    courseImage.setAttribute('style',`background-image: url('assets/images/${aryData[articalNum].courseImage}');`);
    const courseBeginDate = document.querySelector('.courseBeginDate');
    courseBeginDate.innerHTML = `開課日期： ${aryData[articalNum].courseBeginDate}`;
    const coursePrice = document.querySelector('.coursePrice');
    coursePrice.innerHTML = `NT$ ${aryData[articalNum].coursePrice}`;
    const courseStudNum = document.querySelector('.courseStudNum');
    courseStudNum.innerHTML = `已報名人數 ${aryData[articalNum].courseStud.length} / ${aryData[articalNum].courseMaximumStud}`;
    const courseContent = document.querySelector('.courseContent');
    courseContent.innerHTML = aryData[articalNum].courseContent;

}
