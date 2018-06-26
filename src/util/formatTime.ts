export default function formatTime(date: string) {
    const SECOND = 1000;
    const MINUTE = 60000;
    const HOUR = 3600000;
    const DAY = 86400000;
    const WEEK = 604800000;
    const MONTH = 18144000000;

    const now = new Date(Date.now());
    const time = new Date(date);
    const timediff = +now - +time;

    if (timediff / MONTH >= 1) {
        return `${Math.floor(timediff / MONTH)}month`;
    } else if (timediff / WEEK >= 1) {
        return `${Math.floor(timediff / WEEK)}w`;
    } else if (timediff / DAY >= 1) {
        return `${Math.floor(timediff / DAY)}d`;
    } else if (timediff / HOUR >= 1) {
        return `${Math.floor(timediff / HOUR)}h`;
    } else if (timediff / MINUTE >= 1) {
        return `${Math.floor(timediff / MINUTE)}m`;
    } else if (timediff / SECOND >= 1) {
        return `${Math.floor(timediff / SECOND)}s`;
    }
}
