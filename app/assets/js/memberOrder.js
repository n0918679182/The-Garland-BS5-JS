function memberOrderInit(){
    localStorage.setItem("memberPageCode",3);
    const loginMember = JSON.parse(localStorage.getItem('loginMember'));
    Promise.all([axios.get('http://localhost:3000/flowerOrders?usersId=' + loginMember.id),axios.get('http://localhost:3000/products')]).then(resp=>{
        const orders = resp[0].data;
        const products = resp[1].data;
        renderOrder(orders,products)
        
    })
    
}

// 渲染訂單的方法
function renderOrder(orders, products){
    let orderTemp = '';
    const accordionArea = document.getElementById('accordionArea');
    // 先渲染出每筆訂單
    orders.forEach(o=>{
        orderTemp += `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne${o.id}">
                <div class="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne${o.id}" aria-expanded="true" aria-controls="collapseOne${o.id}">
                    <div class="d-flex justify-content-between align-items-center w-100 pe-5">
                        <p class="m-0">訂單編號：${o.serialNum}</p>
                        <p class="m-0">${o.orderDate.substring(0,10)}</p>
                    </div>
                </div>
            </h2>
            <div id="collapseOne${o.id}" class="accordion-collapse collapse show" aria-labelledby="headingOne${o.id}" data-bs-parent="#accordionArea">
                <div class="accordion-body" id="orderProductsArea">
                    <ul class="list-unstyled row" id="productsArea${o.id}">

                        
                    </ul>
                </div>
                <div class="w-100 bg-primaryTint py-3 pe-10 d-flex justify-content-end">
                    <div class="d-flex flex-column w-25 text-dark">
                        <div class="d-flex justify-content-between mb-1">
                            <p class="m-0">小計：</p>
                            <p class="m-0">NT$ ${o.totalCost}</p>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <p class="m-0">運費：</p>
                            <p class="m-0">NT$ 80</p>
                        </div>
                        <div class="d-flex justify-content-between mb-1 fw-bolder">
                            <p class="m-0">總計：</p>
                            <p class="m-0">NT$ ${o.totalCost+80}</p>
                        </div>
                    </div>
                </div>
                <div class="accordion-body">
                    <p>收件人：${o.name}</p>
                    <p>訂單狀態：${o.state==1?'待出貨':(o.state==2?'已出貨':(o.state==3?'送達門市':'已取貨'))}</p>
                    <p>付款方式：貨到付款</p>
                    <p>收件地址：${o.address}</p>
                </div>
            </div>
        </div>`;
        
    })
    accordionArea.innerHTML = orderTemp;
    
    // 才能渲染每筆訂單內的所有商品
    orders.forEach(o=>{
        let productTemp = '';
        const productsArea = document.getElementById(`productsArea${o.id}`);
        o.flowers.forEach(p=>{
            productTemp+=`
                <li class="col-sm-6 col-xl-4 d-flex justify-content-around align-items-center mb-3">
                    <div class="radious8 orderProduct shadow" style="background-image: url('assets/images/diy/${products[parseInt(p)-1].imgName}');"></div>
                    <p class="m-0">${products[parseInt(p)-1].name}</p>
                    <p class="m-0">NT$${products[parseInt(p)-1].price}</p>
                </li>
            `
        })
        productTemp+=`
            <li class="col-sm-6 col-xl-4 d-flex justify-content-around align-items-center mb-3">
                <div class="radious8 orderProduct shadow" style="background-image: url('assets/images/diy/${products[parseInt(o.vases)-1].imgName}');"></div>
                <p class="m-0">${products[parseInt(o.vases)-1].name}</p>
                <p class="m-0">NT$${products[parseInt(o.vases)-1].price}</p>
            </li>
        `
        productsArea.innerHTML = productTemp;
    })
}
