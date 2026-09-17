let cartTotal = 0;
 
    function addToCart(productName) {
        cartTotal++;
        document.getElementById('cart-count').innerText = cartTotal;
        alert(productName + " has been added to your cart!");
    }

    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
        document.body.style.backgroundColor = "white";
    }
