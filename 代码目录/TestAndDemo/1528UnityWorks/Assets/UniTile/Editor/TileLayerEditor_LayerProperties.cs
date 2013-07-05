using UnityEditor;
using UnityEngine;
using System.Collections.Generic;

public class TileLayerEditor_LayerProperties
{
	Vector2 tileSizeTemp = new Vector2(-1,-1);
	Vector2 tileSpacingTemp = new Vector2(-1,-1);
	Vector2 tileUvSizeTemp = new Vector2(-1,-1);
	Vector2 overlapTemp = new Vector2(-1,-1);
	Vector2 overlapUvTemp = new Vector2(-1,-1);
	Vector2 groupSizeTemp = new Vector2(-1,-1);
	Vector2 layerSizeTemp = new Vector2(-1,-1);
	Vector2 borderSizeTemp = new Vector2(-1,-1);
	Vector2 borderSizeUvTemp = new Vector2(-1,-1);
	
	public void OnEnable(TileLayer layer)
	{
		SetPropertiesFrom(layer);
	}	
	
	public void OnInspectorGUI(TileLayer layer)
	{
		
		if(layer.parent == null) 
		{	
			bool uvspace = EditorGUILayout.Toggle("Use UV space", layer.useUvSpace);
			if(uvspace != layer.useUvSpace) 
			{
				HandleUtility.Repaint ();
				layer.useUvSpace = uvspace;
				return;
			}
			
			if(layer.useUvSpace) 
			{
				tileUvSizeTemp = EditorGUILayout.Vector2Field ("Tile Size (UV)", tileUvSizeTemp);
				tileSpacingTemp = EditorGUILayout.Vector2Field ("Tile Output Size (Units)", tileSpacingTemp);
				overlapUvTemp = EditorGUILayout.Vector2Field ("Tile Overlap (UV)", overlapUvTemp);
				borderSizeUvTemp = EditorGUILayout.Vector2Field ("Tile Border Size (UV)", borderSizeUvTemp);
				
				if(layer.material != null && layer.material.mainTexture != null) 
				{
					tileSizeTemp = new Vector2(tileUvSizeTemp.x * layer.material.mainTexture.width, tileUvSizeTemp.y * layer.material.mainTexture.height);
					overlapTemp = new Vector2(overlapUvTemp.x * layer.material.mainTexture.width, overlapUvTemp.y * layer.material.mainTexture.height);
					borderSizeTemp = new Vector2(borderSizeUvTemp.x * layer.material.mainTexture.width, borderSizeUvTemp.y * layer.material.mainTexture.height);
				}
			} 
			else 
			{
				Vector2 prev = tileSizeTemp;
				tileSizeTemp = EditorGUILayout.Vector2Field ("Tile Size", tileSizeTemp);
				if(prev != tileSizeTemp && prev == tileSpacingTemp) 
				{
					tileSpacingTemp = new Vector2(Mathf.Max(0,Mathf.Floor(tileSizeTemp.x)),Mathf.Max(0,Mathf.Floor(tileSizeTemp.y)));
				}
				tileSpacingTemp = EditorGUILayout.Vector2Field ("Tile Output Size (Units)", tileSpacingTemp);
				overlapTemp = EditorGUILayout.Vector2Field ("Tile Overlap", overlapTemp);
				borderSizeTemp = EditorGUILayout.Vector2Field ("Tile Border Size", borderSizeTemp);
				
				if(layer.material != null && layer.material.mainTexture != null) 
				{
					tileUvSizeTemp = new Vector2(tileSizeTemp.x / layer.material.mainTexture.width, tileSizeTemp.y / layer.material.mainTexture.height);
					overlapUvTemp = new Vector2(overlapTemp.x / layer.material.mainTexture.width, overlapTemp.y / layer.material.mainTexture.height);
					borderSizeUvTemp = new Vector2(borderSizeTemp.x / layer.material.mainTexture.width, borderSizeTemp.y / layer.material.mainTexture.height);
				}
			}
			
			groupSizeTemp = EditorGUILayout.Vector2Field ("Group Size", groupSizeTemp);
			layerSizeTemp = EditorGUILayout.Vector2Field ("Layer Size", layerSizeTemp);
		}
		
		layer.collidable = EditorGUILayout.Toggle("Build colliders", layer.collidable);
		
		
		if(layer.useUvSpace) 
		{
			tileSizeTemp = new Vector2(Mathf.Max(0,tileSizeTemp.x),Mathf.Max(0,tileSizeTemp.y));
			borderSizeTemp = new Vector2(Mathf.Max(0,borderSizeTemp.x),Mathf.Max(0,borderSizeTemp.y));
		} else 
		{
			tileSizeTemp = new Vector2(Mathf.Max(0,Mathf.Floor(tileSizeTemp.x)),Mathf.Max(0,Mathf.Floor(tileSizeTemp.y)));
			borderSizeTemp = new Vector2(Mathf.Max(0,Mathf.Floor(borderSizeTemp.x)),Mathf.Max(0,Mathf.Floor(borderSizeTemp.y)));
		}
		
		
		tileSpacingTemp = new Vector2(Mathf.Max(0,tileSpacingTemp.x),Mathf.Max(0,tileSpacingTemp.y));
		tileUvSizeTemp = new Vector2(Mathf.Max(0,tileUvSizeTemp.x),Mathf.Max(0,tileUvSizeTemp.y));
		groupSizeTemp = new Vector2(Mathf.Max(0,Mathf.Floor(groupSizeTemp.x)),Mathf.Max(0,Mathf.Floor(groupSizeTemp.y)));
		layerSizeTemp = new Vector2(Mathf.Max(0,Mathf.Floor(layerSizeTemp.x)),Mathf.Max(0,Mathf.Floor(layerSizeTemp.y)));
		
	}
	
	public void SetPropertiesFrom (TileLayer layer)
	{
		tileSizeTemp = layer.tileSize;
		tileSpacingTemp = layer.tileSpacing;
		tileUvSizeTemp = layer.tileUvSize;
		overlapTemp = layer.overlap;
		overlapUvTemp = layer.overlapUv;
		groupSizeTemp = layer.groupSize;
		layerSizeTemp = layer.layerSize;
		borderSizeTemp = layer.borderSize;
		borderSizeUvTemp = layer.borderSizeUv;
	}
	
	public void SetPropertiesTo (TileLayer layer)
	{
		layer.tileSize = tileSizeTemp;
		layer.tileSpacing = tileSpacingTemp;
		layer.tileUvSize = tileUvSizeTemp;
		layer.overlap = overlapTemp;
		layer.overlapUv = overlapUvTemp;
		layer.groupSize = groupSizeTemp;
		layer.layerSize = layerSizeTemp;
		layer.borderSize = borderSizeTemp;
		layer.borderSizeUv = borderSizeUvTemp;		
	}
}

