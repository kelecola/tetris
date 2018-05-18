~function (window) {
    "use strict";

    /*var intervalId;
    var speed=200;*/
    function Tetris() {
        this.board = new Board(this);
        this._sound;
        this._state = "playing";
        this.score=new Score();
        this.time=new Time();
        this.level=new Level();
        this.nextShape=new NextShape();
        this.highScore=new HighScore();
        /*self = this;//自己加的东西*/
        (new Keyboard()).init(this.board)
    }
    Tetris.prototype = {
        constructor: Tetris,
        //音频的使用
        _playSound:function(){
            if(window.TetrisConfig.config.enableSound){
                this._sound.play();
            }
        },
        _initAudio: function () {
            this._sound = new Howl({
                src: ["audio/bg.mp3"],
                loop: true,
                volume: 0.4
            });
            this._playSound();
        },
        _startTick() {
            var self = this;
            window.TetrisConfig.intervalId = window.setInterval(function () {
                self.board.tick();
            }, TetrisConfig.speed);
        },
        _stopTick:function(){
            window.clearInterval(window.TetrisConfig.intervalId);
        },
        startGame: function () {
            this._initAudio();
            this._startTick();
        },
        endGame: function () {
            this._sound.stop();
            this._stopTick();
            this.time.stop();
        },
        pause: function () {
            if(this._state==="over"){
                return;
            }
            //音乐，响映，取消tick
            this._sound.pause();
            this._state = "pause";
            this._stopTick();
            this.time.pause();
        },
        resume: function () {
            if(this._state==="over"){
                return;
            }
            this._playSound();
            this._state = "playing";
            this._startTick();
            this.time.resume();
        }
    };
    window.Tetris = Tetris;
}(window);