using UnityEngine;
using System.Collections;

[System.Serializable]
public class UniTileTemplate 
{
	public string name;
	[HideInInspector] public TileInstance[] selectedTilesList	= new TileInstance[0];
	[HideInInspector] public int[] selectedTiles				= new int[0];
	[HideInInspector] public int selectedTilesWidth				= 0;
	[HideInInspector] public TileInstance selectedTile 			= new TileInstance(0);
	[HideInInspector] public TileInstance selectedTileEnd 		= new TileInstance(0);
	[HideInInspector] public bool tilesPicked 					= false;
	
	public int selectedTilesHeight {
		get {
			return selectedTilesList.Length / selectedTilesWidth;
		}
	}
	
	public void Init(UniTileTemplate other) 
	{
		other.CopyTo(this);
		this.name = "Template "+UniTileManager.instance.templateCount;
	}
	
	public void CopyTo(UniTileTemplate other)
	{
		other.name 						= name;
		other.selectedTilesList 		= new TileInstance[this.selectedTilesList.Length];
		for(int i = 0; i < this.selectedTilesList.Length; i++) {
			other.selectedTilesList[i]	= this.selectedTilesList[i].Clone();
		}
		other.selectedTilesWidth 		= selectedTilesWidth;
		other.selectedTile 				= selectedTile.Clone();
		other.selectedTileEnd 			= selectedTileEnd.Clone();
		other.tilesPicked 				= tilesPicked;
	}
	
	public void Clear()
	{
		selectedTilesWidth = 1;
		selectedTilesList = new TileInstance[1];
		selectedTilesList[0] = new TileInstance(0);
	}
}
