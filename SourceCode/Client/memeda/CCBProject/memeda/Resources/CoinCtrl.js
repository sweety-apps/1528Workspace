var CoinCtrl = function() {};

function CoinChanged(oldCoin, add, self) {
	self.coinNum.setString("" + CoinMgr_GetCount());	
}

CoinCtrl.prototype.onDidUnload = function () {
	debugMsgOutput("CoinCtrl.prototype.onDidUnload");
	CoinMgr_Unregister(this.registerID);
};


CoinCtrl.prototype.onDidLoadFromCCB = function () {
	debugMsgOutput("CoinCtrl.prototype.onDidLoadFromCCB");
	this.registerID = CoinMgr_Register(CoinChanged, this);
	this.coinNum.setString("" + CoinMgr_GetCount());
};