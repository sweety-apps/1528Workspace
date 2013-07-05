using UnityEditor;
using UnityEngine;

public class TileLayerEditor_SceneView
{
	private static bool justSwitchedLayers = false;
	
	public void OnSceneGUI(TileLayer layer, UniTileTemplate selection, TileLayerEditor editor)
	{		
		DrawGrid(layer, selection.selectedTilesList, selection.selectedTilesWidth);
		
		MouseInfo(selection);
		
		GUI.Box(new Rect (10, 10, 170, 60), "");
		GUILayout.BeginArea(new Rect (20, 20, 150, 40));
		LayerSelect(layer);
		GUILayout.EndArea();

		if(justSwitchedLayers)
			return;
	
		Handles.BeginGUI();

		GUI.Box(new Rect (Screen.width - 160, Screen.height - 90, 160, 70), "");
		GUILayout.BeginArea(new Rect (Screen.width - 150, Screen.height - 80, 140, 50));
		CreateObjectButton(layer);
		TemplatePopup(layer,editor);
		GUILayout.EndArea();
		
		
		if(Event.current.keyCode == KeyCode.H && Event.current.type == EventType.KeyUp) {
			for(int i = 0; i < selection.selectedTilesList.Length; i++) {
				if(selection.selectedTilesList[i] != null) {
					selection.selectedTilesList[i].flippedHorizontally = !selection.selectedTilesList[i].flippedHorizontally;
				}
			}
			TileInstance [] temp = new TileInstance[selection.selectedTilesList.Length];
			for(int i = 0; i < selection.selectedTilesWidth; i++) {
				for(int j = 0; j < selection.selectedTilesHeight; j++) {
					int x1 = i;
					int x2 = selection.selectedTilesWidth - x1 - 1;
					int index1 = x1 + j * selection.selectedTilesWidth;
					int index2 = x2 + j * selection.selectedTilesWidth;
					temp[index2] = selection.selectedTilesList[index1];
				}
			}
			selection.selectedTilesList = temp;
					
			UniTileMarker.Instance.Init(selection);
			editor.selectedTemplate = -1;
		}
		
		if(Event.current.keyCode == KeyCode.V && Event.current.type == EventType.KeyUp) {
			for(int i = 0; i < selection.selectedTilesList.Length; i++) {
				if(selection.selectedTilesList[i] != null) {
					selection.selectedTilesList[i].flippedVertically = !selection.selectedTilesList[i].flippedVertically;
				}
			}
			
			TileInstance [] temp = new TileInstance[selection.selectedTilesList.Length];
			for(int i = 0; i < selection.selectedTilesWidth; i++) {
				for(int j = 0; j < selection.selectedTilesHeight; j++) {
					int y1 = j;
					int y2 = selection.selectedTilesHeight - y1 - 1;
					int index1 = i + y1 * selection.selectedTilesWidth;
					int index2 = i + y2 * selection.selectedTilesWidth;
					temp[index2] = selection.selectedTilesList[index1];
				}
			}
			selection.selectedTilesList = temp;
			
			UniTileMarker.Instance.Init(selection);
			editor.selectedTemplate = -1;
		}
		
		if(Event.current.keyCode == KeyCode.T && Event.current.type == EventType.KeyUp) {
			for(int i = 0; i < selection.selectedTilesList.Length; i++) {
				if(selection.selectedTilesList[i] != null) {
					selection.selectedTilesList[i].rotation++;
					if((uint)selection.selectedTilesList[i].rotation > 3) selection.selectedTilesList[i].rotation = TileInstance.Rotation.r0;
				}
			}
			
			
			TileInstance [] temp = new TileInstance[selection.selectedTilesList.Length];
			int newWidth = selection.selectedTilesHeight;
			
			for(int i = 0; i < selection.selectedTilesWidth; i++) {
				for(int j = 0; j < selection.selectedTilesHeight; j++) {
					int x1 = i;
					int y1 = j;
					int index1 = x1 + y1 * selection.selectedTilesWidth;
					
					int x2 = selection.selectedTilesHeight - y1 - 1;
					int y2 = x1;
					int index2 = x2 + y2 * newWidth;
					
					temp[index2] = selection.selectedTilesList[index1];
				}
			}
			
			selection.selectedTilesList = temp;
			selection.selectedTilesWidth = newWidth;
			
			UniTileMarker.Instance.Init(selection);
			editor.selectedTemplate = -1;
		}
		
		Handles.EndGUI();
	}
	
	private static void MouseInfo(UniTileTemplate selection)
	{
		Handles.BeginGUI();
		GUI.Box(new Rect (0, Screen.height - 218, 90, 198), "");
		GUILayout.BeginArea(new Rect(5, Screen.height-208, 75,188));
		GUILayout.Label(string.Format("{0}, {1}", (int)TileLayerEditor.gridMousePosition.x, (int)TileLayerEditor.gridMousePosition.y), "button", GUILayout.ExpandWidth(true));
		
		GUILayout.Label(string.Format("{0} x {1}", selection.selectedTilesWidth, selection.selectedTilesList.Length/selection.selectedTilesWidth), "button", GUILayout.ExpandWidth(true));	
		
		GUILayout.Toggle(Event.current.alt, "alt: pick", "button", GUILayout.ExpandWidth(true));		
		GUILayout.Toggle(Event.current.control, Event.current.alt ? "ctrl: cut":"ctrl: erase", "button", GUILayout.ExpandWidth(true));		
		GUILayout.Toggle(Event.current.shift, "shift: axis", "button", GUILayout.ExpandWidth(true));
		GUILayout.Toggle(false, "t: turn tile", "button", GUILayout.ExpandWidth(true));
		GUILayout.Toggle(false, "h: flip hor.", "button", GUILayout.ExpandWidth(true));
		GUILayout.Toggle(false, "v: flip vert.", "button", GUILayout.ExpandWidth(true));
		
		GUILayout.EndArea();
	}
	
	private static void DrawGrid(TileLayer layer, TileInstance[] selectedTiles, int selectedTilesWidth)
	{
		Handles.color = new Color (1f,1f,1f,1f);
		
		if(layer != null) {
			
			if(layer.tileSpacing == new Vector2(-1, -1)) layer.tileSpacing = layer.tileSize;
			
			Transform trans = layer.transform;
			
			Handles.DrawLine(trans.TransformPoint(new Vector3(0,0,0)), trans.TransformPoint(new Vector3(layer.tileSpacing.x * layer.layerSize.x, 0, 0)));
			Handles.DrawLine(trans.TransformPoint(new Vector3(0,0,0)), trans.TransformPoint(new Vector3(0, layer.tileSpacing.y * layer.layerSize.y, 0)));
			Handles.DrawLine(trans.TransformPoint(new Vector3(0, layer.tileSpacing.y * layer.layerSize.y, 0)), trans.TransformPoint(new Vector3(layer.tileSpacing.x * layer.layerSize.x, layer.tileSpacing.y * layer.layerSize.y, 0)));
			Handles.DrawLine(trans.TransformPoint(new Vector3(layer.tileSpacing.x * layer.layerSize.x, layer.tileSpacing.y * layer.layerSize.y,0)), trans.TransformPoint(new Vector3(layer.tileSpacing.x * layer.layerSize.x, 0, 0)));
			
			if(TileLayerEditor.picking) {
				Handles.color = new Color (1f,1f,0.5f,1f);
				Vector3 start = new Vector3(Mathf.Min(TileLayerEditor.pickStart.x, TileLayerEditor.pickEnd.x) * layer.tileSpacing.x, Mathf.Min(TileLayerEditor.pickStart.y, TileLayerEditor.pickEnd.y) * layer.tileSpacing.y, 0);
				Vector3 end = new Vector3(Mathf.Max(TileLayerEditor.pickStart.x, TileLayerEditor.pickEnd.x) * layer.tileSpacing.x + layer.tileSpacing.x, Mathf.Max(TileLayerEditor.pickStart.y, TileLayerEditor.pickEnd.y) * layer.tileSpacing.y + layer.tileSpacing.y, 0);
				Handles.DrawLine(trans.TransformPoint(new Vector3(start.x, start.y,0)), trans.TransformPoint(new Vector3(start.x, end.y)));
				Handles.DrawLine(trans.TransformPoint(new Vector3(start.x, start.y,0)), trans.TransformPoint(new Vector3(end.x, start.y)));
				Handles.DrawLine(trans.TransformPoint(new Vector3(start.x, end.y,0)), trans.TransformPoint(new Vector3(end.x, end.y)));
				Handles.DrawLine(trans.TransformPoint(new Vector3(end.x, start.y,0)), trans.TransformPoint(new Vector3(end.x, end.y)));
			} else if(selectedTilesWidth > 0) {
				Handles.color = new Color (1f,1f,1f,1f);
				Vector3 start = TileLayerEditor.gridMousePosition + new Vector3(0, layer.tileSpacing.y, 0);
				Vector3 end = start + new Vector3(selectedTilesWidth * layer.tileSpacing.x, -selectedTiles.Length / selectedTilesWidth * layer.tileSpacing.y, 0);
				Handles.DrawLine(trans.TransformPoint(new Vector3(start.x, start.y,0)), trans.TransformPoint(new Vector3(start.x, end.y)));
				Handles.DrawLine(trans.TransformPoint(new Vector3(start.x, start.y,0)), trans.TransformPoint(new Vector3(end.x, start.y)));
				Handles.DrawLine(trans.TransformPoint(new Vector3(start.x, end.y,0)), trans.TransformPoint(new Vector3(end.x, end.y)));
				Handles.DrawLine(trans.TransformPoint(new Vector3(end.x, start.y,0)), trans.TransformPoint(new Vector3(end.x, end.y)));
			}
			
			Handles.color = new Color (1f,1f,1f,0.05f);
			for(int i=0;i<=layer.layerSize.y;i++) {
				Handles.DrawLine(trans.TransformPoint(new Vector3(0, (float)i * layer.tileSpacing.y, 0)), trans.TransformPoint(new Vector3(layer.tileSpacing.x * layer.layerSize.x, (float)i * layer.tileSpacing.y, 0)));
			}
			for(int i=0;i<=layer.layerSize.x;i++) {
				Handles.DrawLine(trans.TransformPoint(new Vector3((float)i * layer.tileSpacing.x, 0, 0)), trans.TransformPoint(new Vector3((float)i * layer.tileSpacing.x, layer.tileSpacing.y * layer.layerSize.y, 0)));
			}
		}
	}
		
	private void LayerSelect(TileLayer layer)
	{
		TileLayer[] layers = (TileLayer[])GameObject.FindObjectsOfType(typeof(TileLayer));
		string[] layerNames = new string[layers.Length];
		int current = 0;
		for(int i=0; i<layers.Length; ++i)
		{
			if(layers[i]==layer)
				current = i;
			
			layerNames[i] = layers[i].name;
		}
		
		GUILayout.BeginHorizontal();
		GUILayout.Label("Ctrl+Tab",GUILayout.ExpandWidth(false));
		int newSelect = EditorGUILayout.Popup(current, layerNames);
		GUILayout.EndHorizontal();
		
		if(Event.current.keyCode == KeyCode.Tab && Event.current.control)
		{
			if(!justSwitchedLayers)
			{
				if(Event.current.shift)
				{
					--newSelect;
					
					if(newSelect < 0)
						newSelect = layerNames.Length-1;
				}
				else 
					++newSelect;
				
				Event.current.Use();
				justSwitchedLayers = true;
			}
		}
		else 
		{
			justSwitchedLayers = false;
		}
		
		if(newSelect!=current)
			Selection.activeObject = layers[newSelect%layers.Length].gameObject;
	}
	
	private static void CreateObjectButton(TileLayer layer)
	{
		GUILayout.BeginHorizontal();
		GUILayout.Label("B", GUILayout.ExpandWidth(false), GUILayout.MinWidth(20));
		
		if (GUILayout.Button(new GUIContent("Create objects", "Instantiate tile prefabs and box colliders."))
		    || Event.current.keyCode == KeyCode.B) 
		{
			Undo.RegisterSceneUndo("Create Objects");
			TileLayerEditor.InstantiatePrefabs(layer);
		}
		
		GUILayout.EndHorizontal();
	}
	
	private void TemplatePopup(TileLayer layer, TileLayerEditor editor)
	{
		if(layer.material!=null && layer.tileset != null && layer.tileset.templates != null) 
		{
			int length= 1 + layer.tileset.templates.Length;		
			
			string[] templates = new string[length];
			templates[0]="Choose a template";
			for(int i=0;i<layer.tileset.templates.Length;i++) 
			{
				templates[i+1] = i.ToString() + " - " + layer.tileset.templates[i].name;
			}
			
			if(Event.current.type == EventType.KeyDown && Event.current.keyCode == KeyCode.Tab && layer.tileset.templates.Length > 0)
			{
				if(Event.current.modifiers == EventModifiers.Shift)
					editor.selectedTemplate = editor.selectedTemplate<=0 ? layer.tileset.templates.Length-1:editor.selectedTemplate-1;
				else
					editor.selectedTemplate = (editor.selectedTemplate+1)%layer.tileset.templates.Length;
				
				editor.SelectTemplate(layer.tileset.templates[editor.selectedTemplate]);
			}
				
			EditorGUILayout.BeginHorizontal();
			GUILayout.Label("Tab", GUILayout.ExpandWidth(false), GUILayout.MinWidth(20));
			int selection = EditorGUILayout.Popup(Mathf.Min(editor.selectedTemplate + 1,length-1), templates);
			EditorGUILayout.EndHorizontal();
			
			if (selection>0 && editor.selectedTemplate != selection - 1) 
			{
				editor.selectedTemplate = selection - 1;
				editor.SelectTemplate(layer.tileset.templates[editor.selectedTemplate]);
			}			
		}
	}
}