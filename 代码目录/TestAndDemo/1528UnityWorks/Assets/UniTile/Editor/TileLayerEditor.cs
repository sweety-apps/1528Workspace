// Copyright 2011 Sven Magnus

using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

[CustomEditor (typeof(TileLayer))]

public class TileLayerEditor : Editor {
	
	/// <summary>
	/// The currently selected template id
	/// </summary>
	public int selectedTemplate = -1;
	
	/// <summary>
	/// The location of the mouse, clamped to the grid of the current layer
	/// </summary>
	public static Vector3 gridMousePosition;
	
	/// <summary>
	/// The tiles currently selected that can be used for painting
	/// </summary>
	private UniTileTemplate selection = new UniTileTemplate();
	
	/// <summary>
	/// Are we currently drawing tiles? (if mouse is held down in draw mode)
	/// </summary>
	private bool drawing = false;
	
	/// <summary>
	/// Foldout value, are we showing the properties information in the inspector?
	/// </summary>
	private bool showProperties = true;
	
	private Vector2 prevPos;
	
	public static Vector2 pickStart;
	public static Vector2 pickEnd;
	public static bool picking;	

	TileLayerEditor_LayerProperties propertiesEditor = new TileLayerEditor_LayerProperties();
	TileLayerEditor_Tileset			tilesetEditor 	 = new TileLayerEditor_Tileset();
	TileLayerEditor_SceneView 		sceneViewEditor  = new TileLayerEditor_SceneView();
	private Vector2	startDrawingPos;
	private Vector2	lastDrawingPos;
	
	SerializedObject m_Object;
	SerializedProperty material;
	GameObject paintInstance;
	
	Vector2 scrollPos;
	
	public float prevZ;
	
	public void SelectTemplate(UniTileTemplate newSelection)
	{
		if(newSelection==null)
			return;
		newSelection.CopyTo(selection);
		selection.tilesPicked = true;
		UniTileMarker.Instance.Init(newSelection);
	}
	
	// we use editor code to store if the texture is readable
	// this is required because RedrawGroups is now built into the runtime assembly
	//
	// future work: this function SHOULD be called if the texture for this layer is reimported 
	// as there is a chance that the user could make the texture unreadable and update it without.
	// NOTE - this is very ulikely to cause problems for users. 
	private void CheckForReadableTexture(TileLayer layer)
	{
		if(layer == null || layer.material == null || layer.material.mainTexture == null) {
			layer.readableTexture = false;
			return;
		}
		
		Texture2D texture 			= (Texture2D)layer.material.mainTexture;
		TextureImporter importer 	= (TextureImporter)TextureImporter.GetAtPath(AssetDatabase.GetAssetPath(texture));
		layer.readableTexture 		= (importer.isReadable && (importer.textureFormat == TextureImporterFormat.ARGB32 
					                          	|| importer.textureFormat == TextureImporterFormat.RGBA32
					                          	|| importer.textureFormat == TextureImporterFormat.RGB24 
					                          	|| importer.textureFormat == TextureImporterFormat.AutomaticTruecolor
					                           	|| importer.textureFormat == TextureImporterFormat.Alpha8));
	}
	
	// check if we have been reparented under another layer, if so turn us into a child layer
	private void CheckForReparent(TileLayer layer)
	{
		TileLayer parent = null;
		
		if(layer.transform.parent != null) 
		{
			parent = layer.transform.parent.GetComponent<TileLayer>();
		}
		
		if(parent != null) 
		{
			if(parent != layer.parent) 
			{
				if(EditorUtility.DisplayDialog("Warning", "Parenting a layer to another layer will combine their tile groups. The selected layer may be resized. Are you sure?", "Ok", "Cancel")) 
				{
					layer.parent = parent;
					Vector2 prevLayerSize = layer.layerSize;
					layer.tileSize = parent.tileSize;
					if(parent.tileSpacing == new Vector2(-1,-1) || parent.tileSpacing == new Vector2(0,0)) 
					{
						parent.tileSpacing = parent.tileSize;
					}
					
					layer.tileSpacing = parent.tileSpacing;
					layer.tileUvSize = parent.tileUvSize;
					layer.overlap = parent.overlap;
					layer.overlapUv = parent.overlapUv;
					layer.groupSize = parent.groupSize;
					layer.layerSize = parent.layerSize;
					layer.borderSize = parent.borderSize;
					layer.borderSizeUv = parent.borderSizeUv;
					layer.material = parent.material;
					
					propertiesEditor.SetPropertiesFrom(layer);
					
					DestroyImmediate(layer.transform.FindChild("Groups").gameObject);
					RebuildMap(parent, prevLayerSize);
					
					
				} 
				else 
				{
					if(layer.parent != null) 
					{
						layer.transform.parent = layer.parent.transform;
					}
					else 
					{
						layer.transform.parent = null;
					}
				}
			}
			else if(!Application.isPlaying && layer.transform.position.z != prevZ) 
			{
				this.RebuildMap(layer.layerSize);
			}
		}
		else 
		{
			if(layer.parent != null) 
			{
				this.RebuildMap(layer.parent, layer.layerSize);
				layer.parent = null;
				this.RebuildMap(layer.layerSize);
			}
		}
		
		this.prevZ = layer.transform.position.z;
	}
	
	public override void OnInspectorGUI () 
	{
		Tools.current = Tool.View;
		TileLayer layer = target as TileLayer;
		
		CheckForReadableTexture(layer); 
		CheckForReparent(layer);
		
		if(layer.tileSpacing == new Vector2(0, 0) || layer.tileSpacing == new Vector2(-1,-1)) 
		{
			layer.tileSpacing = layer.tileSize;
		}
		
		CheckForReadableTexture(layer);		
		OnInspectorGUI_Properties(layer);
		tilesetEditor.OnInspectorGUI(layer, selection, this);
		
		if (GUI.changed) 
		{
            EditorUtility.SetDirty (target);
		}
    }

	private void OnInspectorGUI_Properties(TileLayer layer)
	{
		EditorGUILayout.BeginVertical();
		
		showProperties = EditorGUILayout.Foldout(showProperties, "Layer Properties");
		
		if(layer.material!=null && layer.tileset==null) 
		{
			this.GetTileset(layer);
		}
		
		if(showProperties) 
		{
			
			propertiesEditor.OnInspectorGUI(layer);
			
			if(layer.material!=null) 
			{
				GUILayout.BeginHorizontal();
				
				int length = 2 + layer.tileset.templates.Length;
		
				string[] templates = new string[length];
				templates[0]="Choose a template";
				for(int i=0;i<layer.tileset.templates.Length;i++) 
				{
					templates[i+1] = i.ToString() + " - " + layer.tileset.templates[i].name;
				}
				
				templates[length - 1]="Add current selection as a template";
				int newSelectedTemplate = EditorGUILayout.Popup("Template", Mathf.Min(selectedTemplate + 1,length-2), templates);
				selectedTemplate = newSelectedTemplate - 1;
				if(newSelectedTemplate == length - 1) 
				{
					UniTileTemplate[] newList = new UniTileTemplate[layer.tileset.templates.Length + 1];
					for(int i=0;i<layer.tileset.templates.Length;i++) 
					{
						newList[i]=layer.tileset.templates[i];
					}
					newList[newList.Length-1] = new UniTileTemplate();
					newList[newList.Length-1].Init(selection);
					layer.tileset.templates = newList;
				} 
				else if (newSelectedTemplate>0) 
				{
					 //layer.tileset.templates[selection - 1].Use();
					SelectTemplate(layer.tileset.templates[newSelectedTemplate - 1]);
				}
				
				if(selectedTemplate >= 0 && selectedTemplate < layer.tileset.templates.Length && layer.tileset.templates[selectedTemplate] != null)
				{
					layer.tileset.templates[selectedTemplate].name = EditorGUILayout.TextField(layer.tileset.templates[selectedTemplate].name);
					if(GUILayout.Button("Delete"))
					{
						List<UniTileTemplate> newList = new List<UniTileTemplate>();
						foreach(UniTileTemplate t in layer.tileset.templates)
						{
							if(t != layer.tileset.templates[selectedTemplate])
								newList.Add(t);
						}
						layer.tileset.templates = newList.ToArray();
					}					
				}
				GUILayout.EndHorizontal();
					
				UniTileMarker.Instance.Init(this.selection);
			}
				
			m_Object.Update();
			EditorGUILayout.PropertyField(material);
			if(layer.material != material.objectReferenceValue) 
			{
				layer.material = (Material)material.objectReferenceValue;
				m_Object.ApplyModifiedProperties();
				this.GetTileset(layer);
			}
		}
		
		EditorGUILayout.EndVertical();
		
		if(showProperties) 
		{
			int x = 5;
			GUILayout.BeginHorizontal();
			
			if(layer.parent == null) 
			{
				if (GUILayout.Button(new GUIContent("Rebuild map", "Apply changes to the size properties."), GUILayout.Width(80), GUILayout.Height(30))) {
					Undo.RegisterSceneUndo("Resize map");
					Vector2 prevLayerSize = layer.layerSize;
					propertiesEditor.SetPropertiesTo(layer);
					
					for(int i=0; i<layer.transform.childCount; i++) 
					{
						TileLayer child = layer.transform.GetChild(i).GetComponent<TileLayer>();
						if(child != null) 
						{
							propertiesEditor.SetPropertiesTo(child);
						}
					}
					
					this.RebuildMap(prevLayerSize);
					
					UniTileMarker.Instance.Init(selection);
				}
				
				x+=80;
				
				if (GUILayout.Button(new GUIContent("Revert", "Cancel changes to the size properties."), GUILayout.Width(50), GUILayout.Height(30))) {
					propertiesEditor.SetPropertiesFrom(layer);
				}
				
				x+=50;
			}
			
			if (GUILayout.Button(new GUIContent("Clear layer", "Erase all tile data from the layer."), GUILayout.Width(70), GUILayout.Height(30))) {
				Undo.RegisterSceneUndo("Clear layer");
				this.ClearMap();
			}
			
			
			x+=70;
			
			if (GUILayout.Button(new GUIContent("Create objects", "Instantiate tile prefabs and box colliders."), GUILayout.Width(90), GUILayout.Height(30))) {
				Undo.RegisterSceneUndo("Clear layer");
				TileLayerEditor.InstantiatePrefabs(layer);
			}
			
			
			x+=90;
			
			if(layer.parent == null && layer.material!= null && layer.material.mainTexture!=null) {
				if (GUILayout.Button(new GUIContent("Padder", "Add padding to textures."), GUILayout.Width(50), GUILayout.Height(30))) {
					PadderEditorWindow window = PadderEditorWindow.CreateInstance<PadderEditorWindow>();
					window.Setup((Texture2D)layer.material.mainTexture, layer.tileSize, layer.borderSize);
					window.ShowUtility();
				}
			}
			
			x+=50;
		
			if(selection.selectedTilesList.Length > 0 && layer.material!= null && layer.material.mainTexture!=null)
			{
				if (GUILayout.Button(new GUIContent("Edit Tiles", "Edit currently selected tiles."), GUILayout.Width(70), GUILayout.Height(30))) {
					TileEditorWindow window = TileEditorWindow.CreateInstance<TileEditorWindow>();
					window.Setup(this, selection.selectedTilesList);
					window.ShowUtility();
				}
			}
			
			GUILayout.EndHorizontal();
		}
	}

	

	void OnEnable() 
	{
		Tools.current = Tool.View;
		TileLayer layer = target as TileLayer;
		if(layer == null) return;
		
		UniTileManager manager = UniTileManager.Reset();
		manager.activeLayer = layer;
		manager.lastLayer = layer;
		
		// migrate templates from 1.1 to 1.2
		// this call does nothing if there are no 1.1 templates remaining
		manager.MigrateTemplates();
		manager.MigrateTiles();
	
		
		propertiesEditor.OnEnable(layer);
		
		m_Object = new SerializedObject (target);
		material = m_Object.FindProperty ("material");
		
		selection.Clear();

		UniTileMarker.Instance.Init(selection);
		
	}
	
	void OnDisable() 
	{
		UniTileManager.Reset();
		if(UniTileMarker.Instance!=null) 
		{
			DestroyImmediate(UniTileMarker.Instance.meshFilter.sharedMesh);
			DestroyImmediate(UniTileMarker.Instance.gameObject);
		}
		UniTileManager.instance.activeLayer = null;
		UniTileManager manager = UniTileManager.Reset();
		manager.MigrateTemplates();
		manager.MigrateTiles();
		tilesetEditor.OnDisable();
	}
	
	
	void OnSceneGUI() 
	{
		Tools.current = Tool.View;
		TileLayer layer = target as TileLayer;
		if(layer == null) 
			return;
		
		if(layer.transform.FindChild("Groups") == null) {
			RebuildMap(layer.layerSize);
		}
			
		TileLayerEditorAmmendum.OnSceneGUI_Ammendum(layer, selection, this);
		sceneViewEditor.OnSceneGUI(layer, selection, this);
		
		if(EditorWindow.mouseOverWindow) 
		{	
			
			Vector3 pos = GetCoordinates();
			gridMousePosition = new Vector3(Mathf.Floor(pos.x/layer.tileSpacing.x) * layer.tileSpacing.x, 
			                                            Mathf.Floor(pos.y/layer.tileSpacing.y) * layer.tileSpacing.y,
			                                            pos.z - 1);
			
			if(UniTileMarker.Instance)
				UniTileMarker.Instance.transform.localPosition = gridMousePosition;
			
			if(gridMousePosition.x < -layer.tileSpacing.x || gridMousePosition.y < -layer.tileSpacing.y || gridMousePosition.x > layer.layerSize.x * layer.tileSpacing.x + layer.tileSpacing.x || gridMousePosition.y > layer.layerSize.y * layer.tileSpacing.y + layer.tileSpacing.y || Event.current.command) return;
			
			HandleUtility.Repaint();
					
			if(Event.current.type==EventType.mouseDown && Event.current.button==0) 
			{
				prevPos=new Vector2(-1,-1);
				if(Event.current.alt) {
					OnSceneGUI_BeginPicking(layer);
				} else {
					this.MakeTextureReadable();
					OnSceneGUI_BeginDrawing(pos, layer);
				}
			}
			
			if(Event.current.type==EventType.mouseMove) 
			{
				if(this.drawing) 
					this.DrawDrag();
				
				if(picking) 
					this.Pick();
			}
			
			if(Event.current.type==EventType.dragPerform 
			   || Event.current.type==EventType.DragExited 
			   || Event.current.type==EventType.dragUpdated 
			   || Event.current.type==EventType.mouseDrag) 
			{
				if(this.drawing) 
				{
					this.DrawDrag();
					Event.current.Use();
				}
				
				if(picking) 
				{
					this.Pick();
					Event.current.Use();
				}
			}
			
			if(Event.current.type==EventType.mouseUp || Event.current.type==EventType.ignore) 
			{
				this.drawing = false;
				this.ResetTexture();
				if(picking) 
					OnSceneGUI_EndPicking(layer);
			}
			
			if(Event.current.type==EventType.scrollWheel && Event.current.modifiers.ToString()=="Alt") 
			{
				OnSceneGUI_CycleTiles(layer);
			}
		}
		
	}
	
	void OnSceneGUI_CycleTiles(TileLayer layer)
	{
		if(Event.current.delta.y < 0) 
		{
			selection.selectedTile.id--;
			if(selection.selectedTile.id<-1) selection.selectedTile.id = -1;
		}
		
		if(Event.current.delta.y > 0) 
		{
			selection.selectedTile.id++;
			int tilesX = (int)Mathf.Floor((float)layer.material.mainTexture.width / (layer.tileSize.x + layer.borderSize.x));
			int tilesY = (int)Mathf.Floor((float)layer.material.mainTexture.height / (layer.tileSize.y + layer.borderSize.y));
			if(selection.selectedTile.id>=tilesX*tilesY - 1) selection.selectedTile.id = tilesX*tilesY - 1;
		}
		
		selection.selectedTileEnd.id=selection.selectedTile.id;
		selection.tilesPicked = false;
		
		selection.selectedTilesList = new TileInstance[1];
		selection.selectedTilesList[0]=selection.selectedTile;
		UniTileMarker.Instance.Init(selection);
		
		HandleUtility.Repaint();
		this.Repaint();
		Event.current.Use();
	}

	void OnSceneGUI_EndPicking(TileLayer layer)
	{
		if(layer.tileData==null || layer.tileData.Length!=(int)layer.layerSize.x * (int)layer.layerSize.y) 
		{
			layer.tileData = new TileInstance[(int)layer.layerSize.x * (int)layer.layerSize.y];
			
			for(int i=0;i<layer.tileData.Length;i++) 
				layer.tileData[i] = new TileInstance(-1);
		}
		
		this.Pick();
		int xMin=(int)Mathf.Min(pickStart.x, pickEnd.x);
		int yMin=(int)Mathf.Min(pickStart.y, pickEnd.y);
		int xMax=(int)Mathf.Max(pickStart.x, pickEnd.x);
		int yMax=(int)Mathf.Max(pickStart.y, pickEnd.y);
		
		
		selection.selectedTilesList = new TileInstance[(xMax - xMin + 1) * (yMax - yMin + 1)];
		selection.selectedTilesWidth = (xMax - xMin + 1);
		for(int i=xMin;i<=xMax;i++) 
		{
			for(int j=yMin;j<=yMax;j++) 
			{
				int x = i-xMin;
				int y = (yMax - yMin) - (j-yMin);
				selection.selectedTilesList[x + y * selection.selectedTilesWidth] = layer.tileData[i+j*(int)layer.layerSize.x].Clone();
			}
		}
		
		// CUT if control is being held
		if(Event.current.control) 
		{
			Undo.RegisterSceneUndo("Cut tiles");
			for(int i=xMin;i<=xMax;i++) 
			{
				for(int j=yMin;j<=yMax;j++) 
					this.DrawTile(new TileInstance(-1), new Vector2(i, j));
			}
		}

		if(selection.selectedTilesList.Length==1) 
		{
			selection.selectedTile.id = selection.selectedTileEnd.id = selection.selectedTilesList[0].id;
			selection.tilesPicked = false;
		} 
		else 
		{
			selection.selectedTile.id = selection.selectedTileEnd.id = selection.selectedTilesList[0].id;
			selection.tilesPicked = true;
		}
		
		UniTileMarker.Instance.Init(selection);
		
		UniTileMarker.Instance.gameObject.active = true;
		picking = false;
	}

	void  OnSceneGUI_BeginDrawing(Vector3 pos, TileLayer layer)
	{
		this.drawing = true;
		Vector2 gridPos = new Vector2();
		gridPos.x = Mathf.Floor(pos.x / layer.tileSpacing.x);
		gridPos.y = Mathf.Floor(pos.y / layer.tileSpacing.y);						
		this.startDrawingPos = gridPos;
		this.lastDrawingPos = startDrawingPos;
		this.Draw(gridPos);
	}

	void  OnSceneGUI_BeginPicking(TileLayer layer)
	{
		UniTileMarker.Instance.gameObject.active = false;
		Vector3 coords = GetCoordinates();
		pickStart = new Vector2(coords.x, coords.y);
		pickStart.x = Mathf.Floor(coords.x / layer.tileSpacing.x);
		pickStart.y = Mathf.Floor(coords.y / layer.tileSpacing.y);
		
		
		if(pickStart.x>=layer.layerSize.x - 1) pickStart.x=layer.layerSize.x - 1;
		if(pickStart.y>=layer.layerSize.y - 1) pickStart.y=layer.layerSize.y - 1;
		if(pickStart.x<0) pickStart.x=0;
		if(pickStart.y<0) pickStart.y=0;
		
		picking = true;
		this.Pick();
	}

	
	private void Pick() {
		TileLayer layer = target as TileLayer;
		if(layer == null) return;
		
		selectedTemplate = - 1;
		
		Vector3 coords = GetCoordinates();
		pickEnd = new Vector2();
		pickEnd.x = Mathf.Floor(coords.x / layer.tileSpacing.x);
		pickEnd.y = Mathf.Floor(coords.y / layer.tileSpacing.y);
		if(pickEnd.x>=layer.layerSize.x - 1) pickEnd.x=layer.layerSize.x - 1;
		if(pickEnd.y>=layer.layerSize.y - 1) pickEnd.y=layer.layerSize.y - 1;
		if(pickEnd.x<0) pickEnd.x=0;
		if(pickEnd.y<0) pickEnd.y=0;
	}
	
	private Vector3 GetCoordinates() {
		Plane p = new Plane((this.target as MonoBehaviour).transform.TransformDirection(Vector3.forward), (this.target as MonoBehaviour).transform.position);
		Ray ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
		
        Vector3 hit = new Vector3();
        float dist;
		
		if (p.Raycast(ray, out dist))
        	hit = ray.origin + ray.direction.normalized * dist;
		
		return (this.target as MonoBehaviour).transform.InverseTransformPoint(hit);
	}
	
	private void DrawDrag() {
		TileLayer layer = target as TileLayer;
		if(layer == null) return;
		
		Vector3 pos = GetCoordinates();
		Vector2 gridPos = new Vector2();
		gridPos.x = Mathf.Floor(pos.x / layer.tileSpacing.x);
		gridPos.y = Mathf.Floor(pos.y / layer.tileSpacing.y);
		
		if(Event.current.shift)
		{
			if(Mathf.Abs(gridPos.x-startDrawingPos.x) > Mathf.Abs(gridPos.y-startDrawingPos.y))
				gridPos.y = startDrawingPos.y;
			else 
				gridPos.x = startDrawingPos.x;
		}
		
		if(selection.selectedTilesWidth <= Mathf.Abs(gridPos.x - lastDrawingPos.x)
		   || selection.selectedTilesList.Length/selection.selectedTilesWidth <= Mathf.Abs(gridPos.y - lastDrawingPos.y))
		{
			Draw(gridPos);
			lastDrawingPos = gridPos;
		}
	}
	
	private void Draw(Vector2 gridPos) 
	{
		TileLayer layer = target as TileLayer;
		if(layer == null) 
			return;
				
		if(gridPos!=prevPos) 
		{
			DrawTiles(gridPos);
		}
		
	}
		
	void DrawTiles(Vector2 gridPos)
	{
		Undo.RegisterSceneUndo("Draw tile");
		prevPos = gridPos;
		for(int i=0;i<selection.selectedTilesList.Length;i++) 
		{
			int x=i%selection.selectedTilesWidth;
			int y=(int)Mathf.Floor((float)i/(float)selection.selectedTilesWidth);
			this.DrawTile(Event.current.modifiers.ToString() == "Control"?new TileInstance(-1):selection.selectedTilesList[i], new Vector2(gridPos.x+x, gridPos.y-y));
		}
	}

	private void DrawTile(TileInstance tile, Vector2 pos) {
		TileLayer layer = target as TileLayer;
		if(layer == null) return;
		if(layer.material == null) return;
		
		if(pos.x<0 || pos.y<0 || pos.x>=layer.layerSize.x || pos.y>=layer.layerSize.y) return;
		
		if(layer.tileData==null || layer.tileData.Length!=(int)layer.layerSize.x * (int)layer.layerSize.y) {
			layer.tileData = new TileInstance[(int)layer.layerSize.x * (int)layer.layerSize.y];
			
			for(int i=0;i<layer.tileData.Length;i++) {
				layer.tileData[i] = new TileInstance(-1);
			}
		}

		layer.tileData[(int)pos.x + (int)pos.y * (int)layer.layerSize.x] = new TileInstance(tile.id, tile.rotation, tile.flippedHorizontally, tile.flippedVertically);
		
		int groupX = (int)Mathf.Floor((float)pos.x/(float)layer.groupSize.x);
		int groupY = (int)Mathf.Floor((float)pos.y/(float)layer.groupSize.y);
		
		TileLayerUtil.RedrawGroup(layer, groupX, groupY);
	}
	
	private bool textureChanged = false;
	private TextureImporterFormat textureFormat;
	private bool isReadable;
	
	private void MakeTextureReadable() {
		
		if(textureChanged) return;
		
		TileLayer layer = target as TileLayer;
		
		CheckForReadableTexture(layer);
		
		if(!layer.readableTexture) {
			Texture2D texture 			= (Texture2D)layer.material.mainTexture;
			TextureImporter importer 	= (TextureImporter)TextureImporter.GetAtPath(AssetDatabase.GetAssetPath(texture));
		
			
			if(
					importer.textureFormat == TextureImporterFormat.ARGB16 ||
					importer.textureFormat == TextureImporterFormat.ARGB32 ||
	              	importer.textureFormat == TextureImporterFormat.RGBA32 ||
	              	importer.textureFormat == TextureImporterFormat.RGB24 ||
	              	importer.textureFormat == TextureImporterFormat.AutomaticTruecolor ||
	               	importer.textureFormat == TextureImporterFormat.Alpha8
			) {
				isReadable = importer.isReadable;
				textureFormat = importer.textureFormat;
				
				
				importer.isReadable = true;
				if(importer.textureFormat == TextureImporterFormat.RGB16 || importer.textureFormat == TextureImporterFormat.ARGB16) {
					importer.textureFormat = TextureImporterFormat.ARGB32;
				}
				AssetDatabase.ImportAsset(AssetDatabase.GetAssetPath(texture), ImportAssetOptions.ForceUpdate);
				textureChanged = true;
				layer.readableTexture = true;
			}
		}
		
	}
	
	private void ResetTexture() {
		if(textureChanged) {
			
			TileLayer layer = target as TileLayer;
			
			Texture2D texture 			= (Texture2D)layer.material.mainTexture;
			TextureImporter importer 	= (TextureImporter)TextureImporter.GetAtPath(AssetDatabase.GetAssetPath(texture));
			
			textureChanged = false;
			
			importer.isReadable = isReadable;
			importer.textureFormat = textureFormat;
			
			AssetDatabase.ImportAsset(AssetDatabase.GetAssetPath(texture), ImportAssetOptions.ForceUpdate);
			CheckForReadableTexture(layer);
		}
	}
	
	private void ClearMap() {
		TileLayer layer = target as TileLayer;
		if(layer == null) return;
		layer.tileData=null;
		this.ClearGroups(layer);
		if(layer.parent != null) RebuildMap(layer.parent, layer.parent.layerSize);
	}
	
	public void RebuildMap(Vector2 prevLayerSize) {
		RebuildMap(target as TileLayer, prevLayerSize);
	}
	
	public void RebuildMap(TileLayer layer, Vector2 prevLayerSize) {
		if(layer == null) return;
		
		for(int i=0; i<layer.transform.childCount; i++) 
		{
			TileLayer child = layer.transform.GetChild(i).GetComponent<TileLayer>();
			if(child != null && child.material!=null && child.tileset==null) {
				this.GetTileset(child);
			}
		}
		
		this.ClearGroups(layer);
		
		TileInstance [] newTiles = new TileInstance[(int)layer.layerSize.x * (int)layer.layerSize.y];
		
		for(int i=0;i<layer.layerSize.x;i++) {
			for(int j=0;j<layer.layerSize.y;j++) {
				newTiles[i+j*(int)layer.layerSize.x]=new TileInstance(-1);
				
				int prevIndex = i+j*(int)prevLayerSize.x;
				
				if(layer.tileData!=null && layer.tileData.Length>0) {
					if(i<prevLayerSize.x) {
						if(j<prevLayerSize.y) {
							newTiles[i+j*(int)layer.layerSize.x]=layer.tileData[prevIndex];
						}
					}
				}
			}
		}
		layer.tileData=newTiles;
		
		this.MakeTextureReadable();
		for(int i=0;i<=Mathf.Floor(layer.layerSize.x/layer.groupSize.x);i++) {
			for(int j=0;j<=Mathf.Floor(layer.layerSize.y/layer.groupSize.y);j++) {
				TileLayerUtil.RedrawGroup(layer, i,j);
			}
		}
		this.ResetTexture();
		
	}
	
	private void ClearGroups(TileLayer layer) {
		if(layer == null) return;
		for(int i=0;i<layer.transform.childCount;i++) {
			Transform t = layer.transform.GetChild(i);
			if(t.gameObject.name.Substring(0,6)=="group_") {
				MeshFilter f = t.gameObject.GetComponent<MeshFilter>();
				if(f!=null && f.sharedMesh!=null) DestroyImmediate(f.sharedMesh);
				DestroyImmediate(t.gameObject);
				i--;
			}
		}
		for(int i=0;i<layer.GroupRoot.childCount;i++) {
			
			TileLayer child = layer.GroupRoot.GetChild(i).GetComponent<TileLayer>();
			if(child != null) {
				ClearGroups(child);
			}
			
			Transform t = layer.GroupRoot.GetChild(i);
			if(t.gameObject.name.Substring(0,6)=="group_") {
				MeshFilter f = t.gameObject.GetComponent<MeshFilter>();
				if(f!=null && f.sharedMesh!=null) DestroyImmediate(f.sharedMesh);
				DestroyImmediate(t.gameObject);
				i--;
			}
			
		}
	}
	
	private void GetTileset(TileLayer layer) {
		Material mat = layer.material;
		if(mat == null) {
			layer.tileset = null;
			return;
		}
		string matPath = AssetDatabase.GetAssetPath(mat);
		
		if(matPath.Length<=4)
		{
			layer.tileset = null;
			return;
		}
		
		string tsPath = matPath.Substring(0, matPath.Length-4) + ".Tileset.prefab";
		layer.tileset = (UniTileTileset)AssetDatabase.LoadAssetAtPath(tsPath, typeof(UniTileTileset));
		if(layer.tileset == null) {
#if (UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9)
			Object prefab = PrefabUtility.CreateEmptyPrefab(tsPath);
#else
			Object prefab = EditorUtility.CreateEmptyPrefab(tsPath);
#endif
			GameObject goTemp = new GameObject();
#if (UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9)
			GameObject go = PrefabUtility.ReplacePrefab(goTemp, prefab);
#else
			GameObject go = EditorUtility.ReplacePrefab(goTemp, prefab);
#endif
			DestroyImmediate(goTemp);
			layer.tileset = go.AddComponent<UniTileTileset>();
		}
	}
	
	public static void InstantiatePrefabs(TileLayer layer) {
		if(layer.tileset == null) return;
		if(layer.tileset.tiles == null) return;
		
		Transform t = layer.transform.FindChild("TileInstances");
		if(t!=null) {
			DestroyImmediate(t.gameObject);
		}
		t = layer.transform.FindChild("BoxColliders");
		if(t!=null) {
			DestroyImmediate(t.gameObject);
		}
		
		GameObject instances = new GameObject("TileInstances");
		Transform instancesTransform = instances.transform;
		instancesTransform.parent = layer.transform;
		instancesTransform.localPosition = new Vector3(0, 0, 0);
		instancesTransform.localScale = new Vector3(1, 1, 1);
		instancesTransform.localRotation = new Quaternion(0,0,0,0);
		
		GameObject boxes = new GameObject("BoxColliders");
		Transform boxesTransform = boxes.transform;
		boxesTransform.parent = layer.transform;
		boxesTransform.localPosition = new Vector3(0, 0, 0);
		boxesTransform.localScale = new Vector3(1, 1, 1);
		boxesTransform.localRotation = new Quaternion(0,0,0,0);
		
		GameObject prefab;
		GameObject instance;
		GameObject box;
		BoxCollider collider;
		Hashtable skip = new Hashtable();

		if(layer.tileSpacing == new Vector2(-1,-1) || layer.tileSpacing == new Vector2(0,0)) layer.tileSpacing = layer.tileSize;

		for(int i = 0; i < layer.layerSize.x; i++) {
			for(int j = 0; j < layer.layerSize.y; j++) {
				UniTileTile tile = layer.GetTile(i, j);
				if(tile!=null) {
					TileInstance inst = layer.GetTileData(i, j);
					prefab = tile.prefab;
					if(prefab != null) {
#if (UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9)
						instance = (GameObject)PrefabUtility.InstantiatePrefab(prefab);
#else
						instance = (GameObject)EditorUtility.InstantiatePrefab(prefab);
#endif
						Vector3 scale = instance.transform.localScale;
						instance.transform.parent = instancesTransform;
						instance.transform.localScale = scale;
						Quaternion q = new Quaternion(0,0,0,0);
						q.eulerAngles = new Vector3(0, 0, (int)inst.rotation * 90);
						instance.transform.localRotation = q;
						instance.transform.localPosition = (Vector3)TileLayerUtil.TransformPoint(new Vector2(i * layer.tileSpacing.x + tile.prefabOffset.x, j * layer.tileSpacing.y + tile.prefabOffset.y), new Vector2(i * layer.tileSpacing.x + layer.tileSpacing.x / 2f, j * layer.tileSpacing.y +  + layer.tileSpacing.y / 2f), inst.flippedHorizontally, inst.flippedVertically, inst.rotation);
						if(inst.flippedHorizontally) {
							instance.transform.localScale = new Vector3(-instance.transform.localScale.x, instance.transform.localScale.y, instance.transform.localScale.z);
						}
						if(inst.flippedVertically) {
							instance.transform.localScale = new Vector3(instance.transform.localScale.x, -instance.transform.localScale.y, instance.transform.localScale.z);
						}
					}
					if(layer.collidable && tile.boxCollider) {
						if(skip[new Vector2(i, j)] == null) {
							if(tile.boxPrefab!=null)
#if (UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9)
								box = (GameObject)PrefabUtility.InstantiatePrefab(tile.boxPrefab);
#else
								box = (GameObject)EditorUtility.InstantiatePrefab(tile.boxPrefab);
#endif
							else 
								box = new GameObject("BoxCollider");
							
							box.layer = tile.boxLayer;
							box.tag = tile.boxTag;	
							collider = box.GetComponent<BoxCollider>();
							if(!collider) collider = box.AddComponent<BoxCollider>();
							collider.material = tile.boxMaterial;
							box.transform.parent = boxesTransform;
							box.transform.localScale = new Vector3(1, 1, 1);
							box.transform.localRotation = new Quaternion(0,0,0,0);
							box.transform.localPosition = new Vector3(i * layer.tileSpacing.x, j * layer.tileSpacing.y, 0);
							
							int sizeX = 1;
							int sizeY = 1;
							while(skip[new Vector2(i, j + sizeY)]==null && layer.CanMergeBoxColliders(i, j, i, j+sizeY)) {
								skip[new Vector2(i, j + sizeY)] = true;
								sizeY++;
							}
							
							if(sizeY == 1) {
								while(skip[new Vector2(i + sizeX, j)]==null && layer.CanMergeBoxColliders(i, j, i+sizeX, j)) {
									skip[new Vector2(i + sizeX, j)] = true;
									sizeX++;
								}
							} else {
								sizeX = 1;
								bool columnOk = true;
								int column = 1;
								while(columnOk) {
									columnOk = true;
									for(int k=0;k<sizeY;k++) {
										if(skip[new Vector2(i + column, j + k)]!=null || !layer.CanMergeBoxColliders(i,j,i+column, j+k)) {
											columnOk = false;
											break;
										}
									}
									if(columnOk) {
										column++;
									}
								}
								sizeX = column;
								for(int k=0;k<sizeX;k++) {
									for(int l=0;l<sizeY;l++) {
										skip[new Vector2(i + k, j + l)] = true;
									}
								}
							}
							
							if(tile.customBoxDimensions) {
								Rect rect = TileLayerUtil.TransformRect(tile.boxDimensions, layer.tileSize / 2f, inst.flippedHorizontally, inst.flippedVertically, inst.rotation);
								float x = rect.width;
								float y = rect.height;
								if(rect.x == 0 && rect.xMax == layer.tileSpacing.x) {
									x = layer.tileSpacing.x * sizeX;
								}
								if(rect.y == 0 && rect.yMax == layer.tileSpacing.y) {
									y = layer.tileSpacing.y * sizeY;
								}
								collider.size = new Vector3(x, y, tile.boxDepth);
								collider.center = new Vector3(collider.size.x / 2f + rect.x, collider.size.y / 2f + rect.y);
							} else {
								collider.size = new Vector3(layer.tileSpacing.x * sizeX, layer.tileSpacing.y * sizeY, tile.boxDepth);
								collider.center = new Vector3(collider.size.x / 2f, collider.size.y / 2f);
								//collider.center = new Vector3(layer.tileSpacing.x * sizeX / 2f, layer.tileSpacing.y * sizeY / 2f);
							}
							
						}
					}
				}
			}
		}
	}
}
