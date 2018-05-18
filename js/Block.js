~function (window) {
    'use strict';
    function Block(blockType) {
        this.blockType=blockType;
        this.size=30;
        this.originSize=32;
        this.sprite=window.ResourceManager.getResource("blocks");
    }
    Block.prototype={
        constructor:Block,
        draw:function (context,x,y,blockType,size) {
            size=size||this.size,
            context.drawImage(this.sprite,((blockType||this.blockType)-1)*this.originSize,0,this.originSize,this.originSize,x*size,y*size,size,size);
        }
    };
    window.Block=Block;
}(window);