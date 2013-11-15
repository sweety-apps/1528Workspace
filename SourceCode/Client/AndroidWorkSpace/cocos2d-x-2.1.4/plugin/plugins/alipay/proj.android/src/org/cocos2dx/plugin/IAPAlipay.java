package org.cocos2dx.plugin;

import java.util.Hashtable;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.view.KeyEvent;

public class IAPAlipay implements InterfaceIAP {
    protected static void LogD(String msg) {
        Log.d(TAG, msg);
    }

    protected static String TAG = "IAPAlipay";

    protected static void LogE(String msg, Exception e) {
        Log.e(TAG, msg, e);
        e.printStackTrace();
    }
    
	public void configDeveloperInfo(Hashtable<String, String> cpInfo)
	{
		
	}
	
	public void setDebugMode(boolean debug)
	{
		
	}
	
	public String getSDKVersion()
	{
		return "1.0";
	}
	
	public String getPluginVersion()
	{
		return "1.0";	
	}
	
    public IAPAlipay(Context context) {
        mContext = context;
    }

	public void payForProduct(Hashtable<String, String> cpInfo)
	{
		
	}

	//
	//
	/**
	 * the OnCancelListener for lephone platform. lephone系统使用到的取消dialog监听
	 */
	static class AlixOnCancelListener implements
			DialogInterface.OnCancelListener {
		Activity mcontext;

		AlixOnCancelListener(Activity context) {
			mcontext = context;
		}

		public void onCancel(DialogInterface dialog) {
			mcontext.onKeyDown(KeyEvent.KEYCODE_BACK, null);
		}
	}
	
	private Context mContext;
}
