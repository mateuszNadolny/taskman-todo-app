const body = document.querySelector('body');
const themeCheckbox = document.querySelector('.theme-checkbox');
const liCheckboxes = document.querySelectorAll('.task-checkbox');
const filterBtns = document.querySelectorAll('.filter-btn');

class UI {
    constructor() {

        if (localStorage.getItem('darkMode') === null) {
            localStorage.setItem('darkMode', "false");
        }
        this.checkTheme();

        themeCheckbox.addEventListener('change', this.changeTheme);
        liCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('click', this.changeTaskState);
        })
        filterBtns.forEach(btn => {
            btn.addEventListener('click', this.changeFilterBtnState)
        })
    }

    checkTheme() {
        if (localStorage.getItem('darkMode') === "false") {
            themeCheckbox.checked = false;
            body.setAttribute('data-mode', 'light')
        } else {
            themeCheckbox.checked = true;
            body.setAttribute('data-mode', 'dark')
        }
    }

    changeTheme() {

        if (localStorage.getItem('darkMode') === "false") {
            body.setAttribute('data-mode', 'dark')
            localStorage.setItem('darkMode', "true");
        } else {
            body.setAttribute('data-mode', 'light')
            localStorage.setItem('darkMode', "false");
        }
    }

    changeFilterBtnState(event) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active-filter');
        })
        event.target.classList.add('active-filter');
    }
};

const userInterface = new UI();