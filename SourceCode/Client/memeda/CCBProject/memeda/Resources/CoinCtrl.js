var CoinCtrl = function() {};

function CoinChanged(oldCoin, add, self) {
	self.changed(CoinMgr_GetCount());
}

CoinCtrl.prototype.onDidUnload = function () {
	debugMsgOutput("CoinCtrl.prototype.onDidUnload");
	CoinMgr_Unregister(this.registerID);
	this.registerID = null;
};


CoinCtrl.prototype.onDidLoadFromCCB = function () {
	debugMsgOutput("CoinCtrl.prototype.onDidLoadFromCCB");
	if ( this.registerID == null ) {
		this.registerID = CoinMgr_Register(CoinChanged, this);

		this.curCoin = CoinMgr_GetCount();
		this.coinNum.setString("" + CoinMgr_GetCount());
	}
};

CoinCtrl.prototype._isRunning = function () {
    return true;
}

CoinCtrl.prototype.update = function() {
	debugMsgOutput("CoinCtrl.prototype.update");
	if ( this.curCoin == this.targetCoin ) {
		cc.Director.getInstance().getScheduler().unscheduleUpdateForTarget(this);
	} else {
		if ( this.curCoin < this.targetCoin ) {
			var off = this.targetCoin - this.curCoin;
			if ( off > 500 ) {
				this.curCoin += 20;	
			} else if ( off > 200 ) {
				this.curCoin += 10;	
			} else if ( off > 50 ) {
				this.curCoin += 5;	
			} else {
				this.curCoin ++;	
			}

			this.coinNum.setString("" + this.curCoin);
		} else {
			var off = this.curCoin - this.targetCoin;
			if ( off > 500 ) {
				this.curCoin -= 20;	
			} else if ( off > 200 ) {
				this.curCoin -= 10;	
			} else if ( off > 50 ) {
				this.curCoin -= 5;	
			} else {
				this.curCoin --;	
			}

			this.coinNum.setString("" + this.curCoin);			
		}
	}
}

// 改变显示的金币数量
CoinCtrl.prototype.changed = function (coin) {
	if ( this.curCoin != coin ) {
		this.targetCoin = coin;
		cc.Director.getInstance().getScheduler().scheduleUpdateForTarget(this, 0, !this._isRunning);
	}
};