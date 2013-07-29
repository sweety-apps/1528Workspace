// Autogenerated main.js file

require("jsb.js");

require("CCLayerWithSpriteTouchEvent.js");
require("GuessScene.js");
require("MainScene.js");
require("PunchScene.js");


function main()
{
	cc.FileUtils.getInstance().loadFilenameLookup("fileLookup.plist");
    //cc.Texture2D.setDefaultAlphaPixelFormat(6);
	var director = cc.Director.getInstance();
    var scene = cc.BuilderReader.loadAsScene("MainScene");
    var runningScene = director.getRunningScene();
    if (runningScene === null) director.runWithScene(scene);
    else director.replaceScene(scene);
}
main();