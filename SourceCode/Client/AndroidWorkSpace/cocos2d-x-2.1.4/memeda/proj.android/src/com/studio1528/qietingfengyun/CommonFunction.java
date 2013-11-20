package com.studio1528.qietingfengyun;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.MediaStore.Audio.AudioColumns;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

public class CommonFunction {
	public static void openUrl(String url)
	{
		Uri uri = Uri.parse(url);
		Intent it = new Intent(Intent.ACTION_VIEW, uri);
		gContext.startActivity(it);
	}
	
	public static void setContext(Context context)
	{
		gContext = context;
	}
	
	public static void setActualDefaultRingtoneUri(String ring, String path, String name)
	{
		if ( ring.contentEquals("RINGTONE") )
		{
			RingtoneHelper helper = new RingtoneHelper(ring, path, name);
			helper.start();
		}
	}
	
	public static Context gContext;
}

class RingtoneHelper extends Thread {
	RingtoneHelper(String ring, String path, String name) {
		this.ring = ring;
		this.path = path;
		this.name = name;
	}
	
	public void run() {
		try 
		{
			String strPath = copyFile(path, name);
			settingRingertone(strPath, name);
		}
		catch (Exception e)
		{
		}
	}
	
	private static String copyFile(String path, String name) throws IOException
	{
    	File sdDir = null;
    	sdDir = Environment.getExternalStorageDirectory();
    	
    	String strPath = sdDir.toString() + "/Music";
    	File filePath = new File(strPath);
    	if ( !filePath.isDirectory() ) 
    	{
    		filePath.mkdir();
    	}
    	
    	String strDestPath = strPath + "/" + name + ".mp3";
    	
    	Log.d("settingRingertone", strDestPath);
    	
    	AssetManager am = CommonFunction.gContext.getAssets();
    	InputStream input = am.open(path);
    	byte[] reader = new byte[input.available()];
    
    	Log.d("settingRingertone", String.valueOf(input.available()));
    	
    	int nLen = input.read(reader);
    	Log.d("settingRingertone", String.valueOf(nLen));
    	
    	
    	input.close();
    	
    	File file = new File(strDestPath);
    	if ( file.exists() )
    	{
    		file.delete();
    	}
    	
    	file.createNewFile();
    	FileOutputStream out = new FileOutputStream(file);
    	out.write(reader);
    	
    	out.close();
    	
    	return strDestPath;
	}
	
    private static void settingRingertone(String path, String name) {
          ContentValues cv = new ContentValues();
          Uri uri = MediaStore.Audio.Media.getContentUriForPath(path);
            
          Cursor cursor = CommonFunction.gContext.getContentResolver().query(uri,
            null, null, null, MediaStore.Audio.Media.DEFAULT_SORT_ORDER);
          Uri newUri = null;
          if (cursor.moveToFirst()) {
               String _id = cursor.getString(0);
               cv.put(MediaStore.Audio.Media.IS_RINGTONE, true);//设置来电铃声为true
               cv.put(MediaStore.Audio.Media.IS_NOTIFICATION, false);//设置通知铃声为false
               cv.put(MediaStore.Audio.Media.IS_ALARM, false);//设置闹钟铃声为false
               cv.put(MediaStore.Audio.Media.IS_MUSIC, false);
               cv.put(MediaStore.Audio.Media.MIME_TYPE, "audio/mp3");
               cv.put(MediaStore.Audio.Media.TITLE, name);
               cv.put(AudioColumns.DATA,path);
               newUri = CommonFunction.gContext.getContentResolver().insert(uri, cv);
          }
          // 设置铃声
           RingtoneManager.setActualDefaultRingtoneUri(CommonFunction.gContext, RingtoneManager.TYPE_RINGTONE, newUri );
          if(cursor != null){
              cursor.close();
          }
    }
   
    
	private String ring;
	private String path;
	private String name;
}

