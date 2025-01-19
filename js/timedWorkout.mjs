export {TimedWorkout, generateTimedWorkout}

class TimedWorkout
{
    constructor(id, exercise, minutes, seconds)
    {
        this.id = id;
        this.exercise = exercise;
        this.minutes = minutes;
        this.seconds = seconds;
    }
}

function generateTimedWorkout(id, exercise, minutes, seconds)
{
    return new TimedWorkout(id, exercise, minutes, seconds);
}