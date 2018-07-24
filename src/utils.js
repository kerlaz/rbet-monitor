export function netDate(netString) {
    let reg = /[a-zA-Z()/]/g;
    let time = netString.replace(reg,"").split("+");
    // console.log('time',time);
    let d = new Date(parseInt(time[0],10));
    let n = new Date(Date.now());
    let tz = timeZone(time[1]);
    d.setHours(d.getHours()+tz[0]);
    d.setMinutes(d.getMinutes()+tz[1]);
    if(n-d < 0){
        return addZero(d.getDay()+1)+"."+addZero(d.getMonth()+1)+"."+d.getFullYear()+" "+addZero(d.getHours())+":"+addZero(d.getMinutes());
    } else {
        return addZero(d.getHours())+":"+addZero(d.getMinutes());
    }
}
export function addZero(i) {
    if (i < 10){
        i = "0"+i;
    }
    return i;
}
export function timestampToString(timestamp) {
    let d = new Date(timestamp);
    return addZero(d.getHours())+":"+addZero(d.getMinutes());
}
function timeZone(marker) {
    let hours = parseInt(marker.slice(0,2),10);
    let minutes = parseInt(marker.slice(2,4),10);
    return [hours, minutes];
}
export function sortFactorGroups(event){
    let str;
    switch (event) {
        case "0:0" : str = "Основные"; break;
        case "1:1" : str = "1-й тайм"; break;
        case "2:1" : str = "2-й тайм"; break;
        case "1:4" : str = "Угловые"; break;
        case "1:5" : str = "Желтые карточки"; break;
        case "1:6" : str = "Удары в створ"; break;
        case "1:7" : str = "Фолы"; break;
        case "1:8" : str = "Офсайды"; break;
        case "1:9" : str = "Ауты"; break;
        case "1:10" : str = "Удары от ворот"; break;
        case "1:11" : str = "Игроки"; break;
        case "1:12" : str = "Доп. ставки"; break;
        case "1:14" : str = "Удары по воротам"; break;
        default : str = event;
    }
    return str;
}

export function scrollTo(element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function(){
        currentTime += increment;
        element.scrollTop = Math.easeInOutQuad(currentTime, start, change, duration);
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

export function isVisible(elements){
    console.log(elements);
    for (let item of elements){
        if(item) console.log(item.offsetTop);
    }
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};