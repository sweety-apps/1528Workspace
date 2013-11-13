package org.cocos2dx.plugin;

import java.util.Hashtable;

import android.content.Context;
import android.util.Log;
import cn.domob.offer.wall.data.DomobOfferWallErrorInfo;
import cn.domob.offer.wall.data.DomobOfferWallManager;
import cn.domob.offer.wall.data.DomobOfferWallManager.ConsumeStatus;

public class AnalyticsOfferWall implements InterfaceSocial {
    protected static void LogD(String msg) {
        if (isDebug) {
            Log.d(TAG, msg);
        }
    }

    protected static String TAG = "AnalyticsOfferWall";

    protected static void LogE(String msg, Exception e) {
        Log.e(TAG, msg, e);
        e.printStackTrace();
    }

    private static boolean isDebug = true;
    
    public AnalyticsOfferWall(Context context) {
        LogD("AnalyticsOfferWall");
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
		
		mDomobOfferWallManager = new DomobOfferWallManager(mContext, strPublishId);
	}
	
	public void SetUserID(String userID)
	{
		strUserId = userID;
	}
	
	
	public void ShowModal()
	{	// 显示积分墙
		mDomobOfferWallManager.loadOfferWall();
	}
	
	public void requestOnlinePointCheck()
	{
		
	}
	
	public void requestOnlineConsumeWithPoint(int num)
	{
		
	}
	
	private String strPublishId;
	private String strUserId;
	private DomobOfferWallManager mDomobOfferWallManager;
	private Context mContext;
}
