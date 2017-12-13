// Adapted from: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

(function () {
    'use strict';

    var app = {
        canvas: null,
        screenWidth: jQuery(window).width(),
        screenHeight: jQuery(window).height(),
        //Brick settings
        brickColumnCount: 5,
        brickRowCount: 3,
        brickHeight: 20,
        brickPadding: 10,
        brickOffsetTop: 30,
        brickOffsetLeft: 30,
        //Paddle settings
        paddleHeight: 10,
        paddleWidth: 75,
        paddleX: null,
        //Ball settings
        ballRadius: 10,
        dxDefault: 2,
        dyDefault: -2,
        dx: null,
        dy: null,
        x: 0,
        y: 0,
        //Keyboard - store information on whether the left or right control button is pressed
        rightKeyPressed: false,
        leftKeyPressed: false,
        //Game data
        score: 0,
        lives: 3,
        bricks: []
    }

    $(function () {
        
        //1. Query DOM
        app.canvas = document.getElementById("gameCanvas");
        //2. Set canvas size
        app.windowSizeChanged();

        //Ball settings
        app.x = app.canvas.width / 2;
        app.y = app.canvas.height - 30;
        //we want to add a small value to x and y after every frame has been drawn to make it appear that the ball is moving
        app.dx = app.dxDefault;
        app.dy = app.dyDefault;

        //Paddle settings
        app.paddleX = (app.canvas.width - app.paddleWidth) / 2;

        var brickTotalWidth = (app.screenWidth - 2 * app.brickOffsetLeft) / app.brickColumnCount;
        app.brickWidth = brickTotalWidth - app.brickPadding;

        //Game data
        for (var r = 0; r < app.brickRowCount; r++) {
            app.bricks[r] = [];
            for (var c = 0; c < app.brickColumnCount; c++) {
                app.bricks[r][c] = { x: 0, y: 0, status: 1 };
            }
        }

        //Attach events
        app.canvas.addEventListener("touchmove", app.touchMove, { passive: true });
        window.addEventListener("resize", app.windowSizeChanged);
        document.addEventListener("keydown", app.keyDownHandler, false);
        document.addEventListener("keyup", app.keyUpHandler, false);
        document.addEventListener("mousemove", app.mouseMoveHandler, false);

        //Start drawing
        app.draw();
    });

    //Events
    app.touchMove = function (e) {
        var relativeX = e.touches[0].clientX;
        if (relativeX > 0 && relativeX < app.canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    app.windowSizeChanged = function () {
        app.screenWidth = app.canvas.width = window.innerWidth;
        app.screenHeight = app.canvas.height = window.innerHeight;
    }

    app.keyDownHandler = function (e) {
        if (e.keyCode == 39) {
            app.rightKeyPressed = true;
        }
        else if (e.keyCode == 37) {
            app.leftKeyPressed = true;
        }
    }

    app.keyUpHandler = function (e) {
        if (e.keyCode == 39) {
            app.rightKeyPressed = false;
        }
        else if (e.keyCode == 37) {
            app.leftKeyPressed = false;
        }
    }

    app.mouseMoveHandler = function (e) {
        var relativeX = e.clientX - app.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < app.canvas.width) {
            app.paddleX = relativeX - app.paddleWidth / 2;
        }
    }

    //Drawing functions
    app.drawBall = function () {
        var ctx = app.canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(app.x, app.y, app.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }

    app.drawPaddle = function () {
        var ctx = app.canvas.getContext("2d");

        ctx.beginPath();
        ctx.rect(app.paddleX, app.canvas.height - app.paddleHeight, app.paddleWidth, app.paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        //equivalen to ctx.fillRect
    }
    app.drawBricks = function () {
        var ctx = app.canvas.getContext("2d");

        for (var r = 0; r < app.brickRowCount; r++) {
            for (var c = 0; c < app.brickColumnCount; c++) {
                if (app.bricks[r][c].status == 1) {
                    var brickX = (c * (app.brickWidth + app.brickPadding)) + app.brickOffsetLeft;
                    var brickY = (r * (app.brickHeight + app.brickPadding)) + app.brickOffsetTop;
                    app.bricks[r][c].x = brickX;
                    app.bricks[r][c].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, app.brickWidth, app.brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    app.drawScore = function () {
        var ctx = app.canvas.getContext("2d");

        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Score: " + app.score, 8, 20);
    }
    app.drawLives = function () {
        var ctx = app.canvas.getContext("2d");

        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Lives: " + app.lives, app.canvas.width - 65, 20);
    }

    app.draw = function () {
        //clear the canvas before each frame
        var ctx = app.canvas.getContext("2d");
        ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
        //draw the elements
        app.drawBricks();
        app.drawBall();
        app.drawPaddle();
        app.drawScore();
        app.drawLives();
        //detect collisions
        app.collisionDetection();

        //Bouncing off the left and right
        if (app.x + app.dx > app.canvas.width - app.ballRadius || app.x + app.dx < app.ballRadius) {
            app.dx = -app.dx;
        }

        //Bouncing off the top
        if (app.y + app.dy < app.ballRadius) {
            app.dy = -app.dy;
        }
        //Bouncing off the bottom
        else if (app.y + app.dy > app.canvas.height - app.ballRadius) {

            if (app.x > app.paddleX && app.x < app.paddleX + app.paddleWidth) {
                app.dy = -app.dy;
            }
            else {
                app.lives--;
                if (!app.lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    app.x = app.canvas.width / 2;
                    app.y = app.canvas.height - 30;
                    app.dx = app.dxDefault;
                    app.dy = app.dyDefault;
                    //center the paddle
                    app.paddleX = (app.canvas.width - app.paddleWidth) / 2;
                }
            }
        }

        //move the paddle right if the right control button is pressed
        if (app.rightKeyPressed && app.paddleX < app.canvas.width - app.paddleWidth) {
            app.paddleX += 7;
        }
        //move the paddle left if the left control button is pressed
        else if (app.leftKeyPressed && app.paddleX > 0) {
            app.paddleX -= 7;
        }

        //update the location of the ball
        app.x += app.dx;
        app.y += app.dy;

        requestAnimationFrame(app.draw);
    }

    app.collisionDetection = function () {
        for (var r = 0; r < app.brickRowCount; r++) {
            for (var c = 0; c < app.brickColumnCount; c++) {
                var b = app.bricks[r][c];
                if (b.status == 1) {
                    if (app.x > b.x && app.x < b.x + app.brickWidth && app.y > b.y && app.y < b.y + app.brickHeight) {
                        app.dy = -app.dy;
                        b.status = 0;
                        app.score++;
                        if (app.score == app.brickColumnCount * app.brickRowCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

   

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
                 .register('./service-worker.js')
                 .then(function() { console.log('Service Worker Registered'); });
    }
})();

