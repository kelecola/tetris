~function (window) {
    'use strict';
    var shapeLayouts=[
        [[0,1,0], [1,1,1]],
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[0,1],[1,1],[1,0]],
        [[1,0,1],[1,1,1]],
        [[1,1]],
        [[1,1],[1,0],[1,0]],
        [[1,1],[0,1],[0,1]]
];
    var random=function(min,max){
        return min+Math.floor(Math.random()*max);//0~1包含0不包含1
    };
    var styleCount=7;
    function Shape() {
        this.block=new Block(7);
        this.x=0;
        this.y=0;
        this.blockType=random(1,styleCount);
        this.block=new Block(this.blockType);
        /*this.layout={
            1:[[0,1,0], [1,1,1]],
            2:[[1,0],[1,1],[1,0]],
            3:[[1,1,1],[0,1,0]],
            4:[[0,1],[1,1],[0,1]]
        };*/
        this.layout=shapeLayouts[random(0,shapeLayouts.length)]
    }
    Shape.prototype={
        constructor:Shape,
        draw:function (context,size) {
            for(var i=0;i<this.layout.length;i++){
                for (var j=0;j<this.layout[i].length;j++){
                    if(this.layout[i][j]){
                        this.block.draw(context,j+this.x,i+this.y,undefined,size);
                    }
                }
            }
        },
        rotate:function () {
            var newLayout=[];
            for(var y=0;y<this.layout[0].length;y++){
                newLayout[y]=[];
                for (var x=0;x<this.layout.length;x++){
                    newLayout[y][x]=this.layout[this.layout.length-1-x][y]
                }
            }
            this.layout=newLayout;
            this._setLayout()
        },
        _setLayout:function () {
            if(this.x<0){
                this.x=0;
            }
            if(this.y<0){
                this.y=0;
            }
            if(this.x+this.layout[0].length>TetrisConfig.cols){
                this.x=TetrisConfig.cols-this.layout[0].length;
            }
            if(this.y+this.layout.length>TetrisConfig.rows){
                this.y=TetrisConfig.rows-this.layout[0].length;
            }
        },
        _getMaxCols:function(){
            var max=0;

            for(var y=0;y<this.layout.length;y++){
                max=Math.max(max,this.layout[y].length);
            }
            return max;
        },
        _getMaxRows:function(){
            return this.layout.length;
        },
        //对于大小都应要用，但是大的被用了小的没被用；列的中间，如果是格子里面就不忽略列，如果是游戏就忽略。
        setPosition:function (cols,rows,ignoreRows) {
            this.x=Math.floor((cols-this._getMaxCols())/2);
            if(!ignoreRows){
                this.y=Math.floor((rows-this._getMaxRows())/2);
            }
        }
    };
    window.Shape=Shape;//这个是什么原理来着

}(window);