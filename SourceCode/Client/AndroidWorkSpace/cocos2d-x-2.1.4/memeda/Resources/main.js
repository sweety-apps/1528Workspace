// Autogenerated main.js file

require("jsb.js");

require("AnswerBlank.js");
require("BGCtrlLayer.js");
require("BGDoorLayer.js");
require("BGLayer.js");
require("BuyMsg.js");
require("CatAni.js");
require("Clouds.js");
require("CoinCtrl.js");
require("CoinMgr.js");
require("DebugUtils.js");
require("FirstScene.js");
require("FirstSceneHome.js");
require("GameDataAccess.js");
require("Globel.js");
require("GuessScene.js");
require("InputCharBtn.js");
require("JumpMsgBox.js");
require("PurchaseTable.js");
require("RightMsgBox.js");
require("SpecialSpyPackageMgr.js");
require("UtilsFunctions.js");
require("WebFun.js");
require("WechatError.js");
require("WeChatMsg.js");
require("ChooseTestsScene.js");
require("Floor.js");
require("FloorsData.js");
require("GiftBuyMessageBox.js");
require("WechatAwardMsg.js");
require("WholeFloors.js");
require("BuyCoinMessageBox.js");
require("NoEnoughMessageBox.js");
require("WeChatCoinMessageBox.js");
require("AwardItem.js");
require("AwardScene.js");


function main()
{
	cc.FileUtils.getInstance().loadFilenameLookup("fileLookup.plist");
    //cc.Texture2D.setDefaultAlphaPixelFormat(6);
	var director = cc.Director.getInstance();
    var scene = cc.BuilderReader.loadAsScene("FirstScene");
    var runningScene = director.getRunningScene();
    if (runningScene === null) director.runWithScene(scene);
    else director.replaceScene(scene);
}
main();