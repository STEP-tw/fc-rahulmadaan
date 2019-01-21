const blink = function () {
    let image = document.getElementById("flowerImage").style;
    image.visibility = 'hidden';
    setTimeout(() => {
        image.visibility = 'visible';
    }, 1000);
};