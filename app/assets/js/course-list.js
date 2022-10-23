let screenWidth = window.screen.availWidth;// 獲取螢幕寬度
const courseList = document.querySelector('.course-list');
let over992 = screenWidth>=992;
let courseListTemp = '';

axios.get('http://localhost:3000/course').then(function(response){
        console.log(response.data);
        courseListRender(response.data)
});

// json-server --watch db.json

function courseListRender(aryData){
    aryData.forEach(o=>{
        courseListTemp+=`<div class="row ${o.id%2==0?"flex-row":"flex-row-reverse"} justify-content-center ">
                            <div class="col-11 col-lg-5 mb-8 mb-lg-10 mb-xl-20">
                                <div class="courseList-img ${o.id%2==0?"imgOutline-odd":"imgOutline-even"}  w-100 radious8 shadow" style="background-image: url('assets/images/${o.courseImage}');"></div>
                            </div>
                            <div class="col-11 col-lg-5 mb-10">
                                <div class="px-1 d-flex flex-column ${over992?(o.id%2!=0?'align-items-end text-end':''):''}">
                                    <h3 class="text-dark fw-bold mb-4 mb-xl-10 ls-2helf">${o.courseName}</h3>
                                    <p class="text-dark h5 mb-3 mb-xl-6">開課日期：${o.courseBeginDate}</p>
                                    <p class="text-dark lh-2 mb-5 mb-xl-7">${o.courseSimpleIntro}</p>
                                    <div class="btn-big ">
                                        <a class="w-100"  href="course-detail.html?courseNum=${o.id}">MORE </a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
    })
    courseList.innerHTML=courseListTemp;
}