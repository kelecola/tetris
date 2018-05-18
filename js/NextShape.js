~function (window) {
    "use strict";
    function NextShape() {
        this.canvas=new Canvas("nextShape",100,70);
        this._init();//有时候别乱new东西出来
    }
    NextShape.prototype={
        constructor:NextShape,
        _init:function () {
            this.rows=5;
            this.cols=6;
        },
        render:function (shape) {
            this.canvas.clear();
            shape.draw(this.canvas.context,16);
        },
    };
    window.NextShape=NextShape;
}(window);