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
				
				Platform.ShareParams sp = new SinaWeibo.ShareParams();
				sp.text = "测试分享的文本";
				//sp.imagePath = “/mnt/sdcard/测试分享的图片.jpg”;

				Platform weibo = ShareSDK.getPlatform(getBaseContext(), SinaWeibo.NAME);
				//weibo.setPlatformActionListener(paListener); // 设置分享事件回调
				// 执行图文分享
				weibo.share(sp);
				
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
		
		PluginWrapper.init(this); // for plugins
		
		// If you want your callback function can be invoked in GL thread, add this line:
		PluginWrapper.setGLSurfaceView(Cocos2dxGLSurfaceView.getInstance());
		
		// 初始化ShareSDK
		ShareSDK.initSDK(this);
		
		//测试分享
		timer.schedule(task,2000,10000);
	}
	
	@Override
	protected void onDestroy()
	{
		//测试分享
		timer.cancel();
		
		// 停掉ShareSDK
		ShareSDK.stopSDK(this);
		
		super.onDestroy();
	}
	
    static {
         System.loadLibrary("game");
    }
}