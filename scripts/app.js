'use strict'

let habbits = [];
const HABBIT_KAY = 'HABBIT_KAY';

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

(() => {
    loadData();
})()