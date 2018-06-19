export function netDate(netString) {
    let reg = /[a-zA-Z()/]/g;
    let time = netString.replace(reg,"").split("+");
    // console.log('time',time);
    let d = new Date(parseInt(time[0],10));
    let tz = timeZone(time[1]);
    // console.log(tz);
    d.setHours(d.getHours()+tz[0]);
    d.setMinutes(d.getMinutes()+tz[1]);
    return addZero(d.getHours())+":"+addZero(d.getMinutes());
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