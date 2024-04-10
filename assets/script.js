// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

const addButton = $('#addButton');
const titleInput = $('#task-title');
const dateInput = $('#add-date');
const descriptionInput = $('#task-description');
const todoList = $('#todo-cards');
const inProgress = $('#in-progress-cards');
const doneTask = $('#done-cards');
const formModal = $('#formModal');


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = `
    <div class="card" data-taskId="${task.id}">
      <div class="card-body">
        <h5 class="task-title">${task.addTitle}</h5>
        <p class="card-text">${task.addDate}</p>
        <p class="card-text">${task.addDescription}</p>
        <a href="#" class="btn btn-primary delete-task">Delete</a>
      </div>
    </div>
  `;
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        const newTaskCard = createTaskCard(task);
        const cardElement = $(newTaskCard);
        switch (task.progress) {
            case 'Not Yet Started':
                $('#todo-cards').append(cardElement);
                break;
            case 'In Progress':
                $('#in-progress-cards').append(cardElement);
                break;
            case 'Completed':
                $('#done-cards').append(cardElement);
                break;
        }
    });

    $('.card').draggable({
        revert: true,
        cursor: 'move'
    });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    console.log("test")
    const addTitle = titleInput.val()
    console.log(addTitle)
    const addDate = dateInput.val()
    console.log(addDate)
    const addDescription = descriptionInput.val()
    console.log(addDescription)

    // Grabing the list orcreating it.
    var existingTasks = JSON.parse(localStorage.getItem('tasksPost')) || [];

    //grouped the info together into an object
    var newTask = { addTitle, addDate, addDescription };

    existingTasks.push(newTask);

    localStorage.setItem('tasksPost', JSON.stringify(existingTasks));

    formModal.modal("hide")

    const newTaskCard = createTaskCard(newTask)

    const cardElement = $(newTaskCard)

    todoList.append(cardElement)

}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();

    // Get the task card element that contains the delete button
    const taskCard = $(event.target).closest('.card');

    // Extract the task ID from the task card
    const taskId = taskCard.data('taskId');

    // Remove the task from the taskList array
    taskList = taskList.filter(task => task.id !== taskId);

    // Update localStorage with the modified taskList
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Remove the task card from the UI
    taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('taskId');
    const newStatus = $(this).attr('id');

    // Update the task progress state in taskList array
    taskList.forEach(task => {
        if (task.id === taskId) {
            task.progress = newStatus;
        }
    });

    // Update localStorage with the modified taskList
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    addButton.on("click", handleAddTask);

    $('.delete-task').on("click", handleDeleteTask);

    $('.task-lane').droppable({
        accept: '.card',
        drop: handleDrop
    });

    $('#add-date').datepicker();
});