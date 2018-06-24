import * as React from "react";

interface ScrollToProps {
    id?: string;
    offsetY?: number;
}

export default function ScrollTo({ id, offsetY }: ScrollToProps) {
    let settings = {
        duration: 500,
        easing: {
            outQuint: function (x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
        },
    };

    let percentage;
    let startTime;
    const node = id ? document.getElementById(id) : null;
    const body = document.body;
    const html = document.documentElement;
    const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
    );
    const nodeTop = node ? node.offsetTop : height;
    const nodeHeight = node ? node.offsetHeight : 0;
    const windowHeight = window.innerHeight;
    const offset = window.pageYOffset;
    const delta = nodeTop - offset - offsetY;
    const bottomScrollableY = height - windowHeight;
    const targetY = (bottomScrollableY < delta) ?
        bottomScrollableY - (height - nodeTop - nodeHeight + offset) : delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
        clearInterval(this.timer);
    }

    const step = () => {
        let yScroll;
        let elapsed = Date.now() - startTime;

        if (elapsed > settings.duration) {
            clearTimeout(this.timer);
        }

        percentage = elapsed / settings.duration;

        if (percentage > 1) {
            clearTimeout(this.timer);
        } else {
            yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
            window.scrollTo(0, yScroll);
            this.timer = setTimeout(step, 10);
        }
    };

    this.timer = setTimeout(step, 10);
}
