package com.studio1528.qietingfengyun;

import java.util.Timer;
import java.util.TimerTask;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.plugin.PluginWrapper;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.sina.weibo.SinaWeibo;
import cn.sharesdk.wechat.friends.Wechat;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

public class qietingfengyun extends Cocos2dxActivity{
	
	
	Timer timer = new Timer( );
	@SuppressLint("HandlerLeak")
	final Handler handler = new Handler() {
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 1:
				Log.e("[!!! Test Timer]","Timer");
				
				Wechat.ShareParams sp = new Wechat.ShareParams();
				sp.title = "ShareSDK 微信好友测试 title";
				sp.text = "测试分享的文本";
				sp.shareType = Platform.SHARE_TEXT;
				//sp.imagePath = "/mnt/sdcard/icon.png";

				Platform weixin = ShareSDK.getPlatform(qietingfengyun.this, Wechat.NAME);
				//weibo.setPlatformActionListener(paListener); // 设置分享事件回调
				// 执行图文分享
				weixin.share(sp);
				/*
				SinaWeibo.ShareParams sp = new SinaWeibo.ShareParams();
				//sp.title = "ShareSDK 微信好友测试 title";
                sp.text = "ShareSDK 微信好友测试 text";
                sp.imageUrl = "http://static.acfun.tv/Images/Upload2/Images/2013-11-20/bcb51da8-25e5-439f-8c8c-7c9b4c2effa2.png";
                //sp.shareType = Platform.SHARE_TEXT;
				//sp.imagePath = "/mnt/sdcard/icon.png";

				Platform weibo = ShareSDK.getPlatform(qietingfengyun.this, SinaWeibo.NAME);
				//weibo.setPlatformActionListener(paListener); // 设置分享事件回调
				// 执行图文分享
				weibo.share(sp);
				*/
				
				timer.cancel();
				
				break;
			}

			super.handleMessage(msg);
		}
	};
	
	TimerTask task = new TimerTask( ) {
		public void run ( ) {
			Message message = new Message( );
			message.what = 1;
			handler.sendMessage(message);
		}
	};

	
	

	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		
		CommonFunction.setContext(this);
		
		// 初始化ShareSDK
		ShareSDK.initSDK(this,"98333c6897c");
		
		PluginWrapper.init(this); // for plugins
		
		// If you want your callback function can be invoked in GL thread, add this line:
		PluginWrapper.setGLSurfaceView(Cocos2dxGLSurfaceView.getInstance());
	}
	
	protected void onStart()
	{
		super.onStart();
		//ShareSDK.setWechatDevInfo(getContext(), "wxdea41cab84b6c578", 1, 1, true, true);
		//ShareSDK.setWechatMomentsDevInfo(getContext(), "wxdea41cab84b6c578", 2, 2, true, true);
		
		//测试分享
		//timer.schedule(task,5000,1000000000);
	}
	
	@Override
	protected void onDestroy()
	{
		//测试分享
		//timer.cancel();
		
		// 停掉ShareSDK
		ShareSDK.stopSDK(this);
		
		super.onDestroy();
	}
	
    static {
         System.loadLibrary("game");
    }
}