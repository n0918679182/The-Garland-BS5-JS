const blogContent = document.querySelector('.blogContent'); // 要渲染的div
let blogListtemp = '';//迴圈暫存字串變數

axios.get('http://localhost:3000/blogArticals').then(function(response){
    // console.log(response.data);
    blogListRender(response.data)
});

function blogListRender(aryData){
    aryData.forEach(o=>{
        blogListtemp += `<div class="col-md-6 col-lg-4 mb-11 mb-lg-20 blog-artical radious8">
                    <a href="blog-artical.html?articalNum=${o.articalNum}">
                        <div class="position-relative p-5 mb-5 mb-md-10">
                            <div class="img-line-x bg-danger"></div>
                            <img class="w-100 radious20 shadow" style="height: 288px;" src="assets/images/${o.image}" alt="${o.title}">
                            <div class="img-line-y"></div>
                            <p class="m-0 artical-date">${o.releaseDate[1]}</p>
                        </div>
                        <div class="w-100 d-flex flex-column justify-content-between py-1 px-6" style="height: 90px;">
                            <h3 class="h5 text-dark">${o.title}</h3>
                            <div class="d-flex justify-content-end">
                                <a href="blog-artical.html?articalNum=${o.articalNum}">READ MORE</a>
                            </div>
                        </div>
                    </a>
                </div>`;
                
    });
    blogContent.innerHTML = blogListtemp;
}
