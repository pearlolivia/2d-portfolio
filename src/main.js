import { k } from "./kaboomCtx";
import { dialogueData, scaleFactor } from "./consts";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite('spritesheet', './spritesheet.png', {
    sliceX: 39, // number of frames (1 frame = 16px) that make up the width
    sliceY: 31,
    anims: {
        'idle-down': 960, // defines position of character sprite in spritesheet
        "walk-down": { from: 960, to: 963, loop: true, speed: 8 }, // speed = frames ps
        "idle-side": 999,
        "walk-side": { from: 999, to: 1002, loop: true, speed: 8 },
        "idle-up": 1038,
        "walk-up": { from: 1038, to: 1041, loop: true, speed: 8 },
    },
});

k.loadSprite('map', './map.png');

k.setBackground(k.Color.fromHex('#311047'));

k.scene('main', async () => { // creates individual scenes
    const mapData = await (await fetch('./map.json')).json();
    const layers = mapData.layers;

    const map = k.add([ // create game object
        k.sprite('map'),
        k.pos(0),
        k.scale(scaleFactor),
    ]);
    const player = k.make([
        k.sprite('spritesheet', {anim: 'idle-down'}),
        k.area({
            shape: new k.Rect(k.vec2(0, 3), 10, 10) // size of player hit box
        }),
        k.body(), // makes player object tangible, physical object
        k.anchor('center'), // player drawn from center of shape and not top left by default
        k.pos(),
        k.scale(scaleFactor), // must match other game components
        {
            speed: 200,
            direction: 'down',
            isInDialogue: false,
        },
        'player', // allows onCollide function and other player specific logic
    ]);

    for (const layer of layers) {
        if (layer.name === 'boundaries') {
            for (const boundary of layer.objects) { // create boundaries depending on boundary objects we've added
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);

                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true;
                        displayDialogue(dialogueData[boundary.name], () => player.isInDialogue = false);
                    });
                }
            }
            continue; 
        }

        if (layer.name === 'spawnpoints') {
            for (const entity of layer.objects) {
                if (entity.name === 'player') {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor,
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    setCamScale(k);

    k.onResize(() => {
        setCamScale(k);
    });

    k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y + 100);
    });


    k.onKeyDown((key) => {
        if (player.isInDialogue) return;

        let playerMove;
        switch (key) {
            case 'up':
                playerMove = player.move(0, -player.speed);
                break;
            case 'down':
                playerMove = player.move(0, player.speed);
                break;
            case 'left':
                playerMove = player.move(-player.speed, 0);
                break;
            case 'right':
                playerMove = player.move(player.speed, 0);
                break;
        }
        playerMove;

        if (key === 'up' && player.curAnim() !== 'walk-up') {
            player.play('walk-up');
            player.direction = 'up';
            return;
        }

        if (key === 'down' && player.curAnim() !== 'walk-down') {
            player.play('walk-down');
            player.direction = 'down';
            return;
        }

        if (key === 'right') {
            player.flipX = false; // right is default
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        }

        if (key === 'left') {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
        }
    });

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== 'left' || player.isInDialogue) return;
        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);
        const lowerBound = 50;
        const upperBound = 125;

        if (mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== 'walk-up'
        ) {
            player.play('walk-up');
            player.direction = 'up';
            return;
        }

        if (mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== 'walk-down'
        ) {
            player.play('walk-down');
            player.direction = 'down';
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false; // right is default
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
          }
      
          if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
          }
    });

    function stopAnims() {
        if (player.direction === "down") {
          player.play("idle-down");
          return;
        }
        if (player.direction === "up") {
          player.play("idle-up");
          return;
        }
    
        player.play("idle-side");
      }
    
      k.onMouseRelease(stopAnims);
    
      k.onKeyRelease(stopAnims);
});

k.go('main'); // defines default scene on load