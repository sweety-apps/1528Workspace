package org.cocos2dx.plugin;

import java.util.Hashtable;

import net.youmi.android.AdManager;
import net.youmi.android.offers.OffersManager;
import net.youmi.android.offers.PointsChangeNotify;
import net.youmi.android.offers.PointsManager;

import android.content.Context;
import android.util.Log;

public class AnalyticsOfferWall implements InterfaceSocial {
    protected static void LogD(String msg) {
        if (isDebug) {
            Log.d(TAG, msg);
        }
    }

    protected static String TAG = "YoumiOfferWall";

    protected static void LogE(String msg, Exception e) {
        Log.e(TAG, msg, e);
        e.printStackTrace();
    }

    private static boolean isDebug = true;
    
    public AnalyticsOfferWall(Context context) {
        LogD("YoumiOfferWall");
        mContext = context;
    }
    
	public void configDeveloperInfo(Hashtable<String, String> cpInfo)
	{
		
	}
	
	public void share(Hashtable<String, String> cpInfo)
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
	
	public void Init(String publishId)
	{
		strPublishId = publishId;
		
		AdManager.getInstance(mContext).init("08ba0f3e3312dcde", "0bf0c4f3f3da76f3", false);
		OffersManager.getInstance(mContext).setCustomUserId(strUserId);
		OffersManager.getInstance(mContext).onAppLaunch();	
	}
	
	public void SetUserID(String userID)
	{
		strUserId = userID;
	}
	
	
	public void ShowModal()
	{	// 显示积分墙
		OffersManager.getInstance(mContext).showOffersWall();
	}
	
	public void requestOnlinePointCheck()
	{
		Log.d("requestOnlinePointCheck222", "1111");
		
		int pb = PointsManager.getInstance(mContext).queryPoints();
		if ( pb > 0 ) 
		{
			if ( !PointsManager.getInstance(mContext).spendPoints(pb) ) 
			{
				pb = 0;
			}
		}
		
		String msg = "offerWallDidFinishCheck {\"Point\" : ";
		msg += String.valueOf(pb);
		msg += "}";	
		
		Log.d("requestOnlinePointCheck", msg);
		SendEvent(msg);
	}
	
	public void requestOnlineConsumeWithPoint(int num)
	{
		SendEvent("requestOnlineConsumeWithPoint {\"res\":\"false\"}");	
	}
	
	void offerWallDidClosed()
	{
		SendEvent("WindowClosed");
	}
	
	void SendEvent(String msg)
	{
		LogD(msg);
		SocialWrapper.onShareResult(this, 0, msg);
	}
	
	private String strPublishId;
	private String strUserId;
	private Context mContext;
}