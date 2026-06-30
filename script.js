const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 1;
let lastLapTime = 0;

function formatTime(timeInMs) {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInMs % 1000) / 10);

    return {
        mins: minutes.toString().padStart(2, '0'),
        secs: seconds.toString().padStart(2, '0'),
        ms: milliseconds.toString().padStart(2, '0')
    };
}

function updateDisplay(time) {
    const formattedTime = formatTime(time);
    minutesDisplay.textContent = formattedTime.mins;
    secondsDisplay.textContent = formattedTime.secs;
    millisecondsDisplay.textContent = formattedTime.ms;
}

function updateTime() {
    const now = Date.now();
    const currentElapsedTime = elapsedTime + (now - startTime);
    updateDisplay(currentElapsedTime);
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        isRunning = false;

        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('btn-danger');
        startPauseBtn.classList.add('btn-primary');

        lapBtn.disabled = true;
    } else {
        startTime = Date.now();
        timerInterval = setInterval(updateTime, 10);
        isRunning = true;

        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.remove('btn-primary');
        startPauseBtn.classList.add('btn-danger');

        lapBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    lapCounter = 1;
    lastLapTime = 0;

    updateDisplay(0);

    startPauseBtn.textContent = 'Start';
    startPauseBtn.classList.remove('btn-danger');
    startPauseBtn.classList.add('btn-primary');

    lapBtn.disabled = true;

    lapsList.innerHTML = '';
}

function recordLap() {
    if (!isRunning) return;

    const now = Date.now();
    const currentTotalTime = elapsedTime + (now - startTime);
    const lapTime = currentTotalTime - lastLapTime;
    lastLapTime = currentTotalTime;

    const formattedLapTime = formatTime(lapTime);
    const formattedTotalTime = formatTime(currentTotalTime);

    const lapItem = document.createElement('li');
    lapItem.classList.add('lap-item');

    lapItem.innerHTML = `
        <span>Lap ${lapCounter.toString().padStart(2, '0')}</span>
        <span>${formattedLapTime.mins}:${formattedLapTime.secs}.${formattedLapTime.ms}</span>
        <span>${formattedTotalTime.mins}:${formattedTotalTime.secs}.${formattedTotalTime.ms}</span>
    `;

    lapsList.prepend(lapItem);
    lapCounter++;
}

startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
updateDisplay(0);
