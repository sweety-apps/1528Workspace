using UnityEngine;
using System.Collections;
#if UNITY_EDITOR
using UnityEditor;
#endif

public class ObjectLayer : MonoBehaviour {
	
	[HideInInspector] public Vector2 gridSize = new Vector2(32, 32);
	[HideInInspector] public Vector2 gridOffset = new Vector2(0, 0);
	[HideInInspector] public Vector2 layerSize = new Vector2(100, 50);
	
	[HideInInspector] public Transform selected;
	[HideInInspector] public bool snapToGrid = true;
	
	public GameObject [] prefabs;
	
	
	public Bounds FindBounds(Transform t) {
		if(t.renderer!=null) return t.renderer.bounds;
		if(t.collider!=null) return t.collider.bounds;
		return new Bounds(t.position, new Vector3(gridSize.x, gridSize.y, 10));
	}
	
	
	
#if UNITY_EDITOR
	void OnDrawGizmos() {
		if(UniTileManager.instance.activeObjectLayer == this) {
			Gizmos.color = new Color (1f,1f,1f,1f);
			
			if(this != null) {
				Transform trans = this.transform;
				Gizmos.DrawLine(trans.TransformPoint(new Vector3(0,0,0)), trans.TransformPoint(new Vector3(this.gridSize.x * this.layerSize.x, 0, 0)));
				Gizmos.DrawLine(trans.TransformPoint(new Vector3(0,0,0)), trans.TransformPoint(new Vector3(0, this.gridSize.y * this.layerSize.y, 0)));
				Gizmos.DrawLine(trans.TransformPoint(new Vector3(0, this.gridSize.y * this.layerSize.y, 0)), trans.TransformPoint(new Vector3(this.gridSize.x * this.layerSize.x, this.gridSize.y * this.layerSize.y, 0)));
				Gizmos.DrawLine(trans.TransformPoint(new Vector3(this.gridSize.x * this.layerSize.x, this.gridSize.y * this.layerSize.y,0)), trans.TransformPoint(new Vector3(this.gridSize.x * this.layerSize.x, 0, 0)));
				Gizmos.color = new Color (1f,1f,1f,0.05f);
				for(int i=0;i<=this.layerSize.y;i++) {
					Gizmos.DrawLine(trans.TransformPoint(new Vector3(0, (float)i * this.gridSize.y, 0)), trans.TransformPoint(new Vector3(this.gridSize.x * this.layerSize.x, (float)i * this.gridSize.y, 0)));
				}
				for(int i=0;i<=this.layerSize.x;i++) {
					Gizmos.DrawLine(trans.TransformPoint(new Vector3((float)i * this.gridSize.x, 0, 0)), trans.TransformPoint(new Vector3((float)i * this.gridSize.x, this.gridSize.y * this.layerSize.y, 0)));
				}
				Gizmos.color = new Color (1f,1f,1f,1f);
			}
			
			Transform t;
			for(int i = 0; i<this.transform.childCount; i++) {
				t = this.transform.GetChild(i);
				Bounds b = FindBounds(t);
				Gizmos.color = new Color (1f,0,0,1f);
				Gizmos.DrawWireCube(b.center, b.size);
				Gizmos.color = new Color (1f,0f,0f,selected == t?0.5f:0.1f);
				Gizmos.DrawCube(b.center, b.size);
			}
			
		}
	}
#endif
}
