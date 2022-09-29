let input = document.querySelector(".BillNo");
let BillNo = document.querySelectorAll(".bill");
let btn = document.querySelector(".search");
let showError = document.querySelector(".showerror");


btn.addEventListener("click", function(){
    BillNo.forEach(function(item){
        if(input.value === item.innerText){
            item.style.backgroundColor = "red";
        }
    });
    input.value = "";
});



