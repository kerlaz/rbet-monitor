export function netDate(netString) {
    let reg = /[a-zA-Z()/]/g;
    let time = netString.replace(reg,"").split("+");
    console.log('time',time);
    let d = new Date(parseInt(time[0],10));
    let tz = timeZone(time[1]);
    console.log(tz);
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
export function sortFactorGroups(){

}