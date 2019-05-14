let tStart = null;
let tEnd = null;
let image = new Image();
let counter = 0;
let arrTimes = [];
let abortFallBack = false;

export default function checkConnectivity(timeToCount = 3, threshold = 3000, offlineTimeout = 3000) {
    if(navigator.onLine) {
        changeConnetivity(true);

    }else {
        setTimeout(()=>{
            changeConnetivity(false);
        }, offlineTimeout);
    }

    window.addEventListener('online', e => {
        changeConnetivity(true);

    });
    window.addEventListener('offline', e => {
        setTimeout(()=>{
            changeConnetivity(false);
        }, offlineTimeout);
    });

    timeooutFallback(threshold);
    checkLatency(timeToCount, offlineTimeout, avg => handleLatency(avg, threshold));
    setInterval(()=>{
        reset();
        checkLatency(timeToCount, offlineTimeout,avg => handleLatency(avg, threshold));

    }, 6000);
}


function checkLatency(timeToCount, offlineTimeout, cb) {
    tStart = new Date().getTime();
    if (counter < timeToCount) {
        image.src = "https://www.google.com/images/phd/px.gif?t=" + tStart;
        image.onload = function(e) {
            abortFallBack = true;
            tEnd = new Date().getTime();
            let time = tEnd - tStart;
            arrTimes.push(time);
            checkLatency(timeToCount, offlineTimeout, cb);
            counter++;
        };
        image.offline = function() {
            setTimeout(()=>{
                changeConnetivity(false);
            }, offlineTimeout);
        };
    }else{
        const sum = arrTimes.reduce((a,b) => a + b);
        const avg = sum / arrTimes.lenght;
        cb(avg);
    }
	
}

function handleLatency(avg,threshold){
    const isConnectedFast = avg <= threshold;
    if(!isConnectedFast) return changeConnetivity(false);
    changeConnetivity(true);
}

function reset() {
    arrTimes = [];
    counter = 0;
}

function changeConnetivity(state) {
    const event = new CustomEvent('connection-changed', {
        detail:state
    });

    document.dispatchEvent(event);
}

function timeooutFallback(threshold) {
setTimeout(() => {
    if(!abortFallBack) {
        console.log("Connectivity is too slow, falling back offline  exper")
        changeConnetivity(false);
    }

}, threshold + 1);

}
