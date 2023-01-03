'use strict'

let habbits = [];
const HABBIT_KAY = 'HABBIT_KAY';

/* page constanta */
const page = {
    menu: document.querySelector('.menu__list')
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
function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
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

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}


/* init */
(() => {
    loadData();
    rerender(habbits[0].id);
})()