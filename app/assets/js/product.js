function productInit(){
    const loginMember = JSON.parse(localStorage.getItem("loginMember"));
    if(!loginMember){
        alert('請先登入');
        location.href = 'login.html';
    }else{
        // 渲染表單
        axios.get('http://localhost:3000/products').then(resp=>{
            renderProductFlowerList(resp.data);
            renderProductVaseList(resp.data);
        })
    }
   

   
   
}

// 渲染花卉的方法
function renderProductFlowerList(dataAry){
    const productFlowerRenderArea = document.getElementById('productFlowerRenderArea');
    let tempStr = '';
    dataAry.filter(o=>o.type == "flower").forEach(o=>{
        tempStr += `
        <li class="col-6 col-md-4 col-lg-3 col-xl-2 mb-5 diy${o.id}-li">
            <label class="text-center w-100" for="diy${o.id}">
                <div class="border border-primary80 w-100 p-1 mb-5 radious20 itemImage imgHover" >
                    <div class="productItem" style="background-image: url('assets/images/diy/${o.imgName}');">

                    </div>
                </div>
                
                <h3 class="h5 text-dark">${o.name}</h3>
                
            </label>
            <input type="checkbox" name="flower" id="diy${o.id}" value="${o.id}" data-price="${o.price}" onclick="chedkedItem(${o.id})" class="d-none">
        </li>
        `
    })
    productFlowerRenderArea.innerHTML = tempStr;
}

// 給已選取的選項加上css效果
// 花卉
function chedkedItem(id){
    const itemImage = document.querySelector('.diy'+id+'-li > label > .itemImage');
    itemImage.classList.toggle('productItemBorder')
    itemImage.classList.toggle('imgHover');
}
// 花瓶
function checkedVase(id){
    const thisVaseImage = document.querySelector('.diy'+id+'-li > label > .vaseImage'); // 當前點擊的容器圖片
    const allVaseImage = document.querySelectorAll('.vaseImage');                       // 所有容器圖片
    const allVaseInput = document.querySelectorAll('input[name=vase]');                 // 所有容器input
    // 先拿掉所有的選中效果
    allVaseImage.forEach(o=>{
        o.classList.remove('productItemBorder');
        o.classList.add('imgHover')
    })
    // 逐個判斷若是選中則加上效果
    allVaseInput.forEach(o=>{
        if(o.checked){
            thisVaseImage.classList.add('productItemBorder')
            thisVaseImage.classList.remove('imgHover')
        }
    })
}

// 渲染花瓶包裝的方法
function renderProductVaseList(dataAry){
    const productVaseRenderArea = document.getElementById('productVaseRenderArea');
    let tempStr = '';
    dataAry.filter(o=>o.type == "decorate").forEach(o=>{
        tempStr+=`
        <li class="col-6 col-md-4 col-lg-3 col-xl-2 mb-5 diy${o.id}-li">
            <label class="text-center w-100" for="diy${o.id}">
                <div class="border border-primary80 w-100 p-1 mb-5 radious20 vaseImage imgHover">
                    <div class="productItem" style="background-image: url('assets/images/diy/${o.imgName}');">

                    </div>
                </div>
                
                <h3 class="h5 text-dark">${o.name}</h3>
                
            </label>
            <input type="radio" name="vase" id="diy${o.id}" value="${o.id}" data-price="${o.price}" onclick="checkedVase(${o.id})" class="d-none">
        </li>
        `
    })
    productVaseRenderArea.innerHTML = tempStr;
}

// 送出訂單 + 表單驗證
function sendProductOrder(){
    const flowers = document.querySelectorAll('input[name="flower"]');
    const vases = document.querySelector('input[name = "vase"]');
    const orderName = document.getElementById('orderName');
    const orderPhoneNum = document.getElementById('orderPhoneNum');
    const orderMail = document.getElementById('orderMail');
    const orderAddress = document.getElementById('orderAddress');
    const loginMember = JSON.parse(localStorage.getItem("loginMember"));
    
    let vaseName = '';
    let serialNumTemp = '';
    let orderDate = new Date();
    let productTotalCost = 0;
    let order = {
        "flowers" :[],
    }
    flowers.forEach(o=>{
        if(o.checked){
            order.flowers.push(o.value);
            productTotalCost += parseInt(o.dataset.price);
        }
        
    }) 
    order.vases = vases.value;
    productTotalCost += parseInt(vases.dataset.price);
    order.totalCost = productTotalCost;
    order.name = orderName.value;
    order.phone = orderPhoneNum.value;
    order.mail = orderMail.value;
    order.address = orderAddress.value;
    order.usersId = loginMember.id;
    order.orderDate = orderDate;
    order.state = 1 // 1:訂單處理中 2:包裹配送中 3:包裹已送達 4:買家完成取貨付款
    serialNumTemp += orderDate.getFullYear()+''+(orderDate.getMonth()+1)+orderDate.getDate()+createSerialNum();
    order.serialNum = serialNumTemp;
    // console.log(order);
    if(order.flowers.length==0){
        alert('請選擇想使用的花卉');
        location.href = 'product.html#';
    } else if(order.vases==''){
        alert('請選擇想使用的容器或裝飾');
        location.href = 'product.html#';
    } else if(orderName.value==''||orderPhoneNum.value==''||orderMail.value==''||orderAddress.value==''){
        alert('表單填寫不完全');
    } else {
        axios.post('http://localhost:3000/flowerOrders', order).then(resp=>{
            alert('訂單已送出');
            location.href = 'product.html'
        }).catch(resp=>{
            alert('訂單送出失敗')
        })
    }    
}

// 新增流水號
function createSerialNum(){
    let serialNum = '';
    for(let i=0; i<5; i++){
        serialNum += Math.floor(Math.random()*10);
    }
    return serialNum;
}