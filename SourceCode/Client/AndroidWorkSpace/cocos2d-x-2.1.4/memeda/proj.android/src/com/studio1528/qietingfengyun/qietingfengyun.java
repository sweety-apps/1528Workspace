package com.studio1528.qietingfengyun;

import java.util.Timer;
import java.util.TimerTask;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.plugin.PluginWrapper;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.Layout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

public class qietingfengyun extends Cocos2dxActivity{
	
	
	Timer timer = new Timer( );
	@SuppressLint("HandlerLeak")
	final Handler handler = new Handler() {
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 1:
				Log.e("[!!! Test Timer]","Timer");
				
				/*
				//Wechat.ShareParams sp = new Wechat.ShareParams();
				WechatMoments.ShareParams sp = new WechatMoments.ShareParams();
				sp.title = "ShareSDK 微信好友测试 title";
				sp.text = "测试分享的文本";
				sp.shareType = Platform.SHARE_TEXT;
				//sp.imagePath = "/mnt/sdcard/icon.png";

				//Platform weixin = ShareSDK.getPlatform(qietingfengyun.this, Wechat.NAME);
				Platform weixin = ShareSDK.getPlatform(qietingfengyun.this, WechatMoments.NAME);
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

	
	protected View mSplashView = null;
	protected ViewGroup mRootView = null;
	protected long mUIThreadID = -1;
	static protected qietingfengyun gActivity = null;

	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		
		ViewGroup rootView = (ViewGroup)((ViewGroup)this.findViewById(android.R.id.content)).getChildAt(0);
		LayoutInflater inflater = (LayoutInflater)getContext().getSystemService( Context.LAYOUT_INFLATER_SERVICE);  
		View view = inflater.inflate(R.layout.splash, null);
		rootView.addView(view);
		mSplashView = view;
		mRootView = rootView;
		mUIThreadID = Thread.currentThread().getId();
		gActivity = this;
		
		CommonFunction.setContext(this);
		
		// 初始化ShareSDK
		//ShareSDK.initSDK(this,"98333c6897c");
		
		PluginWrapper.init(this); // for plugins
		
		// If you want your callback function can be invoked in GL thread, add this line:
		PluginWrapper.setGLSurfaceView(Cocos2dxGLSurfaceView.getInstance());
	}
	
	protected void onStart()
	{
		super.onStart();
		
		//Intent intent = new Intent(qietingfengyun.this,SplashActivity.class);  //从启动动画ui跳转到主ui
	    //startActivity(intent);
		
		//ShareSDK.setWechatDevInfo(getContext(), "wxdea41cab84b6c578", 1, 1, true, true);
		//ShareSDK.setWechatMomentsDevInfo(getContext(), "wxdea41cab84b6c578", 2, 2, true, true);
		
		//测试分享
		//timer.schedule(task,5000,1000000000);
	}
	
	
	protected void RemoveSplashViewInner()
	{
		if(gActivity != null)
		{
			gActivity.mRootView.removeView(gActivity.mSplashView);
			gActivity.mSplashView = null;
			gActivity.mRootView = null;
			gActivity = null;
		}
	}
	
	protected static final int MSG_REMOVE_SPLASH = 110;//去掉闪屏页的消息
	@SuppressLint("HandlerLeak")
	protected Handler mRemoveSplashHandler = new Handler() {
		public void handleMessage (Message msg)
		{
			switch(msg.what) {
            case MSG_REMOVE_SPLASH:
            	RemoveSplashViewInner();
            	mRemoveSplashHandler = null;
                break;
            default:
            	break;
			}
		}
	};
	
	public static void RemoveSplashView()
	{
		if(gActivity != null)
		{
			if(Thread.currentThread().getId() != gActivity.mUIThreadID)
			{
				//非主线程调用，发消息切换线程
				gActivity.mRemoveSplashHandler.obtainMessage(MSG_REMOVE_SPLASH).sendToTarget();
			}
			else
			{
				gActivity.RemoveSplashViewInner();
			}
		}
	}
	
	@Override
	protected void onDestroy()
	{
		//测试分享
		//timer.cancel();
		
		// 停掉ShareSDK
		//ShareSDK.stopSDK(this);
		
		super.onDestroy();
	}
	
    static {
         System.loadLibrary("game");
    }
}