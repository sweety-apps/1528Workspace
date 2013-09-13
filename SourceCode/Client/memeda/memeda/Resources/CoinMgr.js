var gCoin = 1999;
var gEventArr = new Array();

function CoinMgr_Register(fun) {
    gEventArr.push(fun);
}

function CoinMgr_Unregister(fun) {
    for ( var i = 0; i < gEventArr.length; i ++) {
        if ( gEventArr[i] == fun ) {
            gEventArr.remove(i);
            break;
        }
    }
}

function CoinMgr_GetCount() {
    return gCoin;
}

function CoinMgr_Change(add) {
    var oldCoin = gCoin;
    gCoin += add;

    for ( var i = 0; i < gEventArr.length; i ++) {
        (gEventArr[i])(oldCoin, add);
    }
}