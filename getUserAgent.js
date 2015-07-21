function getUserAgent() {
    if (navigator.userAgent.match(/Android/i)) return 1;
    if (navigator.userAgent.match(/webOS/i)) return 2;
    if (navigator.userAgent.match(/iPhone/i)) return 3;
    if (navigator.userAgent.match(/iPad/i)) return 4;
    if (navigator.userAgent.match(/iPod/i)) return 5;
    if (navigator.userAgent.match(/BlackBerry/i)) return 6;
    if (navigator.userAgent.match(/Windows Phone/i)) return 7;
    return 0;
}
function test() {
    switch (getUserAgent()) {
        case 1:
            alert('Adroid');
            break;
        case 2:
            alert('WebOS');
            break;
        case 3:
            alert('iPhone');
            break;
        case 4:
            alert('iPad');
            break;
        case 5:
            alert('iPod');
            break;
        case 6:
            alert('BlackBerry');
            break;
        case 7:
            alert('Windows Phone');
            break;
        case 0:
            alert('NB');
            break;
    }
}
test();
