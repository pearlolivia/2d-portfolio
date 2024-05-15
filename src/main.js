import { k } from "./kaboomCtx";

k.loadSprite('spritesheet', './spritesheet.png', {
    sliceX: 39, // number of frames (1 frame = 16px) that make up the width
    sliceY: 31,
    anims: {
        'idle-down': 936,
        "walk-down": { from: 936, to: 939, loop: true, speed: 8 }, // speed = frames ps
        "idle-side": 975,
        "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
        "idle-up": 1014,
        "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    },
})