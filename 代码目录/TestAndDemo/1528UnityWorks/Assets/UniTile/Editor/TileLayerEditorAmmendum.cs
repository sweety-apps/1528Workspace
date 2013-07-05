using UnityEditor;
using UnityEngine;
using System.Collections;

public static class TileLayerEditorAmmendum
{
	static bool keepRealtimeChanges = false;
	static bool wasPlayingLastUpdate = false;
	static Hashtable playModeTiles = new Hashtable();
	
	[MenuItem ("UniTile/Select Last Active Layer &l")]
	public static void SelectLastActiveLayer()
	{
		if(UniTileManager.instance == null)
			return;
		
		if(UniTileManager.instance.activeLayer)
		{
			Selection.activeObject = UniTileManager.instance.activeLayer.gameObject;
			return;
		}
		
		if(UniTileManager.instance.lastLayer)
		{
			Selection.activeObject = UniTileManager.instance.lastLayer.gameObject;
			return;
		}
		
		TileLayer layer = (TileLayer)GameObject.FindObjectOfType(typeof(TileLayer));
		Selection.activeObject = layer != null ? layer.gameObject:null;
	}
	
	public static void OnSceneGUI_Ammendum(TileLayer layer, UniTileTemplate manager, TileLayerEditor editor)
	{
		Handles.BeginGUI();

		GUILayout.BeginArea(new Rect(20, 40, 150, 40));
		keepRealtimeChanges = GUILayout.Toggle(keepRealtimeChanges, "Keep Playmode Changes", "Button");
		GUILayout.EndArea();
			
		Handles.EndGUI();
		
		TrackPlaymodeChanges(layer, editor);
	}
	
	private static void TrackPlaymodeChanges(TileLayer layer, TileLayerEditor editor)
	{
		TileLayer[] layers = (TileLayer[])GameObject.FindObjectsOfType(typeof(TileLayer));
		if(Application.isPlaying && keepRealtimeChanges)
		{
			playModeTiles[layer] = layer.tileData.Clone();
		}
		else 
		{
			if(wasPlayingLastUpdate && keepRealtimeChanges && !Application.isPlaying)
			{
				foreach(TileLayer l in layers)
				{
					if(playModeTiles.Contains(l))
					{
						l.tileData = (TileInstance[])playModeTiles[l];
						editor.RebuildMap(l.layerSize);
						TileLayerEditor.InstantiatePrefabs(l);
					}
				}
				
				Undo.RegisterSceneUndo("Playmode changes to tile layers");
			}
			
			playModeTiles.Clear();
		}
		wasPlayingLastUpdate = Application.isPlaying;
	}
}