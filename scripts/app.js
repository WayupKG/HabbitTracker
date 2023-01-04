'use strict';

let habbits = [];
const HABBIT_KAY = 'HABBIT_KAY';

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

    function renderHabbit(item, day) {
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
        return habbit;
    }

    activeHabbit.days.forEach((item, day) => {
        page.content.days.appendChild(renderHabbit(item, day + 1));
    });

    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}


function rerender(activeHabbitId) {
    if (!activeHabbitId) {
        return;
    }
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    renderMenu(activeHabbit);
    renderHabbitHead(activeHabbit);
    renderHabbitDays(activeHabbit);
}


/* init */
(() => {
    loadData();
    rerender(habbits[0].id);
})()