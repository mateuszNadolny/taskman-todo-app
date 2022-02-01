const addBtn = document.querySelector('.add-task-btn');
const taskInput = document.querySelector('.user-input');
const taskUl = document.querySelector('ul');

class Task {
    constructor(content, isCompleted, id) {
        this.content = content;
        this.isCompleted = isCompleted;
        this.id = id;
    }
}

class TaskList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.completedTasks = [];
        this.acviteTasks = [];
        this.render(this.tasks);
        this.filterBtnsHandler();

        addBtn.addEventListener('click', this.addTask.bind(this));
    }

    addTask() {
        let content;
        let currentId;

        if ((taskInput.value.trim()).length === 0) {
            this.renderPopup(`Task can't be empty`);
            setTimeout(this.renderPopup, 2000);
            return;
        } else if ((taskInput.value.trim()).length >= 55) {
            content = (taskInput.value.trim()).substring(0, 45);
            this.renderPopup(`Task can't take more than 55 words`);
            setTimeout(this.renderPopup, 3000);
        } else {
            content = taskInput.value.trim();
        }


        if (this.tasks.length === 0) {
            currentId = 1;
        } else {
            currentId = this.tasks[this.tasks.length - 1].id + 1;
        }

        this.tasks.push(new Task(content, false, currentId));
        this.updateTaskInLocalStorage();
        taskInput.value = '';
        this.render(this.tasks);
    }

    render(selectedTasks) {
        taskUl.innerHTML = '';
        this.createTaskList(selectedTasks);
        this.displayTaskList(this.tasks);
    }

    renderPopup(message) {
        const popup = document.querySelector('.popup');
        const text = popup.querySelector('p');
        text.textContent = message;
        popup.classList.toggle('popup-active');
    }

    createTaskList(selectedTasks) {
        selectedTasks.forEach(task => {
            let taskEl = document.createElement('li');
            let checkbox = document.createElement('input');
            let content = document.createElement('p');
            let deleteBtn = document.createElement('button');

            taskEl.classList.add('task-li');

            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');
            checkbox.checked = task.isCompleted;
            checkbox.addEventListener('change', (event) => {
                task.isCompleted = !task.isCompleted;
                this.updateTaskInLocalStorage()
            });

            content.classList.add('task-content');
            content.textContent = task.content;

            deleteBtn.classList.add('task-delete-btn');
            deleteBtn.textContent = 'x';
            deleteBtn.addEventListener('click', () => {
                taskUl.removeChild(taskEl);
                this.tasks = this.tasks.filter(currentTask => {
                    return currentTask.id !== task.id;
                })
                this.updateTaskInLocalStorage();
                console.log(this.tasks);
                this.displayTaskList(this.tasks);
            });

            taskEl.appendChild(checkbox);
            taskEl.appendChild(content);
            taskEl.appendChild(deleteBtn);
            taskUl.appendChild(taskEl);
        })
    }

    displayTaskList(selectedTasks) {
        const ulWrapper = document.querySelector('.ul-wrapper');
        if (selectedTasks.length < 1) {
            ulWrapper.classList.add('invisible');
        } else {
            ulWrapper.classList.remove('invisible');
        }
    }

    filterBtnsHandler() {
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switch (btn.dataset.type) {
                    case 'all':
                        this.render(this.tasks);
                        this.displayTaskList(this.tasks);
                        break;
                    case 'active':
                        this.acviteTasks = this.tasks.filter(task => task.isCompleted === false)
                        this.render(this.acviteTasks);
                        this.displayTaskList(this.acviteTasks);
                        break;
                    case 'completed':
                        this.completedTasks = this.tasks.filter(task => task.isCompleted === true)
                        this.render(this.completedTasks);
                        this.displayTaskList(this.completedTasks);

                        break;
                    default:
                        break;
                }
            })
        })
    }

    updateTaskInLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

const taskList = new TaskList();
