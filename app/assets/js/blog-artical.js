let url = location.href;//取得網址
let articalNum = parseInt(url.substring(url.indexOf('=')+1,url.length));//取得網址參數並轉成數字
const blogArticalContent = document.querySelector('.blogArticalContent');//取得html要渲染的div

axios.get('http://localhost:3000/blogArticals').then(function(response){
        // console.log(response.data);
        blogArticalRender(response.data)
});

function blogArticalRender(aryData){
    blogArticalContent.innerHTML=
    `<div class="col-lg-8">
        <h3 class="h4 fw-bolder mb-2 mb-lg-4 text-dark lh-150 ls-2helf">${aryData[articalNum-1].title}</h3>
        <p class="text-dark h7 fsz-lg-16 mb-6 mb-lg-8 ms-1">By ${aryData[articalNum-1].author} | ${aryData[articalNum-1].releaseDate[0]} | ${aryData[articalNum-1].tags.join('\ ')}</p>
        <p class="h5 text-dark lh-150 ls-2helf mb-5 mb-lg-8">${aryData[articalNum-1].contentOne}</p>
        <img class="w-100 radious20 mb-5 mb-lg-8" src="assets/images/${aryData[articalNum-1].contentImg}" alt="flower">
        <p class="h5 text-dark lh-150 ls-2helf mb-5 mb-lg-8">${aryData[articalNum-1].contentTwo}</p>
        <a class="h5 text-dark lh-150 ls-2helf articalSource" href="https://esence.travel/essence-experience/flower-art-faq/">${aryData[articalNum-1].articalFrom}</a>
    </div>`;//渲染
}