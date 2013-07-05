// Copyright 2011 Sven Magnus

using UnityEngine;
using System.Collections;

public class UniTileManager : MonoBehaviour 
{
	private static UniTileManager _instance;
	
	public static UniTileManager instance 
	{
		get 
		{
			if(_instance==null) 
			{
				GameObject g = GameObject.Find("UniTileManager");
				if(g == null) 
				{
					g = new GameObject("UniTileManager");
					_instance = g.AddComponent<UniTileManager>();
				} else 
				{
					_instance = g.GetComponent<UniTileManager>();
				}
				g.tag = "EditorOnly";
			}
			return _instance;
		}
	}
	
	public static UniTileManager Reset() 
	{
		// Removes the reference to the manager
		// This seems to be necessary due to a problem where a new instance is actually created when undoing something, while the reference was still pointing to the old one (which was no longer in the scene).
		// (Gave me quite a headache xD)
		_instance = null;
		return instance;
	}

	[HideInInspector,System.NonSerialized] public TileLayer activeLayer;
	[HideInInspector,System.NonSerialized] public ObjectLayer activeObjectLayer;
	[HideInInspector] public TileLayer lastLayer;
	
	[HideInInspector] public int layerCount = 0;
	[HideInInspector] public int objectLayerCount = 0;
	[HideInInspector] public int templateCount = 0;

#if UNITY_EDITOR
	[HideInInspector] public UniTileTemplate[] templates = new UniTileTemplate[0];

	public void MigrateTemplates()
	{
		if(templates.Length == 0)
			return;
		
		for(int i = 0; i < templates.Length; i++) {
			if(templates[i].selectedTiles != null && templates[i].selectedTiles.Length > 0) {
				if((templates[i].selectedTilesList == null || templates[i].selectedTilesList.Length == 0)) {
					templates[i].selectedTilesList = new TileInstance[templates[i].selectedTiles.Length];
					for(int j = 0; j < templates[i].selectedTiles.Length; j++) {
						templates[i].selectedTilesList[j] = new TileInstance(templates[i].selectedTiles[j]);
					}
				}
				templates[i].selectedTiles = new int[0];
			}
		}
		
		UniTileTileset[] tilesets = (UniTileTileset[])FindObjectsOfTypeIncludingAssets(typeof(UniTileTileset));
		foreach(UniTileTileset tileset in tilesets)
		{
			if(tileset.templates.Length == 0)
				tileset.templates = templates;
		}
		
		templates = new UniTileTemplate[0];
	}

	
	public void MigrateTiles() {
		
		Object [] layers = GameObject.FindObjectsOfType(typeof(TileLayer));
		
		for(int i = 0; i < layers.Length; i++) {
			TileLayer layer = (TileLayer)layers[i];
			if(layer.tiles != null && layer.tiles.Length > 0) {
				if(layer.tileData == null || layer.tileData.Length == 0) {
					layer.tileData = new TileInstance[layer.tiles.Length];
					for(int j = 0; j < layer.tiles.Length; j++) {
						layer.tileData[j] = new TileInstance(layer.tiles[j]);
					}
				}
				layer.tiles = new int[0];
			}
		}
			
		
	}
#endif
	
}