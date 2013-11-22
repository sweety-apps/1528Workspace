/*
 * 瀹�缃���扮��:http://www.ShareSDK.cn
 * ������������QQ: 4006852216
 * 瀹���瑰井淇�:ShareSDK   锛�濡�������甯���扮��������璇�锛����浠�灏�浼�绗�涓���堕�撮��杩�寰�淇″����������存�板��瀹规�ㄩ��缁���ㄣ��濡����浣跨�ㄨ��绋�涓����浠讳�����棰�锛�涔����浠ラ��杩�寰�淇′�����浠����寰����绯伙�����浠�灏�浼����24灏���跺��缁�浜����澶�锛�
 *
 * Copyright (c) 2013骞� ShareSDK.cn. All rights reserved.
 */

package com.studio1528.qietingfengyun.wxapi;

import org.cocos2dx.plugin.ShareSDKPluginX;
import org.cocos2dx.plugin.SocialWrapper;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import com.studio1528.qietingfengyun.qietingfengyun;
import com.tencent.mm.sdk.openapi.BaseReq;
import com.tencent.mm.sdk.openapi.BaseResp;
import com.tencent.mm.sdk.openapi.ConstantsAPI;
import com.tencent.mm.sdk.openapi.ShowMessageFromWX;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.mm.sdk.openapi.WXAppExtendObject;
import com.tencent.mm.sdk.openapi.WXMediaMessage;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

	// IWXAPI 是第三方app和微信通信的openapi接口
    private IWXAPI api;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
    	api = WXAPIFactory.createWXAPI(this, ShareSDKPluginX.APP_ID, false);
        
        api.handleIntent(getIntent(), this);
    }
	
	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		
		setIntent(intent);
        api.handleIntent(intent, this);
	}
	
	// 微信发送请求到第三方应用时，会回调到该方法
		@Override
		public void onReq(BaseReq req) {
			switch (req.getType()) {
			case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
				//goToGetMsg();		
				break;
			case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
				//goToShowMsg((ShowMessageFromWX.Req) req);
				break;
			default:
				break;
			}
		}

		// 第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
		@Override
		public void onResp(BaseResp resp) {
			int result = 0;
			
			switch (resp.errCode) {
			case BaseResp.ErrCode.ERR_OK:
				//result = R.string.errcode_success;
				SocialWrapper.onShareResult(ShareSDKPluginX.sharedInstance, SocialWrapper.SHARERESULT_SUCCESS, "success");
				break;
			case BaseResp.ErrCode.ERR_USER_CANCEL:
				//result = R.string.errcode_cancel;
				SocialWrapper.onShareResult(ShareSDKPluginX.sharedInstance, SocialWrapper.SHARERESULT_CANCEL, "cancelled");
				break;
			case BaseResp.ErrCode.ERR_AUTH_DENIED:
				//result = R.string.errcode_deny;
				SocialWrapper.onShareResult(ShareSDKPluginX.sharedInstance, SocialWrapper.SHARERESULT_FAIL, "failed");
				break;
			default:
				//result = R.string.errcode_unknown;
				break;
			}
			
			finish();
			//startActivity(new Intent(this, qietingfengyun.class));
		}
}
