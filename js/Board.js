~function (window) {
    function Board(gameInst) {
        this.gameInst=gameInst;
        this.blockSize = 30;
        this.rows = TetrisConfig.rows;
        this.cols = TetrisConfig.cols;
        this.canvas = new Canvas("c_game_main", this.cols * this.blockSize, this.rows * this.blockSize);
        //我的天，越来越喜欢这种逻辑思考的感觉了
        this.context = this.canvas.context;
        this.boardList = [];
        this.shape = new window.Shape();

        this._init();
        /*var b = ResourceManager.getResource("blocks");*/
    }

    Board.prototype = {
        constructor: Board,
        _init: function () {
            this._builderGridData();
            this._initGrid();
            this.shape.draw(this.context);
            //延时的思想
            var self=this;
            setTimeout(function () {
                self._builderNextShape();
            })
        },
        //用来绘制的是格子里面的下一个方块
        _builderNextShape:function(){
            this.nextShape=new window.Shape();//画出描绘出这样一个方块
            //这个位置是无效的，不是无效的而是设置错了位置
            this.nextShape.setPosition(this.gameInst.nextShape.cols,this.gameInst.nextShape.rows);//这个是没有错的
            /*this.next=new NextShape();//不new都会有问题*/
            this.gameInst.nextShape.render(this.nextShape);//渲染这样一个方块
        },
        _builderGridData() {
            var i, j;
            for (i = 0; i < this.rows; i++) {
                this.boardList[i] = [];
                for (j = 0; j < this.cols; j++) {
                    this.boardList[i][j] = 0;
                }
            }
            /*console.log(this.boardList)*/
        },
        _initGrid() {
            var i;
            this.context.strokeStyle = "green";
            this.context.lineWidth = 0.5;
            //绘制线条的笔记
            for (i = 0; i <= this.rows; i++) {
                this.context.moveTo(0, i * this.blockSize);
                this.context.lineTo(this.canvas.width, i * this.blockSize);
            }
            for (i = 0; i <= this.cols; i++) {
                this.context.moveTo(i * this.blockSize, 0);
                this.context.lineTo(i * this.blockSize, this.canvas.height);
            }
            this.context.stroke();
            //缓存数据
            this.gridImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        },
        tick: function () {
            if (this.validMove(0, 1)) {
                this.shape.y += 1;
            } else {
                this.addShapeToBoardList();
                if(this.gameInst._state==="over"){
                    this.gameInst.endGame();
                    return;
                }
                this.clearFullRows();//调用消除方法
                //下一个方块起始位置不对
                //下一个方块对应不上,大小size是ok了的
                this.shape=this.nextShape;
                this.shape.setPosition(this.cols,this.rows,true);
                this._builderNextShape();
            }
            this.refresh();
            this.shape.draw(this.context)
        },
        refresh: function () {
            this.canvas.clear();
            this.context.putImageData(this.gridImageData, 0, 0);
            this.drawBlocks();
        },
        //越界
        validMove: function (moveX, moveY) {
            var nextX = this.shape.x + moveX;
            var nextY = this.shape.y + moveY;
            for (var y = 0; y < this.shape.layout.length; y++) {
                for (var x = 0; x < this.shape.layout[y].length; x++) {
                    if (this.shape.layout[y][x]) {
                        if (typeof this.boardList[nextY + y] === 'undefined'//找不到行
                            || typeof this.boardList[nextY + y][nextX + x] === 'undefined'//找不到列
                            || this.boardList[nextY + y][nextX + x]//当前位置已有方块
                            || nextX + x < 0   //超出左边界
                            || nextX + x >= this.cols   //超出右边界
                            || nextY + y >= this.rows   //超出下界
                        ) {
                            return false;
                        }
                    }
                }
            }
            return true; //等循环结束后再返回真值
        },
        addShapeToBoardList:function () {
            for (var y = 0; y < this.shape.layout.length; y++) {
                for (var x = 0; x < this.shape.layout[y].length; x++){
                    if(this.shape.layout[y][x]){
                        var boardX=this.shape.x+x;
                        var boardY=this.shape.y+y;
                        if(this.boardList[boardY][boardX]){
                            this.gameInst._state="over";
                            return;
                        }
                        else {
                            this.boardList[boardY][boardX]=this.shape.blockType;//这个很重要考虑一下怎么样
                        }
                    }
                }
            }
        },
        drawBlocks:function () {
            for (var y = 0; y < this.rows; y++) {
                for (var x = 0; x < this.cols; x++){
                    if(this.boardList[y][x]){
                        this.shape.block.draw(this.context,x,y,this.boardList[y][x]);
                    }
                }
            }
        },
        createEmptyRow(){
            var emptArr=[];
            for (var i=0;i<this.cols;i++) {
                emptArr.push(0);
            }
            return emptArr;
        },
        clearFullRows:function () {
            var self=this;
            var lines=0;
            for(var y=this.rows-1;y>=0;y--){
                var filled=this.boardList[y].filter(function (item) {return item>0;}).length===this.cols;
                if(filled&&y){
                    this.boardList.splice(y,1);
                    this.boardList.unshift(this.createEmptyRow());
                    lines++;
                    y++;
                }
            }
            var score=lines*100*lines;
            var totalScore=this.gameInst.score.addScore(score);
            this.gameInst.highScore.checkScore(totalScore);
            var currentLevel=this.gameInst.level.checkLevel(totalScore);
            if(currentLevel){
                window.TetrisConfig.speed=Math.floor(window.TetrisConfig.constSpeed*(1-(currentLevel-1)/10));
                this.gameInst.pause();
                setTimeout(function () {
                    window.alert("level up");
                    self.gameInst.resume();
                })
            }
        }
    };
    window.Board = Board;
}(window);


