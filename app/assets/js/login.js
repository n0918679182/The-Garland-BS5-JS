function loginInit(){
    const account = document.getElementById("account");
    const password = document.getElementById("password");
    const loginBT = document.getElementById("loginBT");


    axios.get('http://localhost:3000/users').then(function (response) {

        console.log(response.data);
        validAccount(response.data);
    });

    function validAccount(aryData) {
        loginBT.addEventListener("click", function () {
            console.log(account.value)
            console.log(password.value)
            let wrongInput = true;
            aryData.forEach(o=>{
                if(account.value == o.account){
                    if(password.value == o.password){
                        wrongInput = false;
                        localStorage.setItem('loginMember',JSON.stringify(o));
                    }
                }
            });
            if(wrongInput){
                alert("您輸入的帳號或密碼有誤!");
                account.value = "";
                password.value = "";
            }else{
                const member = JSON.parse(localStorage.getItem('loginMember'));
                alert("歡迎 "+member.name+" 登入!");
                location.href = "index.html";

            }
            
        })
    }
}