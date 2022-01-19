const renderAddingTaskBtn = document.querySelector('.render-adding-task-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const addBtns = document.querySelectorAll('.add-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const deleteBtns = document.querySelectorAll('.filter-delete-p');

const allTasks = [];

class UI {
    static checkScreenSize() {
        let deviceSize = 0;
        if (window.screen.width >= 1200) {
            deviceSize = 'desktop';
        } else {
            deviceSize = 'mobile'
        }

        return deviceSize;
    }

    //toggling input wrapper on mobile devices
    static toggleMobileInputWrapper() {
        const paragraph = document.querySelector('.add-task-paragraph');
        const addingWrapper = document.querySelector('.adding-task-wrapper');

        renderAddingTaskBtn.classList.toggle('add-task-btn-translation');
        paragraph.classList.toggle('add-task-paragraph-translation');
        addingWrapper.classList.toggle('adding-task-wrapper-active');

        if (paragraph.textContent === 'add new task') {
            paragraph.textContent = 'in progress...';
        } else {
            paragraph.textContent = 'add new task';
        };
    }

    // Clearing text inputs after adding new tasks
    static clearInput() {
        const inputs = document.querySelectorAll('.adding-task-input');
        inputs.forEach(input => {
            input.value = '';
        })
    }

    static toggleTaskState(e) {
        if (e.target && e.target.classList.contains('tasks-checkbox')) {
            e.target.classList.toggle('tasks-checkbox-checked');
            e.target.closest('li').classList.toggle('tasks-li-checked');
        }

    }

    static displayAllTasks() {
        allTasks.forEach(task => {
            task.classList.add('visible');
            task.classList.remove('invisible');
        });
    }

    static displayActiveTasks() {
        allTasks.forEach(task => {
            if (task.classList.contains('tasks-li-checked')) {
                task.classList.remove('visible');
                task.classList.add('invisible');
            } else {
                task.classList.remove('invisible');
                task.classList.add('visible');
            }
        });
    }

    static displayCompletedTasks() {
        allTasks.forEach(task => {
            if (task.classList.contains('tasks-li-checked')) {
                task.classList.remove('invisible');
                task.classList.add('visible');
            } else {
                task.classList.remove('visible');
                task.classList.add('invisible');
            }
        });
    }

    static toggleFitlerBtnState(e) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
    }

    static resetFilterBtnState() {
        filterBtns.forEach(btn => {
            if (btn.dataset.type === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        })
    }
};


//ToDoTask class - class that represent a single task
class ToDoTask {
    constructor(text) {
        this.text = text;
    }
};

//ToDoList class - class that represent a task list
class ToDoList {
    constructor() {}
    //Creating new ToDoTask object
    createNewTask(deviceSize) {
        //Creating new task object with user input
        //validation of input
        let inputTextValue = document.querySelector(`.${deviceSize}-adding-task-input`).value;
        if (inputTextValue === '' || inputTextValue.trim() === '') {
            return;
        } else {
            const task = new ToDoTask(inputTextValue);
            return task;
        }
    }

    //Rendering new ToDoTask object on the UI and adding it to tasks array
    renderNewTask(task) {
        const liWrapper = document.querySelector('.tasks-ul');
        const liTemplate = document.querySelector('.temp-li');
        const li = liTemplate.content.cloneNode(true);
        li.querySelector('.tasks-paragraph').textContent = task.text;
        liWrapper.append(li);
        UI.displayAllTasks();
        UI.clearInput();
        UI.toggleMobileInputWrapper();
        UI.resetFilterBtnState();
        allTasks.push(liWrapper.querySelector('li:last-of-type'));
    }

    filterTask(filterBtn) {
        const btnType = filterBtn.dataset.type;
        switch (btnType) {
            case 'all':
                UI.displayAllTasks();
                break;
            case 'active':
                UI.displayActiveTasks();
                break;
            case 'completed':
                UI.displayCompletedTasks();
                break;
            default:
                break;
        };
    }

    deleteCompleted() {
        allTasks.forEach(task => {
            if (task.classList.contains('tasks-li-checked')) {
                // Storage.removefromLocalTasks(task);
                task.remove();
            };
        });
    }
};

//Storage class - class that is responsible for saving tasks in local storage
// class Storage {
//     static checkLocalTasks() {
//         let tasks;
//         if (localStorage.getItem('tasks') === null) {
//             tasks = [];
//         } else {
//             tasks = JSON.parse(localStorage.getItem('tasks'));
//         }
//         console.log(tasks);
//         return tasks;
//     }

//     static saveToLocalTasks(task) {
//         let tasks = Storage.checkLocalTasks();
//         tasks.push(task);
//         localStorage.setItem('tasks', JSON.stringify(tasks));
//     }

//     static removefromLocalTasks(task) {
//         let tasks = Storage.checkLocalTasks();
//         tasks.pop(task);
//         localStorage.setItem('tasks', JSON.stringify(tasks));
//     }

//     static renderLocalTasks() {

//     }
// }

// Storage.renderLocalTasks();

const toDoList = new ToDoList();

renderAddingTaskBtn.addEventListener('click', UI.toggleMobileInputWrapper);

cancelBtn.addEventListener('click', UI.toggleMobileInputWrapper);

//using event delegation to change the visual state of task
document.addEventListener('click', UI.toggleTaskState);

addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const deviceSize = UI.checkScreenSize();
        const taskEl = toDoList.createNewTask(deviceSize);
        toDoList.renderNewTask(taskEl);
    })
});

//Adding new tasks with 'Enter' key
document.querySelector('.side-menu').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const deviceSize = UI.checkScreenSize();
        const taskEl = toDoList.createNewTask(deviceSize);
        toDoList.renderNewTask(taskEl);
    }
})

filterBtns.forEach(filterBtn => {
    filterBtn.addEventListener('click', UI.toggleFitlerBtnState);
    filterBtn.addEventListener('click', () => {
        toDoList.filterTask(filterBtn);
    });
})

deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', toDoList.deleteCompleted);
})
