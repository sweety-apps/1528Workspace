package com.studio1528.qietingfengyun;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;


public class SplashActivity extends Activity{

	 @Override
	 protected void onCreate(Bundle savedInstanceState) {
	  super.onCreate(savedInstanceState);
	  setContentView(R.layout.splash);
	               // 闪屏的核心代码
	  new Handler().postDelayed(new Runnable() {
	   @Override
	   public void run() {
	    Intent intent = new Intent(SplashActivity.this,qietingfengyun.class);  //从启动动画ui跳转到主ui
	    startActivity(intent);
	    SplashActivity.this.finish();    // 结束启动动画界面
	   }
	  }, 3000);    //启动动画持续3秒钟
	 }   
}
