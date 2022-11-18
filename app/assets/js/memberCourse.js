function memberCourseInit(){
    // 控制左側選單 選中時的效果
    localStorage.setItem("memberPageCode",2);

    const memberCourseListArea = document.getElementById('memberCourseListArea');       // 渲染會員課程的區塊
    const memberCourseName = document.getElementById('memberCourseName');
    const memberCourseGuildLine = document.getElementById('memberCourseGuildLine');
    const memberCourseBeginDate = document.getElementById('memberCourseBeginDate');
    const memberCourseTime = document.getElementById('memberCourseTime');
    const memberCoursePlace = document.getElementById('memberCoursePlace');
    const memberCourseTeacher = document.getElementById('memberCourseTeacher');

    const loginMember = JSON.parse(localStorage.getItem('loginMember'));

    Promise.all([axios.get('http://localhost:3000/courseOrders?userId='+loginMember.id),
                 axios.get('http://localhost:3000/courses')]).then(resp=>{
                    const memberCourseAry = resp[0].data;
                    const courseAry = resp[1].data;

                    console.log(memberCourseAry);
                    console.log(courseAry);
                    renderMemberCourse(memberCourseAry, courseAry);
                 })

}

function renderMemberCourse(memberCourseAry, courseAry){
    let renderMemberCourseTemp = '';
    memberCourseAry.forEach(mc=>{
        renderMemberCourseTemp+=`
        <li class="col-lg-6 mb-10">
            <div class="border border-primary80 border-2 py-10 px-6 radious8 memberCourseItemBG">
                <h3 class="h5 fw-bolder text-dark text-center mb-10" id="memberCourseName">${courseAry.filter(o=>o.id == mc.courseId)[0].courseName}</h3>
                <p class="mb-10 text-dark" id="memberCourseGuildLine">${courseAry.filter(o=>o.id == mc.courseId)[0].courseGuildline}</p>
                <p class="mb-3 text-dark" id="memberCourseBeginDate">開課日期：${courseAry.filter(o=>o.id == mc.courseId)[0].courseBeginDate}</p>
                <p class="mb-3 text-dark" id="memberCourseTime">上課時間：${courseAry.filter(o=>o.id == mc.courseId)[0].courseTime}</p>
                <p class="mb-3 text-dark" id="memberCoursePlace">使用教室：${courseAry.filter(o=>o.id == mc.courseId)[0].coursePlace}</p>
                <p class="mb-3 text-dark" id="memberCourseTeacher">講師：${courseAry.filter(o=>o.id == mc.courseId)[0].courseTeacher}</p>
            </div>
        </li>`;
        
    })
    memberCourseListArea.innerHTML = renderMemberCourseTemp;
}