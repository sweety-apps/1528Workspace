using UnityEngine;
using UnityEditor;
using System.Collections;

public class TileEditorWindow : EditorWindow {
	
	public TileLayerEditor editor;
	public TileLayer layer;
	public TileInstance[] selectedTiles;
	public GameObject prefab;
	public Vector2 prefabOffset;
	public new string name;
	public float value;
	public bool boxCollider;
	public int boxLayer;
	public string boxTag;
	public float boxDepth;
	public bool customBoxDimensions;
	public Rect boxDimensions;
	public PhysicMaterial boxMaterial;
	public bool resizable;
	public int propertiesLength;
	public GameObject boxPrefab;
	public UniTileProperty[] properties;
	
	public Vector2 scroll;
	
	void OnGUI () {
		if(editor == null) return;
		
		this.title = string.Format("Tile Editor Window ({0} tiles selected)", selectedTiles.Length);
		this.scroll = EditorGUILayout.BeginScrollView(scroll);
		
		EditorGUILayout.BeginVertical();
			this.name = EditorGUILayout.TextField("Name",this.name);
			this.value = EditorGUILayout.FloatField("Value", this.value);
		
			EditorGUILayout.BeginHorizontal();
				EditorGUILayout.PrefixLabel("Prefab");
#if (UNITY_3_4 || UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9) 
				this.prefab = (GameObject)EditorGUILayout.ObjectField(this.prefab, typeof(GameObject), true);
#else 
				this.prefab = (GameObject)EditorGUILayout.ObjectField(this.prefab, typeof(GameObject));
#endif 
			EditorGUILayout.EndHorizontal();
		
			if(this.prefab!=null) {
				this.prefabOffset = EditorGUILayout.Vector2Field("Prefab offset", this.prefabOffset);
			} else {
				 this.prefabOffset = new Vector2(this.layer.tileSpacing.x / 2f, this.layer.tileSpacing.y / 2f);
			}
		
			this.boxCollider = EditorGUILayout.Toggle("Box collider", this.boxCollider);
			if(this.boxCollider) {
				this.boxLayer = EditorGUILayout.LayerField("- Box layer", this.boxLayer);
				this.boxTag = EditorGUILayout.TagField("- Box tag", this.boxTag);
				this.boxDepth = EditorGUILayout.FloatField("- Box depth", this.boxDepth);
				this.customBoxDimensions = EditorGUILayout.Toggle("- Custom size", this.customBoxDimensions);
				if(customBoxDimensions) {
					this.boxDimensions = EditorGUILayout.RectField("      - Size rect :", this.boxDimensions);
				} else {
					this.boxDimensions = new Rect(0, 0, this.layer.tileSpacing.x, this.layer.tileSpacing.y);
				}
#if (UNITY_3_4 || UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9) 
				this.boxMaterial = (PhysicMaterial)EditorGUILayout.ObjectField("- Physics material", this.boxMaterial, typeof(PhysicMaterial), true);				
				this.boxPrefab = (GameObject)EditorGUILayout.ObjectField("- Box Prefab", this.boxPrefab, typeof(GameObject), true);				
#else
				this.boxMaterial = (PhysicMaterial)EditorGUILayout.ObjectField("- Physics material", this.boxMaterial, typeof(PhysicMaterial));
				this.boxPrefab = (GameObject)EditorGUILayout.ObjectField("- Box Prefab", this.boxPrefab, typeof(GameObject), true);				
#endif
			}
			
			this.resizable = EditorGUILayout.Toggle("Resizable", this.resizable);
		
			propertiesLength = EditorGUILayout.IntField("Properties", propertiesLength);
		
			if(propertiesLength>this.properties.Length) {
				UniTileProperty [] temp=this.properties;
				this.properties=new UniTileProperty[propertiesLength];
				for(int i=0;i<this.properties.Length;i++) {
					if(i>=temp.Length) {
						this.properties[i]=new UniTileProperty();
						this.properties[i].key=this.properties[i].value="";
					} else {
						this.properties[i]=temp[i];
					}
				}
			}
			for(int i=0;i<propertiesLength;i++) {
				EditorGUILayout.BeginHorizontal();
					this.properties[i].key = EditorGUILayout.TextField(this.properties[i].key);
					this.properties[i].value = EditorGUILayout.TextField(this.properties[i].value);
				EditorGUILayout.EndHorizontal();
			}
		
		EditorGUILayout.EndVertical();
		
		if(GUILayout.Button("Save")) {
			this.Save();
			this.Close();
		}
		
		EditorGUILayout.EndScrollView();
	}
	
	public void Setup(TileLayerEditor editor, TileInstance[] selectedTiles) {
		if(selectedTiles.Length == 0)
		{
			Debug.LogError("No tiles selected! Only use TileEditorWindow if tiles have been selected");
			this.Close();
			return;
		}
		int selectedTile = selectedTiles[0].id;
		
		this.editor = editor;
		this.selectedTiles = selectedTiles;
		this.layer = editor.target as TileLayer;
		this.boxDepth = 64;
		this.boxTag = "Untagged";
		
		if(layer.tileset!=null) {
			this.ResizeArray();
			UniTileTile tile = layer.tileset.tiles[selectedTile];
			if(tile!=null) {
				this.prefab = tile.prefab;
				this.name = tile.name;
				this.value = tile.value;
				this.boxCollider = tile.boxCollider;
				this.resizable = tile.resizable;
				this.boxLayer = tile.boxLayer;
				this.boxMaterial = tile.boxMaterial;
				this.boxTag = tile.boxTag;
				this.boxDepth = tile.boxDepth;
				this.boxPrefab = tile.boxPrefab;
				this.prefabOffset = tile.prefabOffset;
				if(this.prefab == null) this.prefabOffset = new Vector2(this.layer.tileSpacing.x / 2f, this.layer.tileSpacing.y / 2f);
				
				this.customBoxDimensions = tile.customBoxDimensions;
				if(!this.customBoxDimensions) this.boxDimensions = new Rect(0, 0, this.layer.tileSpacing.x, this.layer.tileSpacing.y);
				else this.boxDimensions = tile.boxDimensions;
				if(tile.properties!=null) {
					this.properties = new UniTileProperty[tile.properties.Length];
					for(int i=0; i<this.properties.Length;i++) {
						this.properties[i] = new UniTileProperty();
						this.properties[i].key = tile.properties[i].key;
						this.properties[i].value = tile.properties[i].value;
					}
				} else {
					this.properties = new UniTileProperty[0];
				}
			}
		}
		if(this.properties == null) this.properties = new UniTileProperty[0];
		this.propertiesLength = this.properties.Length;
		if(this.name == null) this.name = "";
	}
	
	public void Save() {
		GameObject g = null;
		
		UniTileTileset tileset;
		g = (GameObject)Instantiate(layer.tileset.gameObject);
		tileset = g.GetComponent<UniTileTileset>();
		
		this.ResizeArray();
		
		foreach(TileInstance selectedTile in this.selectedTiles)
		{
			if(tileset.tiles[selectedTile.id] == null) {
				tileset.tiles[selectedTile.id] = new UniTileTile();
			}

			UniTileTile tile = tileset.tiles[selectedTile.id];
			tile.properties = new UniTileProperty[propertiesLength];
			for(int i=0; i<this.propertiesLength; i++) {
				tile.properties[i] = new UniTileProperty();
				tile.properties[i].key=this.properties[i].key;
				tile.properties[i].value=this.properties[i].value;
			}
			tile.prefab = this.prefab;
			tile.name = this.name;
			tile.value = this.value;
			tile.boxCollider = this.boxCollider;
			tile.resizable = this.resizable;
			tile.boxLayer = this.boxLayer;
			tile.boxMaterial = this.boxMaterial;
			tile.boxTag = this.boxTag;
			tile.boxDepth = this.boxDepth;
			tile.boxPrefab = this.boxPrefab;
			tile.prefabOffset = this.prefabOffset;
			tile.customBoxDimensions = this.customBoxDimensions;
			tile.boxDimensions = this.boxDimensions;
		}
#if (UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9)
		PrefabUtility.ReplacePrefab(g, layer.tileset.gameObject);
#else
		EditorUtility.ReplacePrefab(g, layer.tileset.gameObject);
#endif
		
		DestroyImmediate(g);
	}
	
	public void ResizeArray() {
		int tilesX = layer.TilesetWidth;
		int tilesY = layer.TilesetHeight;
		if(layer.tileset.tiles != null && layer.tileset.tiles.Length == tilesX * tilesY) return;
		UniTileTile [] prev = layer.tileset.tiles;
		layer.tileset.tiles = new UniTileTile[tilesX * tilesY];
		if(prev!=null) {
			for(int i=0; i<Mathf.Min(prev.Length, layer.tileset.tiles.Length); i++) {
				layer.tileset.tiles[i] = prev[i];
			}
		}
	}

}
