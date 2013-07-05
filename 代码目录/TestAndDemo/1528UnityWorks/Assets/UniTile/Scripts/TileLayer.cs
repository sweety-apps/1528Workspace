// Copyright 2011 Sven Magnus
#define INCLUDE_TILE_DATA

using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

[AddComponentMenu("UniTile/TileLayer")]
public class TileLayer : MonoBehaviour 
{	
	public TileLayer parent;
	
	public bool useUvSpace = false;
	public bool	collidable = true;
	
	public Vector2 tileSize = new Vector2(32, 32);
	public Vector2 tileSpacing = new Vector2(-1, -1);
	public Vector2 overlap = new Vector2(0, 0);
	public Vector2 groupSize = new Vector2(10, 10);
	public Vector2 layerSize = new Vector2(100, 50);
	public Vector2 borderSize = new Vector2(0, 0);
	public Vector2 borderSizeUv = new Vector2(0, 0);
	public UniTileTileset tileset;
	public Material material;
	public bool readableTexture;
	
	public int TilesetWidth 	{ get { return (material==null || material.mainTexture==null) ? 0:(int)Mathf.Floor((float)material.mainTexture.width / (tileSize.x + borderSize.x)); } }
	public int TilesetHeight	{ get { return (material==null || material.mainTexture==null) ? 0:(int)Mathf.Floor((float)material.mainTexture.height / (tileSize.y + borderSize.y)); } }
	
	// Multidemensional arrays are not serialized so we need to be creative
	// TODO: these arrays shouldn't exist in runtime builds should they?
#if UNITY_EDITOR || INCLUDE_TILE_DATA
	public TileInstance[] tileData;
#endif
	
#if UNITY_EDITOR
	[HideInInspector] public int[] tiles;
#endif
	

	
	public Vector2 tileUvSize 
	{ 
		get 
		{
			if(material == null || material.mainTexture == null)
				return new Vector2(0.1f, 0.1f);
			
			return new Vector2(tileSize.x/material.mainTexture.width, tileSize.y/material.mainTexture.height);
		}
		
		set 
		{
			if(material == null || material.mainTexture == null)
				return;
			
			tileSize = new Vector2(value.x*material.mainTexture.width, value.y*material.mainTexture.height);
		}
	}
	
	public Vector2 overlapUv// = new Vector2(0, 0);
	{ 
		get 
		{
			if(material == null || material.mainTexture == null)
				return new Vector2(0.0f, 0.0f);
			
			return new Vector2(overlap.x/material.mainTexture.width, overlap.y/material.mainTexture.height);
		}
		
		set 
		{
			if(material == null || material.mainTexture == null)
				return;
			
			overlap = new Vector2(value.x*material.mainTexture.width, value.y*material.mainTexture.height);
		}
	}
	
	public bool IsChildLayer
	{
		get { return parent != null; } 
	}
	
	public Transform GroupRoot 
	{ 
		get 
		{  
			if(IsChildLayer)
				return parent.GroupRoot;
			
			Transform tr = transform.FindChild("Groups"); 
			if(tr==null)
			{
				tr = new GameObject().transform;
				tr.name = "Groups";
				tr.parent = transform;
				tr.localPosition = Vector3.zero;
				tr.localScale = Vector3.one;
			}
			return tr;
		} 
	} 
#if UNITY_EDITOR || INCLUDE_TILE_DATA
	public int GetTileId(int x, int y) {
		if(this.tileData == null || this.tileData.Length <= x + y * (int)this.layerSize.x) return -1;
		if(x<0 || x>=layerSize.x || y<0 || y>=layerSize.y) return -1;
		return this.tileData[x + y * (int)this.layerSize.x].id;
	}
	
	public UniTileTile GetTile(int x, int y) {
		if(this.tileData == null 
		   || this.tileset == null
		   || this.tileset.tiles == null
		   || this.tileData.Length <= x + y * (int)this.layerSize.x
		   || x<0 || x>=layerSize.x || y<0 || y>=layerSize.y)
			return null;
		
		if(this.tileData[x + y * (int)this.layerSize.x] == null) return null;
		int tile = this.tileData[x + y * (int)this.layerSize.x].id;
		if(tile < 0 || tile >= this.tileset.tiles.Length) 
			return null;
		
		return this.tileset.tiles[tile];
	}
	
	public TileInstance GetTileData(int x, int y) {
		if(this.tileData == null 
		   || this.tileset == null
		   || this.tileset.tiles == null
		   || this.tileData.Length <= x + y * (int)this.layerSize.x
		   || x<0 || x>=layerSize.x || y<0 || y>=layerSize.y)
			return null;
		
		return this.tileData[x + y * (int)this.layerSize.x];
	}
	
	public GameObject GetPrefab(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return null;
		return tile.prefab;
	}
	
	public string GetName(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return null;
		return tile.name;
	}
	
	public float GetValue(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return 0;
		return tile.value;
	}
	
	public string GetProperty(int x, int y, string key) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return null;
		for(int i=0; i<tile.properties.Length; i++) {
			if(tile.properties[i].key == key) {
				return tile.properties[i].value;
			}
		}
		return null;
	}
	
	public bool HasBox(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return false;
		return tile.boxCollider;
	}
	
	public int GetBoxLayer(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return 0;
		return tile.boxLayer;
	}
	
	public string GetBoxTag(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return null;
		return tile.boxTag;
	}
	
	public float GetBoxDepth(int x, int y) {
		UniTileTile tile = GetTile(x, y);
		if(tile == null) return 0;
		return tile.boxDepth;
	}
	
	public void SetTiles(TileChange[] changes)
	{
		foreach(TileChange change in changes)
		{
			SetTileInternal(change.pos.x, change.pos.y, change.newTile);
		}
		TileLayerUtil.RedrawGroupForChanges(this, changes);
	}
	
	public void SetTile(TileChange change)
	{
		SetTileInternal(change.pos.x, change.pos.y, change.newTile);
		TileLayerUtil.RedrawGroupForChange(this, change);
	}
	
	public void SetTile(int x, int y, int newTileId)
	{
		SetTile(new TileChange(x,y,newTileId));
	}	

	private void SetTileInternal(int x, int y, int newTileId)
	{
		if(tileData == null 
		   || tileset == null
		   || tileset.tiles == null
		   || tileData.Length <= x + y * (int)layerSize.x
		   || x<0 || x>=layerSize.x || y<0 || y>=layerSize.y)
			return;
		
		if(newTileId < 0 || newTileId >= tileset.tiles.Length)
			return;
		
		int tilePos = x + y * (int)this.layerSize.x;
		this.tileData[tilePos] = new TileInstance(newTileId);
	}
	
	public bool CanMergeBoxColliders(int aX, int aY, int bX, int bY)
	{
		TileInstance tileInstanceA = GetTileData(aX, aY);
		TileInstance tileInstanceB = GetTileData(bX, bY);
		
		
		if(tileInstanceA == null || tileInstanceB == null)
			return false;
		else {
			UniTileTile tileA = GetTile(aX, aY);
			return tileA.CanMergeBoxColliderWith(GetTile(bX, bY), aX, aY, bX, bY, tileInstanceA.flippedHorizontally, tileInstanceA.flippedVertically, tileInstanceA.rotation, tileInstanceB.flippedHorizontally, tileInstanceB.flippedVertically, tileInstanceB.rotation, this.tileSpacing);
		}
	}	
#endif
}

[System.Serializable]
public class TileInstance {
	public int id;
	public Rotation rotation;
	public bool flippedHorizontally;
	public bool flippedVertically;
	
	public enum Rotation {
		r0,
		r90,
		r80,
		r270,
	}
	
	public TileInstance(int id) {
		this.id = id;
		this.rotation = 0;
		this.flippedHorizontally = this.flippedVertically = false;
	}
	
	public TileInstance(int id, Rotation rotation, bool flippedHorizontally, bool flippedVertically) {
		this.id = id;
		this.rotation = rotation;
		this.flippedHorizontally = flippedHorizontally;
		this.flippedVertically = flippedVertically;
	}
	
	public TileInstance Clone() {
		return new TileInstance(this.id, this.rotation, this.flippedHorizontally, this.flippedVertically);
	}
}