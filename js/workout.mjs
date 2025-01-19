export {Workout, generateWorkout}

class Workout
{
    constructor(id, exercise, sets, reps)
    {
        this.id = id;
        this.exercise = exercise;
        this.sets = sets;
        this.reps = reps;
    }
}

function generateWorkout(id, exercise, sets, reps)
{
    return new Workout(id, exercise, sets, reps);
}