let updateCourseId;                                                     // 儲存點擊編輯後產生的課程id
let deleteCourseId;                                                     // 儲存點擊刪除後產生的課程id
function adminCourseInit(){
    // 控制左側選單 選中時的效果
    localStorage.setItem("pageCode",2);
    
    // 所有表單欄位
    const courseName = document.getElementById('courseName');
    const courseRoom = document.getElementById('courseRoom');
    const courseTeacher = document.getElementById('courseTeacher');
    const fileUploader = document.getElementById('file-uploader');
    const courseBeginDate = document.getElementById('courseBeginDate');
    const courseTime = document.getElementById('courseTime');
    const coursePrice = document.getElementById('coursePrice');
    const studLimit = document.getElementById('studLimit');
    const courseSimpleIntro = document.getElementById('courseSimpleIntro');
    const courseContent = document.getElementById('courseContent');
    const courseGuildline = document.getElementById('courseGuildline');
    
    const modalTitle = document.getElementById('modalTitle');               // model標題
    const cancelBT = document.getElementById('cancelBT');                   // 取消按鈕
    const newCourseBT = document.getElementById('newCourseBT');             // 新增課程按鈕
    const updateCourseBT = document.getElementById('updateCourseBT');       // 編輯課程按鈕
    const btnClose = document.querySelector('.btn-close');                  // 叉叉按鈕
    let imgName = '';                                                       // 儲存上傳的圖片的變數
    const adminCourseArea = document.getElementById('adminCourseArea');     // 要渲染所有課程的區塊
    let renderAdminCourseTemp = '';                                         // 儲存渲染的HTML的變數
    let renderUpdateCourseFun;                                              // 儲存axios裡面方法的變數
    let getCourseId;                                                        // 儲存axios裡面方法的變數
    
   
    
    const studListBody = document.getElementById('studListBody');           // 要渲染學生名單的區塊
    


    // 獲取上傳的圖片資訊
    fileUploader.addEventListener('change',e=>{
        imgName = e.target.files[0].name;
    });

    // 新增課程的關閉按鈕
    cancelBT.addEventListener('click',e=>{
        clearNewCourseTable();
    });
    btnClose.addEventListener('click', e=>{
        clearNewCourseTable();
    });

    // 新增課程
    newCourseBT.addEventListener('click',e=>{
        let newCourseObj = {};
        newCourseObj.id=null;
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
        axios.post('http://localhost:3000/courses',newCourseObj).then(function(resp){
            console.log("123"+resp.data)
        });
        alert('新建成功!');
        btnClose.click();
        location.href = 'admin-course.html';
    })

    // 清空新增課程的資料表
    function clearNewCourseTable(){
        courseName.value="";
        courseRoom.value="0";
        courseTeacher.value="0";
        fileUploader.value="";
        courseBeginDate.value="";
        courseTime.value="";
        coursePrice.value="";
        studLimit.value="";
        courseSimpleIntro.value="";
        courseContent.value="";
        courseGuildline.value="";
    }

    // 渲染畫面
    Promise.all([axios.get('http://localhost:3000/courses'),axios.get('http://localhost:3000/courseOrders')])
    .then( (response) => {
        const courseArray = response[0].data;
        const orderArray = response[1].data;
        renderAdminCourse(courseArray, orderArray);
        
    })

    // 渲染admin課程管理的方法
    function renderAdminCourse(courseArray, orderArray){

        courseArray.forEach(o=>{
            renderAdminCourseTemp+=
            `<div class="col-4 mb-5">
                <div class="border border-dark border-2 rounded px-3 py-5">
                    <h3 class="h5 fw-bolder text-dark mb-8">${o.courseName}</h3>
                    <ul class="list-unstyled">
                        <li class="mb-3">開課日期： ${o.courseBeginDate}</li>
                        <li class="mb-3">開課狀態： ${o.courseState}</li>
                        <li class="mb-3">報名人數：${orderArray.filter(a=>a.courseId==o.id).length} / ${o.courseMaximumStud} 位</li>
                        <li class="mb-3">講師： ${o.courseTeacher}</li>
                        <li>教室： ${o.coursePlace}</li>
                    </ul>
                    <div class="d-flex justify-content-between">
                        <div class="btn-small">
                            <a class="w-100 d-none d-lg-flex justify-content-lg-center" href="#" data-bs-toggle="modal" data-bs-target="#courseTable" onclick="updatCourse(${o.id})">編輯課程</a>
                        </div>
                        <div class="btn-small">
                            <a class="w-100 d-none d-lg-flex justify-content-lg-center" href="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="getDeleteId(${o.id})">刪除課程</a>
                        </div>
                        <div class="btn-small">
                            <a class="w-100 d-none d-lg-flex justify-content-lg-center" href="#" data-bs-toggle="modal" data-bs-target="#studList" onclick="renderStudentList(${o.id})">學員名單</a>
                        </div>
                    </div>
                </div>
            </div>`;
        })
        adminCourseArea.innerHTML = renderAdminCourseTemp;
    }


    // 更新課程資訊
    updateCourseBT.addEventListener('click',e=>{
        let data = {};
        data.courseName = courseName.value;
        data.courseBeginDate = courseBeginDate.value;
        data.courseTime = courseTime.value;
        data.coursePlace = courseRoom.value;
        data.courseTeacher = courseTeacher.value;
        data.courseMaximumStud = studLimit.value;
        data.courseImage = imgName==''?fileUploader.dataset.imgName:imgName;
        data.courseSimpleIntro = changeNewLineTag(courseSimpleIntro.value);
        data.courseContent = changeNewLineTag(courseContent.value);
        data.courseGuildline = changeNewLineTag(courseGuildline.value);
        data.coursePrice = coursePrice.value;

        axios.patch("http://localhost:3000/courses/"+updateCourseId, data).then(res=>{ 
            console.log(res, 'patch')
            location.href = 'admin-course.html';
        });
       
    })
}

// 更新課程資訊
function updatCourse(id){
  console.log(id)
  updateCourseId = id;
  const fileUploader = document.getElementById('file-uploader');
  axios.get('http://localhost:3000/courses/'+id).then(resp=>{
    let theCourse = resp.data;
    modalTitle.textContent = "編輯課程";
    updateCourseBT.classList.remove('d-none');
    newCourseBT.classList.add('d-none');

    // 將db的資料渲染給表單
    courseName.value = theCourse.courseName;
    courseBeginDate.value = theCourse.courseBeginDate;
    courseTime.value = theCourse.courseTime;
    courseRoom.value = theCourse.coursePlace;
    courseTeacher.value = theCourse.courseTeacher;
    studLimit.value = theCourse.courseMaximumStud;
    // fileUploader.value = theCourse.courseImage;
    fileUploader.dataset.imgName = theCourse.courseImage;
    courseSimpleIntro.value = changeNewLineTagInHTML(theCourse.courseSimpleIntro);
    courseContent.value = changeNewLineTagInHTML(theCourse.courseContent);
    courseGuildline.value = changeNewLineTagInHTML(theCourse.courseGuildline);
    coursePrice.value = theCourse.coursePrice;
    console.log(fileUploader.dataset.imgName);
  })
  
}

// 將換行符號 \n 改成html標籤
function changeNewLineTag(str){
  return str.split('\n').join('<br />');
}
// 將換行符號 html標籤 改成 \n 
function changeNewLineTagInHTML(str){
  return str.split('<br />').join('\n');
}

// 將id儲存在外部
function getDeleteId(id){
  deleteCourseId = id;
}

// 刪除課程
function deleteCourse() { 
  axios.delete("http://localhost:3000/courses/"+deleteCourseId).then(res=>{ 
      console.log(res, 'patch')
      location.href = 'admin-course.html';
  });
}

// 渲染學生名單
function renderStudentList(id){
  const studListCourseName = document.getElementById('studList-courseName'); // 學生名單的課程標題
  axios.get('http://localhost:3000/courses/'+id).then(resp=>{
    studListCourseName.textContent = resp.data.courseName;
  });

  Promise.all([axios.get('http://localhost:3000/courseOrders?courseId='+id),axios.get('http://localhost:3000/users')]).then(r=>{
    let result  = []
    r[0].data.forEach(e=>{
      r[1].data.forEach(o=>{
        if(e.userId == o.id){
          result.push(o);
        }
      })
    })
    renderStudList(result, id);
  })
}

// 渲染學生名單的方法
function renderStudList(ary, courseId) { 
  let renderStudListTemp = '';      // 儲存渲染的HTML的變數
  ary.forEach(o=>{
    renderStudListTemp += `<tr class="py-1">
                            <td><p class="mb-0 mt-2">${o.name}</p></td>
                            <td><p class="mb-0 mt-2">${o.mail}</p></td>
                            <td><p class="mb-0 mt-2">${o.phone}</p></td>
                            <td>
                              <div class="btn-small">
                                  <a class="w-100 d-none d-lg-flex justify-content-lg-center" href="#" onclick="deleteStudInCourse(${o.id}, ${courseId})">刪除</a>
                              </div>
                            </td>
                          </tr>`;
  })
  studListBody.innerHTML = renderStudListTemp;
}

// 刪除課程中的學生
function deleteStudInCourse(id, courseId){
  console.log(id);
  console.log(courseId);
  axios.get('http://localhost:3000/courseOrders').then(resp=>{
    resp.data.forEach(o=>{
      if(o.userId == id && o.courseId == courseId){
          axios.delete("http://localhost:3000/courseOrders/"+o.id).then(res=>{ 
          console.log(res, 'patch')
          location.href = 'admin-course.html';
      });
      }
    })
  })
}