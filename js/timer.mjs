export {runTimer};

async function runTimer(workoutName, row, timerMinutes, timerSeconds)
{
    let minutes = parseInt(timerMinutes);
    let seconds = parseInt(timerSeconds);

    let minutesPrint = 0;
    let secondsPrint = 0;

    let counting = true;

    while(counting === true)
    {
        if(seconds === 0 && minutes !== 0)
        {
            minutes--;
            seconds = 60;
        }

        seconds--;

        if(seconds < 10)
        {
            secondsPrint = `0${seconds}`;
        }
        else
        {
            secondsPrint = seconds;
        }

        minutesPrint = minutes;

        let newText = `${minutesPrint} : ${secondsPrint}`;

        row.cells[2].innerText = newText;

        if(minutes === 0 && seconds === 0)
        {
            counting = false;

            alert(`Your workout is finished! Good job!`);

            row.cells[1].style.color = 'green';
            row.cells[1].style.textDecoration = 'underline';
            row.cells[2].style.color = 'green';
            row.cells[2].style.textDecoration = 'underline';

            break;
        }

        await new Promise(r => setTimeout(r, 1000));
    }
}