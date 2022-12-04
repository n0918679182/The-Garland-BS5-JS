function adminOrderInit() {
    // 控制左側選單 選中時的效果
    localStorage.setItem("pageCode", 3);
    Promise.all([axios.get('http://localhost:3000/flowerOrders'), axios.get('http://localhost:3000/users')]).then(resp => {
        const orders = resp[0].data;
        const users = resp[1].data;
        renderAdminOrderList(orders, users)
    })
}

// 渲染訂單清單的方法
function renderAdminOrderList(ordersAry, usersAry) {
    const adminOrderListArea = document.getElementById('adminOrderListArea');
    let temp = '';
    ordersAry.forEach(o => {
        let userData = usersAry.filter(u => u.id == o.usersId);
        temp += `
            <tr class="align-middle">
                <td>${userData[0].name}</td>
                <td>${o.serialNum}</td>
                <td>${o.orderDate.substring(0, 10)}</td>
                <td>
                    <div class="btn-small adminOrderDetailBtn">
                        <a class="w-100 d-none d-lg-flex justify-content-lg-center" href="#" data-bs-toggle="modal"
                            data-bs-target="#adminOrderTable" onClick="orderDetail(${o.id})">檢視</a>
                    </div>
                </td>
            </tr>`
    })
    adminOrderListArea.innerHTML = temp;
}

// 依據輸入的關鍵字做查詢
function searchOrder() {
    const orderData2 = document.getElementById('orderData2');
    const orderData1 = document.getElementById('orderData1');
    const orderName = document.getElementById('orderName');
    const orderId = document.getElementById('orderId');
    const orderPhone = document.getElementById('orderPhone');


    if (orderData2.value == '' && orderData1.value == '' && orderName.value == '' && orderId.value == '' && orderPhone.value == '') {
        // 如果都沒有輸入就渲染全部
        Promise.all([axios.get('http://localhost:3000/flowerOrders'), axios.get('http://localhost:3000/users')]).then(resp => {
            const orders = resp[0].data;
            const users = resp[1].data;
            renderAdminOrderList(orders, users);;
        })
    } else {
        // 否則在網址列使用方法做查詢
        axios.get('http://localhost:3000/users').then(resp => {
            const users = resp.data;
            axios.get('http://localhost:3000/flowerOrders' + filterName(users) + filterId() + filterPhone()).then(r => {
                const orders = r.data;
                if (orderData1.value != '' || orderData2.value != '') {
                    let ordersInDate = filterDate(orderData1.value, orderData2.value, orders);
                    renderAdminOrderList(ordersInDate, users);
                } else {
                    renderAdminOrderList(orders, users);
                }
            })
        })
    }
}

// 根據訂單姓名做篩選
function filterName(users) {
    const orderName = document.getElementById('orderName').value;
    let user = users.filter(o => o.name == orderName)[0]
    if (orderName == '') {
        return '';
    } else {
        return '?usersId=' + user.id;
    }
}

// 根據訂單編號做篩選
function filterId() {
    const orderId = document.getElementById('orderId').value;
    if (orderId == '') {
        return '';
    } else {
        if (filterName() == '') {
            return '?serialNum=' + orderId;
        } else {
            return '&serialNum=' + orderId;
        }
    }
}

// 根據訂單電話做篩選
function filterPhone() {
    const orderPhone = document.getElementById('orderPhone').value;
    if (orderPhone == '') {
        return '';
    } else {
        if (filterName() == '' && filterId() == '') {
            return '?phone=' + orderPhone;
        } else {
            return '&phone=' + orderPhone;
        }
    }

}

// 根據日期範圍做篩選
function filterDate(d1, d2, ary) {
    if (d1 == '') {
        d1 = new Date('1990/01/01');
    }
    if (d2 == '') {
        d2 = new Date().toLocaleDateString().split('/').join('-');
    }

    let newAry = ary.filter(o => {
        return new Date(o.orderDate.substring(0, 10)).getTime() >= new Date(d1).getTime() &&
            new Date(o.orderDate.substring(0, 10)).getTime() <= new Date(d2).getTime();
    })
    return newAry;
}

// 渲染訂單明細的方法
function orderDetail(id) {
    const adminOrderSerialNum = document.getElementById('adminOrderSerialNum');          //訂單編號
    const adminOrderUserName = document.getElementById('adminOrderUserName');            //訂單姓名
    const adminOrderPhone = document.getElementById('adminOrderPhone');                  //連絡電話
    const adminOrderOrderDate = document.getElementById('adminOrderOrderDate');          //訂單日期
    const adminOrderShipDate = document.getElementById('adminOrderShipDate');            //預估出貨日期
    const adminOrderReceiveName = document.getElementById('adminOrderReceiveName');      //收貨人姓名
    const adminOrderAddress = document.getElementById('adminOrderAddress');              //出貨地址
    const adminOrderState = document.getElementById('adminOrderState');                  //訂單狀態
    adminOrderState.dataset.orderId = id;
    Promise.all([axios.get('http://localhost:3000/flowerOrders?id=' + id), axios.get('http://localhost:3000/users')]).then(resp => {
        let order = resp[0].data[0];
        let users = resp[1].data;
        adminOrderSerialNum.textContent = order.serialNum;
        adminOrderUserName.textContent = users.filter(o => o.id == order.usersId)[0].name;
        adminOrderPhone.textContent = order.phone;
        adminOrderOrderDate.textContent = order.orderDate.substring(0, 10);
        let orderDate = new Date(order.orderDate.substring(0, 10));
        adminOrderShipDate.textContent = orderDate.addDays(3);
        adminOrderReceiveName.textContent = order.name;
        adminOrderAddress.textContent = order.address;
        adminOrderState.value = order.state;
        renderAdminOrderProductArea(order);
    })
}

// 指定日期加上天數的方法
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this.toLocaleDateString().split('/').join('-');
}

// 渲染明細內的產品清單
function renderAdminOrderProductArea(ary){
    const adminOrderProductArea = document.getElementById('adminOrderProductArea');      //訂購內容
    let temp = '';
    axios.get('http://localhost:3000/products').then(resp=>{
        ary.flowers.forEach(o=>{
            temp += `
            <li class="d-flex justify-content-between mb-1">
                <p class="m-0">${resp.data.filter(p=>p.id == o)[0].name}</p>
                <p class="m-0">${resp.data.filter(p=>p.id == o)[0].price} $</p>
            </li>
            `
        })
        temp += `
            <li class="d-flex justify-content-between mb-1">
                <p class="m-0">運費</p>
                <p class="m-0">80 $</p>
            </li>
            <hr class="my-2">
            <li class="d-flex justify-content-between">
                <p class="m-0">小結</p>
                <p class="m-0">${ary.totalCost + 80} $</p>
            </li>
            `

        adminOrderProductArea.innerHTML = temp;
    })
}

// 修改訂單狀態的方法
function changeOrderState(){
    const adminOrderState = document.getElementById('adminOrderState');                  //訂單狀態
    axios.patch('http://localhost:3000/flowerOrders/'+adminOrderState.dataset.orderId,{
        "state": parseInt(adminOrderState.value)
    }).then(resp=>{
        console.log('狀態更改成功')
    })
}

// 刪除訂單
function deleteOrder(){
    const adminOrderState = document.getElementById('adminOrderState');                  //訂單狀態(單純要取得訂單id)
    console.log(adminOrderState.dataset.orderId)
    axios.delete('http://localhost:3000/flowerOrders/'+adminOrderState.dataset.orderId).then(resp=>{
        alert('訂單已取消')
        location.href = 'admin-order.html'
    })
}

