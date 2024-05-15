import kaboom from "kaboom"

export const k =  kaboom({ // allows kaboom to be read in all files
    global: false,
    touchToMouse: true, // translates touch events to click events (handled in project)
    canvas: document.getElementById('game'),
});
