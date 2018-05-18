~function (window) {
    "use strict";
    function Time() {
        this.canvas=new Canvas("time",100,70);
        this.time=0;
        this.timeId;
        this._init();
    }
    Time.prototype={
        constructor:Time,
        _init:function () {
            var self=this;
            this._render();
            this.timeId=setInterval(function () {
                self.time+=1;
                self._render();
            },1000)
        },
        _format:function(second){
            var hours=Math.floor(second/3600);
            second=second-hours*3600;
            var minutes=Math.floor(second/60);
            second=second-minutes*60;
            if(hours<10){
                hours="0"+hours;
            }
            if(minutes<10){
                minutes="0"+minutes;
            }
            if (second<10){
                second="0"+second;
            }
            return hours+":"+minutes+":"+second;
        },
        _render:function () {
          this.canvas.drawText(this._format(this.time));
        },
        pause:function () {
            window.clearInterval(this.timeId);
        },
        resume:function () {
            var self=this;
            this.timeId=window.setInterval(function () {
                self.time+=1;
                self._render();
            },1000)
        },
        stop:function () {
            this.pause();
        }
    }
    window.Time=Time;
}(window)