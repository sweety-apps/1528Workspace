require("jsb.js");

try {
    
    director = cc.Director.getInstance();
    winSize = director.getWinSize();
    centerPos = cc.p( winSize.width/2, winSize.height/2 );
    
    var GameCreator = function() {
        
        var self = {};
        self.callbacks = {};
        
        self.getTestScene = function() {
            //var scene = new cc.Scene();
            return cc.BuilderReader.loadAsScene("TestCCB/MainScene.ccbi");
        };
        
        return self;
        
    };
    
    var game = GameCreator();
    
    __jsc__.garbageCollect();
    
    // LOADING PLAY SCENE UNTILL CCBREADER IS FIXED
    
    director.runWithScene(game.getTestScene());
    
} catch(e) {log(e);}

