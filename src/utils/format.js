import moment from 'moment'

export function filterTime(time) {
    if (time == "0001-01-01T00:00:00Z" || !time) return ""
    return moment(time).format('Y-MM-DD hh:mm:ss a')
}
export function filterTimeYMD(time) {
    if (time == "0001-01-01T00:00:00Z" || !time) return ""
    return moment(time).format('Y-MM-DD')
}
export function filterTimeHMS(time) {
    if (time == "0001-01-01T00:00:00Z" || !time) return ""
    return moment(time).format('hh:mm:ss a')
}