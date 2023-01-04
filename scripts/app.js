'use strict';

let habbits = [];
const HABBIT_KAY = 'HABBIT_KAY';
let globalActiveHabbitId;

/* page constanta */
const page = {
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')
    },
    content: {
        days: document.querySelector('.days'),
        nextDay: document.querySelector('.habbit__day')
    },
    popup: {
        index: document.querySelector('.cover'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
}


/* utils */
function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KAY);
    const habbitArray = JSON.parse(habbitsString);

    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KAY, JSON.stringify(habbits));
}

function getPathIcon(nameIcon) {
    return `images/icons/${nameIcon}.svg`;
}

function togglePopup(event) {
    page.popup.index.classList.toggle('cover_hidden')
}

function setIcon() {
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.addEventListener('click', e => {
            if (!icon.classList.contains('icon-active')) {
                const activeIcon = document.querySelector('.icon.icon-active');
                activeIcon.classList.remove('icon-active');
                icon.classList.add('icon-active')
            }
            page.popup.iconField.setAttribute('value', icon.value);
        });
    });
}

function resetForm(form, fields) {
    fields.forEach(field => form[field].value = '');
}

function getValidateData(form, fields) {
    const formData = new FormData(form);
    let isValid = true;
    const res = {};

    fields.forEach(field => {
        const fieldValue = formData.get(field);
        form[field].classList.remove('error');
        console.log();
        if ((!fieldValue || fieldValue.length < 3) && !form[field].type === 'number') {
            form[field].classList.add('error');
            isValid = false;
        }
        res[field] = fieldValue;
    });
    return isValid ? res : false;
}

/* render */
function renderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if (!existed) {
            // Created
            const menuItem = document.createElement('button');
            menuItem.classList.add('menu__item');
            menuItem.setAttribute('menu-habbit-id', habbit.id);
            const menuItemImage = document.createElement('img');
            menuItemImage.setAttribute('src', getPathIcon(habbit.icon));
            menuItem.appendChild(menuItemImage);
            page.menu.appendChild(menuItem);
            if (activeHabbit.id === habbit.id) {
                menuItem.classList.add('menu__item_active');
            }

            menuItem.addEventListener('click', (e) => rerender(habbit.id))
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }
}

function renderHabbitHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1 ? 100 : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
    page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
}

function renderHabbitDays(activeHabbit) {

    page.content.days.innerHTML = '';

    function renderDay(item, day) {
        const habbit = document.createElement('div');
        const habbitDay = document.createElement('div');
        const habbitComment = document.createElement('div');
        const habbitDelete = document.createElement('button');
        const habbitDeleteImage = document.createElement('img');

        habbit.classList.add('habbit');
        habbitDay.classList.add('habbit__day');
        habbitComment.classList.add('habbit__comment');
        habbitDelete.classList.add('habbit__delete');
        habbitDeleteImage.setAttribute('src', getPathIcon('shape'));

        habbitDelete.appendChild(habbitDeleteImage);
        habbit.appendChild(habbitDay);
        habbit.appendChild(habbitComment);
        habbit.appendChild(habbitDelete);

        habbitDay.innerText = `День ${day}`;
        habbitComment.innerText = item.comment;

        habbitDelete.addEventListener('click', () => {
            deleteDay(day - 1);
        })

        return habbit;
    }

    activeHabbit.days.forEach((item, day) => {
        page.content.days.appendChild(renderDay(item, day + 1));
    });

    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

function addDay(event) {
    event.preventDefault();
    const data = getValidateData(event.target, ['comment']);
    if (data) {
        habbits = habbits.map(habbit => {
            if (habbit.id === globalActiveHabbitId) {
                return {
                    ...habbit,
                    days: habbit.days.concat([{comment: data.comment}])
                }
            }
            return habbit;
        })
        resetForm(event.target, ['comment']);
        rerender(globalActiveHabbitId);
        saveData();
    }
}

function deleteDay(index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1)
            return {
                ...habbit,
                days: habbit.days
            }
        }
        return habbit;
    })
    rerender(globalActiveHabbitId);
    saveData();
}

function addHabbit(event) {
    event.preventDefault();
    const data = getValidateData(event.target, ['name', 'icon', 'target']);
    if (data) {
        const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0)
        habbits.push({
            id: maxId + 1,
            name: data.name,
            target: data.target,
            icon: data.icon,
            days: [],
        })
        resetForm(event.target, ['name', 'icon', 'target']);
        togglePopup()
        rerender(maxId + 1);
        saveData();
    }
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (!activeHabbit) {
        return;
    }
    document.location.hash = activeHabbit.id 
    renderMenu(activeHabbit);
    renderHabbitHead(activeHabbit);
    renderHabbitDays(activeHabbit);
}

/* init */
(() => {
    loadData();
    const hashId = Number(document.location.hash.replace('#', ''));
    const urlHabbit = habbits.find(habbit => habbit.id == hashId);
    if (urlHabbit) {
        rerender(urlHabbit.id);
    } else {
        rerender(habbits[0].id);
    }
    setIcon();
})()