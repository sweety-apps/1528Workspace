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
		
		mDomobOfferWallManager = new DomobOfferWallManager(mContext, strPublishId, strUserId);
		
		mDomobOfferWallManager.setAddWallListener(new DomobOfferWallManager.AddWallListener() {
			@Override
			public void onAddWallFailed(DomobOfferWallErrorInfo mDomobOfferWallErrorInfo) {
			}

			@Override
			public void onAddWallClose() {
				// 积分墙关闭
				offerWallDidClosed();
			}

			@Override
			public void onAddWallSucess() {
			}
		});

		mDomobOfferWallManager.setCheckPointsListener(new DomobOfferWallManager.CheckPointsListener() {
			@Override
			public void onCheckPointsSucess(final int point, final int consumed) {
				String msg = "offerWallDidFinishCheck {\"totalPoint\" : ";
				msg += String.valueOf(point);
				msg += ", \"consumed\":";
				msg += String.valueOf(consumed);
				msg += "}";		
				
				SendEvent(msg);
			}

			@Override
			public void onCheckPointsFailed(final DomobOfferWallErrorInfo mDomobOfferWallErrorInfo) {
				SendEvent("offerWallDidFailCheck");
			}
		});
	
		mDomobOfferWallManager.setConsumeListener(new DomobOfferWallManager.ConsumeListener() {

			@Override
			public void onConsumeFailed(final DomobOfferWallErrorInfo mDomobOfferWallErrorInfo) {
				SendEvent("offerWallDidFailConsume");
			}

			@Override
			public void onConsumeSucess(final int point,
					final int consumed, final ConsumeStatus cs) {
				String msg;
				switch (cs) {
				case SUCCEED:
					msg = "offerWallDidFinishConsume {\"totalPoint\" : ";
					msg += String.valueOf(point);
					msg += ", \"consumed\":";
					msg += String.valueOf(consumed);
					msg += ", \"statusCode\":";
					msg += String.valueOf(cs);				
					msg += "}";
				    
				    SendEvent(msg);
					break;
				default:
					SendEvent("offerWallDidFailConsume");
					break;
				}
			}
		});
		

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
		mDomobOfferWallManager.checkPoints();
	}
	
	public void requestOnlineConsumeWithPoint(int num)
	{
		mDomobOfferWallManager.consumePoints(num);
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
	private DomobOfferWallManager mDomobOfferWallManager;
	private Context mContext;
}
