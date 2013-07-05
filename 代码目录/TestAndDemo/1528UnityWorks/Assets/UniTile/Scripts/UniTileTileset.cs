using UnityEngine;
using System.Collections;

public class UniTileTileset : MonoBehaviour {
	public UniTileTile [] tiles;
	public UniTileTemplate[] templates = new UniTileTemplate[0];
}

[System.Serializable]
public class UniTileTile {
	// tile params
	public GameObject prefab;
	public Vector2 prefabOffset;
	public string name;
	public float value;
	public UniTileProperty [] properties;
	public bool resizable;
	
	// box params
	public bool boxCollider;
	public int boxLayer;
	public PhysicMaterial boxMaterial;
	public string boxTag = "Untagged";
	public float boxDepth = 64;
	public GameObject boxPrefab;
	public bool customBoxDimensions;
	public Rect boxDimensions;

	public bool CanMergeBoxColliderWith(UniTileTile b, int aX, int aY, int bX, int bY, bool aFlippedH, bool aFlippedV, TileInstance.Rotation aRotation, bool bFlippedH, bool bFlippedV, TileInstance.Rotation bRotation, Vector2 tileSize)
	{
		
		if(b == null) return false;
		
		Rect aRect = TileLayerUtil.TransformRect(boxDimensions, tileSize / 2f, aFlippedH, aFlippedV, aRotation);
		Rect bRect = TileLayerUtil.TransformRect(b.boxDimensions, tileSize / 2f, bFlippedH, bFlippedV, bRotation);
		
		
		return  b != null
				&& b.boxCollider 
				&& boxDepth == b.boxDepth
				&& boxLayer == b.boxLayer
				&& boxMaterial == b.boxMaterial
				&& boxTag == b.boxTag
				&& boxPrefab == b.boxPrefab
				&& (
					(
						!customBoxDimensions
						&& !b.customBoxDimensions
					) || (
						customBoxDimensions && b.customBoxDimensions && aRect == bRect
						&& (
							(
								aY == bY &&
								aRect.x == 0 && aRect.xMax == tileSize.x
							) || (
								aX == bX &&
								aRect.y == 0 && aRect.yMax == tileSize.y
							)
						)
					)
				);
	}
	
}

[System.Serializable]
public class UniTileProperty {
	public string key;
	public string value;
}