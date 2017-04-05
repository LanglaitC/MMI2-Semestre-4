var action = "order";
var next = document.getElementById("choose_place");
var welcome = document.getElementById("welcome_page");
var order_list = document.getElementById("order_list");

next.addEventListener('click', function(){
	welcome.style.display = "none";
	order_list.style.display = "block";
});