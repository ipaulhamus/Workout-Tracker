import {Workout, generateWorkout} from './workout.mjs';
import {TimedWorkout, generateTimedWorkout} from "./timedWorkout.mjs";
import {runTimer} from "./timer.mjs";

let workoutCount = 1;
let timedWorkoutCount = 1;

let workouts = [];
let timedWorkouts = [];

let validWorkoutIds = [];
let validTimedWorkoutIds = [];

let addWorkoutForm = document.getElementById('add-workout-form');
let editWorkoutForm = document.getElementById('edit-workout-form');
let deleteWorkoutForm = document.getElementById('delete-workout-form');
let completeWorkoutForm = document.getElementById('complete-workout-form');

let addTimedWorkoutForm = document.getElementById('add-timed-form');
let editTimedWorkoutForm = document.getElementById('edit-timed-form');

let editFeedback = document.getElementById('edit-feedback');
let deleteFeedback = document.getElementById('delete-feedback');
let completeFeedback = document.getElementById('complete-feedback');

let timedEditFeedback = document.getElementById('timed-feedback');

let workoutList = document.getElementById('workout-list');
let workoutTable = document.getElementById('workout-list');

let timedWorkoutList = document.getElementById('timed-list');
let timedWorkoutTable = document.getElementById('timed-list');

let isCreating = false;
let isEditing = false;
let isDeleting = false;
let isCompleting = false;

let isCreatingTimed = false;
let isEditingTimed = false;

document.addEventListener('DOMContentLoaded', () =>
{
    document.getElementById('workout-create-start')
        .addEventListener('click', () =>
        {
            if(isEditing === false && isDeleting === false && isCompleting === false && isCreatingTimed === false && isEditingTimed === false)
            {
                addWorkoutForm.style.display = 'block';
                isCreating = true;
            }
        });

    document.getElementById('workout-edit-start')
        .addEventListener('click', () =>
        {
            let listCheck = checkListIfEmpty(validWorkoutIds);
            if(listCheck === true)
            {
                if (isCreating === false && isDeleting === false && isCompleting === false && isCreatingTimed === false && isEditingTimed === false)
                {
                    editWorkoutForm.style.display = 'block';
                    isEditing = true;
                }
            }
        });

    document.getElementById('workout-delete-start')
        .addEventListener('click', () =>
        {
            let listCheck = checkListIfEmpty(validWorkoutIds);
            if(listCheck === true)
            {
                if (isCreating === false && isEditing === false && isCompleting === false && isCreatingTimed === false && isEditingTimed === false)
                {
                    deleteWorkoutForm.style.display = 'block';
                    isDeleting = true;
                }
            }
        });

    document.getElementById('workout-complete-start')
        .addEventListener('click', () =>
        {
            let listCheck = checkListIfEmpty(validWorkoutIds);
            if(listCheck === true)
            {
                if (isCreating === false && isEditing === false && isDeleting === false && isCreatingTimed === false && isEditingTimed === false)
                {
                    completeWorkoutForm.style.display = 'block';
                    isCompleting = true;
                }
            }
        });

    document.getElementById('add-workout-form')
        .addEventListener('submit', (event) =>
        {
           event.preventDefault();
           const submitData = new FormData(event.target);
           //console.log([...submitData.entries()]);

           const workoutId = workoutCount;
           const workoutType = submitData.get('workout-type');
           const workoutReps = submitData.get('workout-reps');
           const workoutSets = submitData.get('workout-sets');

           addWorkoutToList(workoutId, workoutType, workoutSets, workoutReps);

           isCreating = false;

           addWorkoutForm.reset();
        });

    document.getElementById('edit-workout-form')
        .addEventListener('submit', (event) =>
        {
           event.preventDefault();

           const submitData = new FormData(event.target);

           const workoutId = submitData.get('workout-edit-id');
           const workoutType = submitData.get('workout-edit-type');
           const workoutReps = submitData.get('workout-edit-reps');
           const workoutSets = submitData.get('workout-edit-sets');

           let valid = validateId(workoutId);

           if(valid === true)
           {
               editWorkout(workoutId, workoutType, workoutReps, workoutSets);

               isEditing = false;

               editWorkoutForm.reset();

               editFeedback.innerHTML = "";
           }
           else
           {
               editFeedback.innerHTML = "Invalid ID! PLease Enter an ID listed!"
           }
        });

    document.getElementById('delete-workout-form')
        .addEventListener('submit', (event) =>
        {
           event.preventDefault();

           const submitData = new FormData(event.target);

           const workoutId = submitData.get('workout-delete-id');

            let valid = validateId(workoutId);

            if(valid === true)
            {
                deleteWorkout(workoutId);

                isDeleting = false;

                deleteWorkoutForm.reset();

                deleteFeedback.innerHTML = "";
            }
            else
            {
                deleteFeedback.innerHTML = "Invalid ID! Please Enter An ID Listed!";
            }
        });

    document.getElementById('complete-workout-form')
        .addEventListener('submit', (event) =>
        {
            event.preventDefault();

            const submitData = new FormData(event.target);

            const workoutId = submitData.get('workout-complete-id');

            let valid = validateId(workoutId);

            if(valid === true)
            {
                completeWorkout(workoutId);

                isCompleting = false;

                completeWorkoutForm.reset();

                completeFeedback.innerHTML = "";
            }
            else
            {
                completeFeedback.innerHTML = "Invalid ID! Please Enter An ID Listed!";
            }
        });

    //Timed Workouts

    document.getElementById('timed-create-start')
        .addEventListener('click', () =>
        {
            if(isEditing === false && isDeleting === false && isCompleting === false && isCreating === false && isEditingTimed === false)
            {
                addTimedWorkoutForm.style.display = 'block';
                isCreatingTimed = true;
            }
        });

    document.getElementById('timed-edit-start')
        .addEventListener('click', () =>
        {
            let listCheck = checkListIfEmpty(validTimedWorkoutIds);
            if(listCheck === true)
            {
                if (isCreating === false && isDeleting === false && isCompleting === false && isCreatingTimed === false && isEditing === false)
                {
                    editTimedWorkoutForm.style.display = 'block';
                    isEditingTimed = true;
                }
            }
        });

    document.getElementById('add-timed-form')
        .addEventListener('submit', async (event) =>
        {
            event.preventDefault();
            const submitData = new FormData(event.target);
            //console.log([...submitData.entries()]);

            const workoutId = timedWorkoutCount;
            const workoutType = submitData.get('timed-type');
            const workoutMinutes = submitData.get('timed-minutes');
            const workoutSeconds = submitData.get('timed-seconds');

            isCreatingTimed = false;

            await addTimedWorkoutToList(workoutId, workoutType, workoutMinutes, workoutSeconds);
        });

    document.getElementById('edit-timed-form')
        .addEventListener('submit', (event) =>
        {
            event.preventDefault();

            const submitData = new FormData(event.target);

            const timedWorkoutId = submitData.get('timed-edit-id');
            const timedWorkoutType = submitData.get('timed-edit-type');

            let valid = validateTimedId(timedWorkoutId);

            if(valid === true)
            {
                editTimedWorkout(timedWorkoutId, timedWorkoutType);

                isEditingTimed = false;

                editTimedWorkoutForm.reset();

                timedEditFeedback.innerHTML = "";
            }
            else
            {
                timedEditFeedback.innerHTML = "Invalid ID! PLease Enter an ID listed!"
            }
        });
});

function addWorkoutToList(id, exercise, sets, reps)
{
    let newWorkout = generateWorkout(id, exercise, sets, reps);

    workouts.push(newWorkout);
    validWorkoutIds.push(id);

    let newRow = workoutList.insertRow(workoutList.rows.length);
    let idCell = newRow.insertCell(0);
    let exerciseCell = newRow.insertCell(1);
    let setsCell = newRow.insertCell(2);
    let repsCell = newRow.insertCell(3);

    idCell.innerText = newWorkout.id;
    exerciseCell.innerText = newWorkout.exercise;
    setsCell.innerText = newWorkout.sets;
    repsCell.innerText = newWorkout.reps;

    workoutCount++;

    addWorkoutForm.style.display = 'none';
}

async function addTimedWorkoutToList(id, exercise, minutes, seconds)
{
    let newTimedWorkout = generateTimedWorkout(id, exercise, minutes, seconds);

    console.log(validTimedWorkoutIds.toString());

    timedWorkouts.push(newTimedWorkout);
    validTimedWorkoutIds.push(id);

    console.log(validTimedWorkoutIds.toString());

    let newRow = timedWorkoutList.insertRow(timedWorkoutList.rows.length);
    let idCell = newRow.insertCell(0);
    let exerciseCell = newRow.insertCell(1);
    let timingCell = newRow.insertCell(2);

    let exerciseName = newTimedWorkout.exercise;

    idCell.innerText = newTimedWorkout.id;
    exerciseCell.innerText = newTimedWorkout.exercise;

    timedWorkoutCount++;

    addTimedWorkoutForm.style.display = 'none';

    addTimedWorkoutForm.reset();

    await runTimer(exerciseName, newRow, minutes, seconds);
}

function editWorkout(id, exercise, sets, reps)
{
    for(let i = 0; workoutTable.rows.length - 1; i++)
    {
        let currentRow = workoutTable.rows[i];

        let currentItem = currentRow.cells[0].innerText;

        if(currentItem === id.toString())
        {
            currentRow.cells[1].innerHTML = exercise;
            currentRow.cells[2].innerHTML = sets;
            currentRow.cells[3].innerHTML = reps;
            break;
        }
    }

    editWorkoutForm.style.display = 'none';
}

function editTimedWorkout(id, exercise)
{
    for(let i = 0; timedWorkoutTable.rows.length - 1; i++)
    {
        let currentRow = timedWorkoutTable.rows[i];

        let currentItem = currentRow.cells[0].innerText;

        if(currentItem === id.toString())
        {
            currentRow.cells[1].innerHTML = exercise;
            break;
        }
    }

    editTimedWorkoutForm.style.display = 'none';
}

function deleteWorkout(id)
{
    for(let i = 0; workoutTable.rows.length - 1; i++)
    {
        let currentRow = workoutTable.rows[i];

        let currentItem = currentRow.cells[0].innerText;

        if(currentItem === id.toString())
        {
            workoutTable.deleteRow(i);
            break;
        }
    }

    let removalIndex = 0;

    for (let i = 0; validWorkoutIds.length; i++)
    {
        let currentId = validWorkoutIds[i].toString();

        if(currentId === id)
        {
            removalIndex = i;
            break;
        }
    }

    console.log(validWorkoutIds.toString());

    validWorkoutIds.splice(removalIndex, 1);

    console.log(validWorkoutIds.toString());

    deleteWorkoutForm.style.display = 'none';
}

function completeWorkout(id)
{
    for(let i = 0; workoutTable.rows.length - 1; i++) {
        let currentRow = workoutTable.rows[i];

        let currentItem = currentRow.cells[0].innerText;

        if (currentItem === id.toString())
        {
            currentRow.cells[1].style.color = 'green';
            currentRow.cells[1].style.textDecoration = 'underline';
            currentRow.cells[2].style.color = 'green';
            currentRow.cells[2].style.textDecoration = 'underline';
            currentRow.cells[3].style.color = 'green';
            currentRow.cells[3].style.textDecoration = 'underline';
            break;
        }
    }

    completeWorkoutForm.style.display = 'none';
}

function validateId(id)
{
    for(let i = 0; i < validWorkoutIds.length; i++)
    {
        if(id === validWorkoutIds[i].toString())
        {
            return true;
        }
    }
     return false;
}

function validateTimedId(id)
{
    for(let i = 0; i < validTimedWorkoutIds.length; i++)
    {
        if(id === validTimedWorkoutIds[i].toString())
        {
            return true;
        }
    }
    return false;
}

function checkListIfEmpty(list)
{
    if(list.length < 1)
    {
        console.log("List check failed!")
        return false;
    }
    else
    {
        console.log("List check success!");
        return true;
    }
}



