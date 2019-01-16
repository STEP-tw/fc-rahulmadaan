const blink = function () {
    let image = document.getElementById("imageToBlink").style;
    image.visibility= 'hidden';
    setTimeout(() => {
        image.visibility = 'visible';
    }, 1000);
}

