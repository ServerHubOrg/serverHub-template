window.addEventListener('load', () => {
    let v = document.querySelector('#video');
    v.addEventListener('ended', () => {
        v.currentTime = 0;
        v.play();
    });
    v.play();
});
