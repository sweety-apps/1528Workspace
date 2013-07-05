using UnityEditor;
using UnityEngine;

public class TileLayerEditor_Tileset
{
	private Vector2 	scrollPos 		= new Vector2(0,0);
	private bool 		useScrollView 	= false;
	public static Texture2D s_selectionTexture = null;	// needs to be public to prevent memory leak on scene save
	private bool 		selecting;
	
	private Texture2D SelectionTexture 
	{
		get 
		{
			if(s_selectionTexture == null)
			{
				s_selectionTexture = new Texture2D(1,1);
				s_selectionTexture.SetPixel(0,0,new Color(0.75f,0.75f,0.25f,0.4f));
				s_selectionTexture.Apply();
			}
			return s_selectionTexture;
		}
	}
	
	public void OnDisable() {
		Texture2D.DestroyImmediate(SelectionTexture);
	}
	
	public void OnInspectorGUI(TileLayer layer, UniTileTemplate selection, TileLayerEditor editor)
	{
		if(layer.material == null) 
			return;
		useScrollView = EditorGUILayout.Toggle("Use scrollview", useScrollView);			
		
		float w = Mathf.Min(Screen.width, layer.material.mainTexture.width); //Mathf.Min(rect.width,layer.material.mainTexture.width);
		float scale = w / layer.material.mainTexture.width;
		float h = layer.material.mainTexture.height * scale;
		Rect rect = GUILayoutUtility.GetLastRect();
		float top = rect.yMax;
		
		int tilesX = (int)Mathf.Floor((float)layer.material.mainTexture.width / (layer.tileSize.x + layer.borderSize.x * 2f));
		
		int tileX1 = (int)Mathf.Floor((float)selection.selectedTile.id % (float)tilesX);
		int tileY1 = (int)Mathf.Floor((float)selection.selectedTile.id / (float)tilesX);
		
		int tileX2 = (int)Mathf.Floor((float)selection.selectedTileEnd.id % (float)tilesX);
		int tileY2 = (int)Mathf.Floor((float)selection.selectedTileEnd.id / (float)tilesX);
		
		int tileXMin=Mathf.Min(tileX1, tileX2);
		int tileYMin=Mathf.Min(tileY1, tileY2);
		int tileXMax=Mathf.Max(tileX1, tileX2);
		int tileYMax=Mathf.Max(tileY1, tileY2);		
		
		int tileWidth = tileXMax - tileXMin + 1;
		int tileHeight = tileYMax - tileYMin + 1;
		
		float tempTop = top;
		
		if(useScrollView) {
			scale = 1;
			w = layer.material.mainTexture.width;
			h = layer.material.mainTexture.height;
		
			float scrollWidth = Screen.width-25;
			float scrollHeight = h+10;
			scrollPos = EditorGUILayout.BeginScrollView(scrollPos, false, false, GUILayout.Height(scrollHeight), GUILayout.Width(scrollWidth));
			GUILayout.Label("", GUILayout.Width(scrollWidth), GUILayout.Height(scrollHeight));
			tempTop = 0;
		}
		else
		{
			GUILayout.Label("", GUILayout.Width(w), GUILayout.Height(h));
		}
		
		GUI.DrawTexture(new Rect(0,tempTop,w,h), layer.material.mainTexture);		
		
		if(selection.selectedTile.id>=0 && !selection.tilesPicked) {
			GUIStyle style = new GUIStyle(GUI.skin.customStyles[0]);
			style.normal.background = SelectionTexture;
			GUI.Box(
				new Rect(
					(tileXMin * (layer.tileSize.x + layer.borderSize.x * 2f) + layer.borderSize.x) * scale,
					tempTop + (tileYMin * (layer.tileSize.y + layer.borderSize.y * 2f) + layer.borderSize.y) * scale,
					(tileWidth * (layer.tileSize.x + layer.borderSize.x * 2f) - layer.borderSize.x * 2f) * scale,
					(tileHeight * (layer.tileSize.y + layer.borderSize.y * 2f) - layer.borderSize.y * 2f) * scale
				),
				"",
				style
			);
		}
		
		if(useScrollView) 
		{
			EditorGUILayout.EndScrollView();
		}			
		
		if(Event.current!=null) 
		{
			if(Event.current.type==EventType.MouseDown) 
			{
				if(Event.current.button==0) 
				{
					Vector2 pos = Event.current.mousePosition;
					if(useScrollView) pos += scrollPos;
					this.selecting=true;
					selection.tilesPicked = false;
					
					if(pos.x>=0 && pos.x<=layer.material.mainTexture.width * scale && pos.y>=top && pos.y<=top+layer.material.mainTexture.height * scale) 
					{
						editor.selectedTemplate = - 1;
						selection.selectedTile.id = selection.selectedTileEnd.id = (int)Mathf.Floor((pos.x / scale) /(layer.tileSize.x + layer.borderSize.x * 2f)) + (int)(Mathf.Floor((pos.y - top)/(scale * (layer.tileSize.y + layer.borderSize.y * 2f))) * tilesX);
						if(Event.current.clickCount==2) {
							TileEditorWindow window = TileEditorWindow.CreateInstance<TileEditorWindow>();
							window.Setup(editor, selection.selectedTilesList);
							window.ShowUtility();
						}
					}
				} else 
				{
					selection.tilesPicked = false;
					selection.selectedTile.id = -1;
					selection.selectedTileEnd.id = -1;
				}
			}
			
			if(Event.current.type==EventType.mouseDrag) 
			{
				if(selecting) 
				{
					Vector2 pos = Event.current.mousePosition;
					if(useScrollView) pos += scrollPos;
					if(pos.x>=0 && pos.x<=layer.material.mainTexture.width * scale && pos.y>=top && pos.y<=top+layer.material.mainTexture.height * scale) 
					{
						selection.selectedTileEnd.id = (int)Mathf.Floor((pos.x / scale) /(layer.tileSize.x + layer.borderSize.x * 2f)) + (int)(Mathf.Floor((pos.y - top)/(scale * (layer.tileSize.y + layer.borderSize.y * 2f))) * tilesX);
						selection.tilesPicked = false;
						selection.selectedTilesWidth = tileXMax - tileXMin + 1;
						selection.selectedTilesList = new TileInstance[(tileXMax - tileXMin + 1) * (tileYMax - tileYMin + 1)];
						HandleUtility.Repaint ();
						if(selection.selectedTile.id>=0) 
						{
							for(int i = tileXMin; i<= tileXMax; i++) 
							{
								for(int j = tileYMin; j<= tileYMax; j++) 
								{
									int x = i-tileXMin;
									int y = j-tileYMin;
									selection.selectedTilesList[x + y * selection.selectedTilesWidth] = new TileInstance(i + j * tilesX);
								}
							}
							
						} else 
						{
							selection.selectedTilesList[0]=new TileInstance(-1);
						}
						UniTileMarker.Instance.Init(selection);
						
					}
				}
			}
			
			if(Event.current.type==EventType.MouseUp) 
			{
				selection.tilesPicked = false;
				selection.selectedTilesWidth = tileXMax - tileXMin + 1;
				selection.selectedTilesList = new TileInstance[(tileXMax - tileXMin + 1) * (tileYMax - tileYMin + 1)];
				HandleUtility.Repaint ();
				if(selection.selectedTile.id>=0) 
				{
					for(int i = tileXMin; i<= tileXMax; i++) 
					{
						for(int j = tileYMin; j<= tileYMax; j++) 
						{
							int x = i-tileXMin;
							int y = j-tileYMin;
							selection.selectedTilesList[x + y * selection.selectedTilesWidth] = new TileInstance(i + j * tilesX);
						}
					}
				}
				else 
				{
					selection.selectedTilesList[0]=new TileInstance(-1);
				}
				UniTileMarker.Instance.Init(selection);
				this.selecting=false;
			}
			
		}
	}
}