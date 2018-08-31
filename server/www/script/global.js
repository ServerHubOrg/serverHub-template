let _name = document.querySelector('#name');
let _confirm = document.querySelector('#confirm');
window.addEventListener('load', () => {
    let v = document.querySelector('#video');
    v.addEventListener('ended', () => {
        v.currentTime = 0;
        v.play();
    });
    v.play();
    const changeListener = () => {
        if (_name.value && _name.value.match(/^[a-z_][a-z\d_-]{1,18}[a-z\d_]$/i)) {
            _confirm.removeAttribute('disabled');
        }
        else
            _confirm.setAttribute('disabled', 'true');
    };
    _name.addEventListener('change', changeListener);
    _name.addEventListener('input', changeListener);
    _name.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            _confirm.click();
        }
    });
    _confirm.addEventListener('click', () => {
        if (_confirm.hasAttribute('disabled'))
            return;
        window.location.href = '/chat?name=' + _name.value.trim();
    });
});
