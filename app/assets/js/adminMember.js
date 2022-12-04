function adminMemberInit(){
    // 控制左側選單 選中時的效果
    localStorage.setItem("pageCode", 1);


    // 渲染會員清單
    axios.get('http://localhost:3000/users').then(resp => {
        renderMemberList(resp.data);

    })

    document.getElementById('searchMember').addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            document.getElementById('searchMemberBT').click();
        }
    
    })
    
}

// 渲染會員清單的方法
function renderMemberList(aryData) {
    
    const memberListRenderArea = document.getElementById('memberListRenderArea');   // 渲染會員清單的區域
    let memberListTemp = '';                                                        // 暫存渲染的HTML
    aryData.forEach(o => {
        if (o.permission == "administrator") {
            return;
        } else {
            let n = o.name;
            memberListTemp +=
                `<li class="col-2 mb-13">
                    <a class="rounded-circle bg-primary60 d-flex justify-content-center align-items-center memberPic" 
                        data-bs-toggle="modal" data-bs-target="#memberModal" onclick="renderMemberModal('${o.id}')">
                        <h3 class="h5 text-white m-0">${o.name}</h3>
                    </a>
                </li>`;
        }
    });
    memberListRenderArea.innerHTML = memberListTemp;
}

// 渲染會員modal的方法
function renderMemberModal(oid) {
    const mName = document.getElementById('memberModalLabel');
    const mAccount = document.getElementById('mAccount');
    const mPwd = document.getElementById('mPwd');
    const mMail = document.getElementById('mMail');
    const mPhone = document.getElementById('mPhone');
    const mAddress = document.getElementById('mAddress');
    const deleteMemberBT = document.getElementById('deleteMemberBT');

    axios.get('http://localhost:3000/users/' + oid).then(resp => {
        let obj = resp.data;
        mName.textContent = obj.name;
        mAccount.textContent = obj.account;
        mPwd.textContent = obj.password;
        mMail.textContent = obj.mail;
        mPhone.textContent = obj.phone;
        mAddress.textContent = obj.address;
        deleteMemberBT.dataset.memberId = obj.id;
    })

}

// 讓原本的對話框消失
function didappearArea() {
    console.log('didappearArea')
    document.querySelector('.adminMemberModal').classList.add('op0');
}

// 回復消失的對話框
function appearArea() {
    document.querySelector('.adminMemberModal').classList.remove('op0')
}

// 刪除會員的方法
function deleteMember() {
    const deleteMemberBT = document.getElementById('deleteMemberBT');
    let memberId = deleteMemberBT.dataset.memberId;
    axios.delete('http://localhost:3000/users/' + memberId).then(resp => {
        location.href = 'admin-member.html';
    })
}



// 關鍵字搜尋並重新渲染畫面
function searchMember() {
    const keyword = document.getElementById('searchMember');
    if (keyword.value == '') {
        axios.get('http://localhost:3000/users').then(resp => {
            renderMemberList(resp.data);
        })
    } else {
        axios.get('http://localhost:3000/users?q=' + keyword.value).then(resp => {
            renderMemberList(resp.data);
        })
    }

}