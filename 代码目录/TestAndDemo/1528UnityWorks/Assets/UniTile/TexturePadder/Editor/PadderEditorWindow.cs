using UnityEngine;
using UnityEditor;
using System.Collections;
using System.IO;

public class PadderEditorWindow : EditorWindow {
	
	public Vector2 tileSize = new Vector2(32,32);
	public Vector2 borderSize = new Vector2(1, 1);
	public Vector2 textureSize;
	public Texture2D source;
	public bool makePOT = true;
	
	
	[MenuItem ("UniTile/Texture Padder &t")]
	static void Init () {
		
		Texture2D source = Selection.activeObject as Texture2D;
		if (source == null) {
			EditorUtility.DisplayDialog("Select Texture", "You Must Select a Texture first!", "Ok");
			return;
		}
		
		PadderEditorWindow window = (PadderEditorWindow)EditorWindow.GetWindow (typeof (PadderEditorWindow));
		window.source = source;
	}
	
	void OnGUI () {
		
		if(source==null) return;
		
		int colsPrev = (int)Mathf.Floor(source.width / tileSize.x);
		int rowsPrev = (int)Mathf.Floor(source.height / tileSize.y);
		int minXPrev = (int)(colsPrev * (tileSize.x + borderSize.x * 2f));
		int minYPrev = (int)(rowsPrev * (tileSize.y + borderSize.y * 2f));
		
		this.tileSize = EditorGUILayout.Vector2Field("Tile size", this.tileSize);
		this.borderSize = EditorGUILayout.Vector2Field("Border size", this.borderSize);
		
		
		int cols = (int)Mathf.Floor(source.width / tileSize.x);
		int rows = (int)Mathf.Floor(source.height / tileSize.y);
		int minX = (int)(cols * (tileSize.x + borderSize.x * 2f));
		int minY = (int)(rows * (tileSize.y + borderSize.y * 2f));
		
		EditorGUILayout.BeginHorizontal();
		this.textureSize = EditorGUILayout.Vector2Field("Texture size", this.textureSize);
		makePOT = EditorGUILayout.Toggle("Make PoT", makePOT);
		EditorGUILayout.EndHorizontal();
		
		if(textureSize.x < minX || minX != minXPrev) textureSize.x = minX;
		if(textureSize.y < minY || minY != minYPrev) textureSize.y = minY;
		
		
		
		if(makePOT) {
			int i = 1;
			while(Mathf.Pow(2, i) < textureSize.x) {
				i++;
			}
			textureSize.x = Mathf.Pow(2, i);
			while(Mathf.Pow(2, i) < textureSize.y) {
				i++;
			}
			textureSize.y = Mathf.Pow(2, i);
		}
		
		if(GUILayout.Button("Save")) {
			
			Texture2D texture = new Texture2D((int)textureSize.x, source.height);
			
			this.FillBlank(texture);
			
			for(int i=0;i<cols;i++) {
				
				Color[] c1 = source.GetPixels((int)(i*this.tileSize.x), 0, 1, source.height);
				Color[] c2 = source.GetPixels((int)((i + 1) * this.tileSize.x - 1), 0, 1, source.height);
				for(int j=0; j< this.borderSize.x; j++) {
					texture.SetPixels((int)(i*(tileSize.x + this.borderSize.x * 2) + j), 0, 1, source.height, c1);
					texture.SetPixels((int)(i*(tileSize.x + this.borderSize.x * 2) + j + tileSize.x + borderSize.x), 0, 1, source.height, c2);
				}
				
				texture.SetPixels((int)(i*(tileSize.x + this.borderSize.x * 2) + this.borderSize.x), 0, (int)this.tileSize.x, source.height, source.GetPixels((int)(i*this.tileSize.x), 0, (int)this.tileSize.x, source.height));
				
			}
			
			Texture2D temp = texture;
			texture = new Texture2D(temp.width, (int)textureSize.y);
			
			this.FillBlank(texture);
			
			for(int i=0;i<rows;i++) {
				
				Color [] c1 = temp.GetPixels(0, (int)(i*this.tileSize.y), temp.width, 1);
				Color [] c2 = temp.GetPixels(0, (int)((i + 1) * this.tileSize.y - 1), temp.width, 1);
				for(int j=0; j< this.borderSize.y; j++) {
					texture.SetPixels(0, (int)(i*(tileSize.y + this.borderSize.y * 2) + j + (this.textureSize.y-minY)), temp.width, 1, c1);
					texture.SetPixels(0, (int)(i*(tileSize.y + this.borderSize.y * 2) + j + (this.textureSize.y-minY) + tileSize.y + borderSize.y), temp.width, 1, c2);
				}
				texture.SetPixels(0, (int)(i*(tileSize.y + this.borderSize.y * 2) + (this.textureSize.y-minY) + this.borderSize.y), temp.width, (int)this.tileSize.y, temp.GetPixels(0, (int)(i*this.tileSize.y), temp.width, (int)this.tileSize.y));
					
			}
			
			
			string path = EditorUtility.SaveFilePanel("Save texture as PNG", "", source.name + ".png", "png");
			Debug.Log(path);
			if (path.Length != 0) {
				byte[] pngData = texture.EncodeToPNG();
				if (pngData != null) {
					File.WriteAllBytes(path, pngData);
				}
			}
			
			DestroyImmediate(texture);
			DestroyImmediate(temp);
			
			AssetDatabase.Refresh();
			
			this.Close();
		}
	}
	
	public void FillBlank(Texture2D texture) {
		Color[] colors = texture.GetPixels();
		for(int i = 0; i < colors.Length; ++i) {
			colors[i] = new Color(0,0,0,0);
		}
		texture.SetPixels(colors);
	}
	
	public void Setup(Texture2D source, Vector2 tileSize, Vector2 borderSize) {
		this.tileSize = tileSize;
		this.borderSize = borderSize;
		this.source = source;
	}
}