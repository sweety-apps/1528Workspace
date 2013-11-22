package org.cocos2dx.plugin;

import java.util.Hashtable;

import org.cocos2dx.plugin.InterfaceSocial;
import org.cocos2dx.plugin.PluginWrapper;

import com.studio1528.qietingfengyun.R;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.SendMessageToWX;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.mm.sdk.openapi.WXMediaMessage;
import com.tencent.mm.sdk.openapi.WXWebpageObject;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

public class ShareSDKPluginX implements InterfaceSocial {
	private static final String PLUGIN_VER = "1.0.0";
	private Context context;
	private IWXAPI api = null;
	public final static String APP_ID = "wxdea41cab84b6c578";
	public static ShareSDKPluginX sharedInstance = null;

	public ShareSDKPluginX(Context context) {
		Log.d("plugin-x shareSDK", "ShareSDKPluginX created");
		
		this.context = context;
		if(api == null)
		{
			api = WXAPIFactory.createWXAPI(context, APP_ID);
		}
		
		api.registerApp(APP_ID);
		
		sharedInstance = this;
	}
	
	public void configDeveloperInfo(Hashtable<String, String> cpInfo) {
		
	}
	
	private String buildTransaction(final String type) {
		return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
	
	public void shareWithRawSdk(final Hashtable<String, String> cpInfo) {
		
		WXWebpageObject webpage = new WXWebpageObject();
		//webpage.webpageUrl = "http://www.baidu.com";
		
		if (cpInfo.containsKey("url")) {
			webpage.webpageUrl = cpInfo.get("url");
		}
		
		WXMediaMessage msg = new WXMediaMessage(webpage);
		//msg.title = "WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title WebPage Title Very Long Very Long Very Long Very Long Very Long Very Long Very Long Very Long Very Long Very Long";
		//msg.description = "WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description WebPage Description Very Long Very Long Very Long Very Long Very Long Very Long Very Long";
		Bitmap thumb = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon);
		msg.thumbData = Util.bmpToByteArray(thumb, true);
		
		if (cpInfo.containsKey("notifyIcon") && cpInfo.containsKey("notifyTitle")) {
			int icon = Integer.parseInt(cpInfo.get("notifyIcon"));
			String title = cpInfo.get("notifyTitle");
			//
			//sp.imageUrl = icon;
		}
		if (cpInfo.containsKey("text")) {
			msg.description = cpInfo.get("text");
		}
		if (cpInfo.containsKey("imagePath")) {
			//sp.imagePath = cpInfo.get("imagePath");
		}
		if (cpInfo.containsKey("filePath")) {
			//sp.filePath = cpInfo.get("filePath");
		}
		if (cpInfo.containsKey("title")) {
			msg.title = cpInfo.get("title");
		}
		if (cpInfo.containsKey("venueName")) {
			//oks.setVenueName(cpInfo.get("venueName"));
		}
		if (cpInfo.containsKey("venueDescription")) {
			//oks.setVenueDescription(cpInfo.get("venueDescription"));
		}
		if (cpInfo.containsKey("latitude")) {
			//oks.setLatitude(Float.parseFloat(cpInfo.get("latitude")));
		}
		if (cpInfo.containsKey("longitude")) {
			//oks.setLongitude(Float.parseFloat(cpInfo.get("longitude")));
		}
		if (cpInfo.containsKey("imageUrl")) {
			//sp.imageUrl = cpInfo.get("imageUrl");
		}
		if (cpInfo.containsKey("comment")) {
			//oks.setComment(cpInfo.get("comment"));
		}
		if (cpInfo.containsKey("titleUrl")) {
			//oks.setTitleUrl(cpInfo.get("titleUrl"));
		}
		if (cpInfo.containsKey("address")) {
			//oks.setAddress(cpInfo.get("address"));
		}
		if (cpInfo.containsKey("site")) {
			//oks.setSite(cpInfo.get("site"));
		}
		if (cpInfo.containsKey("siteUrl")) {
			//oks.setSiteUrl(cpInfo.get("siteUrl"));
		}
		if (cpInfo.containsKey("musicUrl")) {
			//sp.musicUrl = cpInfo.get("musicUrl");
			//oks.serMusicUrl(cpInfo.get("musicUrl"));
		}
		if (cpInfo.containsKey("silent")) {
			//oks.setSilent(Boolean.parseBoolean(cpInfo.get("silent")));
		}
		if (cpInfo.containsKey("platform")) {
			//oks.setPlatform(cpInfo.get("platform"));
		}
		if (cpInfo.containsKey("extInfo")) {
			//sp.extInfo = cpInfo.get("extInfo");
		}
		if (cpInfo.containsKey("callback")) {
			try {
				String name = cpInfo.get("callback");
				Class<?> clz = Class.forName(name);
				//PlatformActionListener pal = (PlatformActionListener) clz.newInstance();
				//weixin.setPlatformActionListener(pal);
				//oks.setCallback(pal);
			} catch (Throwable t) {
				throw new RuntimeException(t);
			}
		}
		if (cpInfo.containsKey("customize")) {
			try {
				String name = cpInfo.get("customize");
				Class<?> clz = Class.forName(name);
				//ShareContentCustomizeCallback ccc = (ShareContentCustomizeCallback) clz.newInstance();
				//oks.setShareContentCustomizeCallback(ccc);
			} catch (Throwable t) {
				throw new RuntimeException(t);
			}
		}
		if (cpInfo.containsKey("dialogMode") && "true".equals(cpInfo.get("dialogMode"))) {
			//oks.setDialogMode();
		}
		
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("webpage");
		req.message = msg;
		
		if (cpInfo.containsKey("isTimeline") && cpInfo.get("isTimeline").equalsIgnoreCase("true"))
		{
			req.scene = SendMessageToWX.Req.WXSceneTimeline;
		}
		else
		{
			req.scene = SendMessageToWX.Req.WXSceneSession;
		}
		
		api.sendReq(req);
	}
	
	public void share(final Hashtable<String, String> cpInfo) {
		PluginWrapper.runOnMainThread(new Runnable() {
			public void run() {
				//share(cpInfo);
				shareWithRawSdk(cpInfo);
			}
		});
	}

	public void setDebugMode(boolean debug) {
		
	}

	public String getSDKVersion() {
		//return ShareSDK.getSDKVersionName();
		return "1.0";
	}

	public String getPluginVersion() {
		return PLUGIN_VER;
	}

}
