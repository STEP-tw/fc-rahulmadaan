const blink = function () {
    let image = document.getElementById("flowerImage").style;
    image.visibility = 'hidden';
    setTimeout(() => {
        image.visibility = 'visible';
    }, 1000);
};

const printGuestBook = function () {
    document.getElementById("userComments").innerHTML = ()=>{
        readFile("./comments.json",(err,contents)=>{
            document.getElementById("userComments").innerText=JSON.parse(contents);
        });
    }
    // document.getElementById("").innerText = document.getElementById("").value;
};