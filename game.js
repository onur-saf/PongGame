(function () {
    let CSS
    let CONSTS
    let locaData = JSON.parse(window.localStorage.getItem('game'))
    const initData = ()=> new Promise ((resolve,reject)=>{
    if(locaData!=null){
         CSS =locaData.CSS
         CONSTS = locaData.CONSTS
    }
    else{
     CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        restartButton:{
            background:"#c6a62f"
        },
        greeting:{
            display: "grid",
            padding: "150px",
            background: "grey",
            "text-align": "center",
            "font-size": "25px",
            width: "450px",
            margin: "70px auto 20px"
        },
        scoreboard:{
            width: '450px',
            display:'flex',
            background: 'grey',
            top: '50%',
            height: '50px',
            margin: 'auto',
            opacity: '50%'
        },
        leftside:{
            "font-size": '25px',
            "text-align": "center",
            width: "225px",
            margin: "auto",
        },
        rightside:{
            "font-size": "25px",
            "text-align": "center",
            width: "225px",
            flex: 1,
            margin: "auto"
        },
        ball: {
            transition: "opacity 0.4s ease",
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 450,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            right: 0,
            top: 150
        }
    };

     CONSTS = {
        balls:[],
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 20,
        ballLeftSpeed: 10,
        paused:false,
        gameover:false,
        gamemodes:{
            players2:1,
            playervscpu:2,
            cpuvscpu:3
        },
        selectedGameMode:0
    };
    }
    resolve(true)

})
    function start() {
        initData().then(result=>{
            if(!CONSTS.gameover){
            setEvents();
            roll();
            loop();
            }
            else{
                roll()
            }
        })


    }

    function draw() {
        initData()
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'scoreboard'}).css(CSS.scoreboard).appendTo('#pong-game');
        $('<div/>', {id: 'leftside'}).css(CSS.leftside).appendTo('#scoreboard').text(CONSTS.score1);
        $('<div/>', {id: 'rightside'}).css(CSS.rightside).appendTo('#scoreboard').text(CONSTS.score2);
        $('<div/>', {id: 'greeting'}).css(CSS.greeting).appendTo('#pong-game')
        $('<button/>', {id: '2players'}).css(CSS.restartButton).appendTo('#greeting').text('2 Players')
        $('<button/>', {id: 'playervscpu'}).css(CSS.restartButton).appendTo('#greeting').text('Player vs CPU')
        $('<button/>', {id: 'cpuvscpu'}).css(CSS.restartButton).appendTo('#greeting').text('CPU1 VS CPU2')
    }

    function setEvents() {
        //leftside
        //move-up
        $(document).on('keydown', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = -10;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = 0;
            }
        });
        //move-down
        $(document).on('keydown', function (e) {
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 10;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }
        });
        //rightside
        //move-up
        $(document).on('keydown', function (e) {
            if (e.keyCode == 38) {
                CONSTS.stick2Speed = -10;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 38) {
                CONSTS.stick2Speed = 0;
            }
        });
        //move-down
        $(document).on('keydown', function (e) {
            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 10;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 0;
            }
        });

        //Pause
        $(document).on('keydown', function (e) {
            if (e.keyCode == 80) {
                CONSTS.paused=!CONSTS.paused
                if(CONSTS.paused){
                    clearInterval(window.pongLoop)
                }
                else{
                    if(!CONSTS.gameover){
                        loop()
                    }
                }
            }
        });
        //new-ball
        $(document).on('keydown', function (e) {
            if (e.keyCode == 32) {
                $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
            }
        });

    }

    function loop() {
        window.pongLoop = setInterval(function () {
            if(CONSTS.selectedGameMode==CONSTS.gamemodes.players2){
            CSS.stick1.top += CONSTS.stick1Speed;
            CSS.stick2.top += CONSTS.stick2Speed;
            }
            else if(CONSTS.selectedGameMode==CONSTS.gamemodes.playervscpu){
                CSS.stick1.top += CONSTS.stick1Speed;
                CSS.stick2.top = $('#pong-ball').position().top;
            }
            else if(CONSTS.selectedGameMode == CONSTS.gamemodes.cpuvscpu){
                CSS.stick2.top = $('#pong-ball').position().top;
                CSS.stick1.top = $('#pong-ball').position().top;

            }
            $('#stick-1').css('top', CSS.stick1.top);
            $('#stick-2').css('top', CSS.stick2.top);
            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            if (CSS.ball.left <= CSS.stick.width ) {
                CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll('right');
                $('#rightside').text(CONSTS.score2)
            }
            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll('left');
                $('#leftside').text(CONSTS.score1)

            }
            window.localStorage.setItem('game',JSON.stringify({
                CSS:CSS,
                CONSTS:CONSTS
            }))
        }, CONSTS.gameSpeed);
    }

    function roll(score) {
        score=='right'? CONSTS.score2 += 1:score=='left'? CONSTS.score1 += 1:null
        if(CONSTS.score2==5||CONSTS.score1==5 ){
            clearInterval(window.pongLoop)
            CONSTS.gameover=true
            $('<div/>', {id: 'greeting'}).css(CSS.greeting).appendTo('#pong-game').text(
                CONSTS.score1==5?"Letf Won the Game":"Right Won the Game"
            );

            $('<button/>', {id: 'changeMode'}).css(CSS.restartButton).appendTo('#greeting').text('Again')

        }
        CSS.ball.top = 250;
        CSS.ball.left = 350;
        var side = -1;
        if (Math.random() < 0.5) {
            side = 1;
        }
        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }
    $(document).on("click", "#2players", function(){
        start()
        CONSTS.selectedGameMode=CONSTS.gamemodes.players2
        $('#greeting').remove()
          });
    $(document).on("click", "#playervscpu", function(){
        start()
        CONSTS.selectedGameMode=CONSTS.gamemodes.playervscpu
        $('#greeting').remove()
          });
        $(document).on("click", "#cpuvscpu", function(){
        start()
        CONSTS.selectedGameMode=CONSTS.gamemodes.cpuvscpu
        $('#greeting').remove()
          });
    $(document).on("click", "#changeMode", function(){
        window.localStorage.setItem('game',JSON.stringify(null))
        window.location.reload()
          });

    draw();
})()