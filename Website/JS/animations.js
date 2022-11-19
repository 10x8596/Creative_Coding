const btnHamburger = document.querySelector('#btnHamburger');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const nav_colr = document.querySelector('nav');
const fadeElements = document.querySelectorAll('.has-fade');
const body = document.querySelector('body');
//const canvas1 = document.querySelector('.canvas-fade');

// animation for menu icon
btnHamburger.addEventListener('click', function(){
    console.log('open menu');
    if (header.classList.contains('open')) { // close menu
        body.classList.remove('no-scroll');
        header.classList.remove('open');
        fadeElements.forEach(function(element){
            element.classList.remove('fade-in');
            element.classList.add('fade-out');
        });
        nav_colr.classList.remove('open-menu');
        //canvas1.classList.remove('canvas-fade-out');

    } else { // open menu
        body.classList.add('no-scroll');
        header.classList.add('open');
        fadeElements.forEach(function(element){
            element.classList.remove('fade-out');
            element.classList.add('fade-in');
        });
        nav_colr.classList.add('open-menu');
        //canvas1.classList.add('canvas-fade-out');
    }
});

// SlideShow
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

//Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("text");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}


// // switching between iframes
// const frame1 = document.getElementById("frame1");
// const frame2 = document.getElementById("frame2");
// const next = document.getElementsByClassName("right");
// const prev = document.getElementsByClassName("left");

// $('frame1').toggle();
// $('next').click(function() {
//     $('frame2').toggle();
//     $('frame1').toggle();
// });


