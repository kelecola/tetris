~function (window) {
    var cacheMap=new Map();
    var resourceTotalCount=1;
    var currentLoaded=0;
    var IsAddLoaded=function () {
      currentLoaded+=1;
      if(currentLoaded===resourceTotalCount&& typeof window.ResourceManager.onResourceLoaded==="function"){
          window.ResourceManager.onResourceLoaded();
      }
    };
    var init=function () {
        var image=new Image();
        image.onload=function () {
            cacheMap.set("blocks",image);
            IsAddLoaded();  //这边这局要判断是否加载成功
        };
        image.src="image/blocks.png";
    };
    var getResource=function (key) {
        return cacheMap.get(key)
    };
    window.ResourceManager={
        getResource:getResource,
        init:init,
        onResourceLoaded:null  //资源加载完成回调
    }

}(window)