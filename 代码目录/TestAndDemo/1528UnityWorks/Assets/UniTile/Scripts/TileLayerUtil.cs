using UnityEngine;
using System.Collections.Generic;
using System.Collections;

public struct GroupPos : System.IComparable<GroupPos>
{
	public int x;
	public int y;
	
	public GroupPos(int x, int y) 	{this.x = x; this.y = y;}
	
	public int CompareTo (GroupPos other)
	{
		int res = y.CompareTo(other.y);
		if(res!=0) 
			return res;
		else 
			return x.CompareTo(other.x);		
	}
}

public struct TilePos : System.IComparable<TilePos>
{
	public int x;
	public int y;
	
	public TilePos(int x, int y) 	{this.x = x; this.y = y;}
	
	public int CompareTo (TilePos other)
	{
		int res = y.CompareTo(other.y);
		if(res!=0) 
			return res;
		else 
			return x.CompareTo(other.x);		
	}
}

public struct TileChange
{
	public TilePos 	pos;
	public int 		newTile;
	public TileChange(TilePos pos, int newTile) {this.pos = pos; this.newTile = newTile;}
	public TileChange(int tileX, int tileY, int newTile) {this.pos = new TilePos(tileX, tileY); this.newTile = newTile;}
}

public static class TileLayerUtil
{
	public static GroupPos TileToGroup(TileLayer layer, int tileX, int tileY)
	{
		int groupX = (int)Mathf.Floor((float)tileX/(float)layer.groupSize.x);
		int groupY = (int)Mathf.Floor((float)tileY/(float)layer.groupSize.y);
		return new GroupPos(groupX, groupY);
	}
	
	public static GroupPos TileToGroup(TileLayer layer, TilePos tile)
	{
		return TileToGroup(layer, tile.x, tile.y); 
	}
	
	public static void RedrawGroupForChange(TileLayer layer, TileChange change)
	{
		GroupPos group = TileToGroup(layer, change.pos);
		RedrawGroup(layer, group.x, group.y);
	}
	
	public static void RedrawGroupForChanges(TileLayer layer, TileChange[] changes)
	{
		List<GroupPos> groups = new List<GroupPos>();
		foreach(TileChange change in changes)
		{
			GroupPos group = TileToGroup(layer, change.pos);
			if(!groups.Contains(group))
				groups.Add(group);
		}
		
		foreach(GroupPos group in groups)
		{
			RedrawGroup(layer, group.x, group.y);
		}
	}
/*	 
	public static void RedrawGroupForTiles(TileLayer layer, TilePos[] tiles)
	{
		List<GroupPos> groups = new List<GroupPos>();
		foreach(TilePos tile in tiles)
		{
			GroupPos group = TileToGroup(layer, tile);
			if(!groups.Contains(group))
				groups.Add(group);
		}
		
		foreach(GroupPos group in groups)
		{
			RedrawGroup(layer, group.x, group.y);
		}
	}
*/
	
	public static void RedrawGroup(TileLayer layer, int groupX, int groupY) 
	{
		if(layer == null) return;
		if(layer.parent != null) layer = layer.parent;
		
		GameObject g;
		Transform t = layer.GroupRoot.FindChild("group_"+groupX+"_"+groupY);
		Mesh m;
		if(t==null) 
		{
			g=new GameObject("group_"+groupX+"_"+groupY);
			t=g.transform;
			t.transform.parent=layer.GroupRoot;
			t.localPosition=new Vector3(groupX * layer.tileSpacing.x * layer.groupSize.x, groupY * layer.tileSpacing.y * layer.groupSize.y);
			t.localScale = new Vector3(1, 1, 1);
			Quaternion quaternion = t.localRotation;
			quaternion.eulerAngles = new Vector3(0, 0, 0);
			t.localRotation = quaternion;
			MeshRenderer r = g.AddComponent<MeshRenderer>();
			MeshFilter f = g.AddComponent<MeshFilter>();
			m = f.sharedMesh = new Mesh();
			r.material = layer.material;
		} 
		else 
		{
			g = t.gameObject;
			MeshFilter f = t.GetComponent<MeshFilter>();
			GameObject.DestroyImmediate(f.sharedMesh);;
			m = f.sharedMesh = new Mesh();
		}
		
		//ArrayList temp = new ArrayList();
		List<Hashtable> temp = new List<Hashtable>();
		
		List<TileLayer> layers = new List<TileLayer>();
		layers.Add(layer);
		for(int i=0; i<layer.transform.childCount; i++) 
		{
			TileLayer child = layer.transform.GetChild(i).GetComponent<TileLayer>();
			if(child != null) {
				layers.Add(child);
			}
		}
		
		layers.Sort(delegate(TileLayer l1, TileLayer l2) 
		            {return (l2==layer?0f:l2.transform.localPosition.z).CompareTo(l1==layer?0f:l1.transform.localPosition.z);});

		for(int c=0; c<layers.Count; c++) 
		{
			TileLayer lyr = layers[c];
			
			Hashtable skip = new Hashtable();
			
			
			for(int i=groupX*(int)lyr.groupSize.x;i<Mathf.Min(lyr.layerSize.x, groupX*(int)lyr.groupSize.x+lyr.groupSize.x);i++) 
			{
				for(int j=groupY*(int)lyr.groupSize.y;j<Mathf.Min(lyr.layerSize.y, groupY*(int)lyr.groupSize.y+lyr.groupSize.y);j++) 
				{
					UniTileTile tile = lyr.GetTile(i, j);
					TileInstance data = lyr.GetTileData(i, j);
					if(data != null && data.id!=-1) 
					{
						if(skip[new Vector2(i, j)] == null) 
						{
							Hashtable h=new Hashtable();
							h["x"]=i;
							h["y"]=j;
							h["z"]=(lyr==layer?0:lyr.transform.localPosition.z);
							h["tile"]=data;
							h["resizable"] = tile.resizable;
						
							int sizeX = 1;
							int sizeY = 1;
							
							if(tile!=null && tile.resizable) 
							{
								while(skip[new Vector2(i, j + sizeY)]==null && lyr.GetTileId(i, j + sizeY) == data.id && j+sizeY<(groupY + 1) * lyr.groupSize.y) 
								{
									skip[new Vector2(i, j + sizeY)] = true;
									sizeY++;
								}
								
								if(sizeY == 1) 
								{
									while(skip[new Vector2(i + sizeX, j)]==null && lyr.GetTileId(i + sizeX, j) == data.id && i+sizeX<(groupX + 1) * lyr.groupSize.x) 
									{
										skip[new Vector2(i + sizeX, j)] = true;
										sizeX++;
									}
								} 
								else 
								{
									sizeX = 1;
									bool columnOk = true;
									int column = 1;
									while(columnOk && i+column<(groupX + 1) * lyr.groupSize.x) 
									{
										columnOk = true;
										for(int k=0;k<sizeY;k++) 
										{
											if(skip[new Vector2(i + column, j + k)]!=null || lyr.GetTileId(i + column, j + k) != data.id) 
											{
												columnOk = false;
												break;
											}
										}
										if(columnOk) 
										{
											column++;
										}
									}
									sizeX = column;
									for(int k=0;k<sizeX;k++) 
									{
										for(int l=0;l<sizeY;l++) 
										{
											skip[new Vector2(i + k, j + l)] = true;
										}
									}
								}
							}
							
							h["sizeX"] = sizeX;
							h["sizeY"] = sizeY;
						
							temp.Add(h);
						}
					}
				}
			}
		}
		
		if(temp.Count==0) {
			GameObject.DestroyImmediate(m);
			GameObject.DestroyImmediate(g);
		} 
		else 
		{
			Vector3 [] vertices = new Vector3[4 * temp.Count];
			int [] triangles = new int[6 * temp.Count];
			Vector2 [] uv = new Vector2[4 * temp.Count];
			
			for(int i=0;i<temp.Count;i++) 
			{
				Hashtable h=temp[i] as Hashtable;
				int x = (int)((int)h["x"]*layer.tileSpacing.x) - (int)(groupX * layer.tileSpacing.x * layer.groupSize.x);
				int y = (int)((int)h["y"]*layer.tileSpacing.y) - (int)(groupY * layer.tileSpacing.y * layer.groupSize.y);
				int sizeX = (int)h["sizeX"];
				int sizeY = (int)h["sizeY"];
				TileInstance data = (TileInstance)h["tile"];
				
				Rect vRect = new Rect();
				Rect uvRect = new Rect();
				
				int columns = (int)((layer.material.mainTexture.width) / (layer.tileSize.x + layer.borderSize.x * 2));
				
				if(sizeX == 1 && sizeY == 1) 
				{
					vRect.x = (int)x - layer.overlap.x;
					vRect.y = (int)y - layer.overlap.y;
					vRect.xMax = layer.tileSpacing.x + (int)x  + layer.overlap.x;
					vRect.yMax = layer.tileSpacing.y + (int)y + layer.overlap.y;
					
					uvRect.x = Mathf.Floor(data.id % columns) * (layer.tileSize.x + layer.borderSize.x * 2f) + layer.borderSize.x - layer.overlap.x;
					uvRect.y = layer.material.mainTexture.height - (Mathf.Floor(data.id / columns) * (layer.tileSize.x + layer.borderSize.y * 2f) + layer.borderSize.y + layer.overlap.y + layer.tileSize.y);
					uvRect.width = layer.tileSize.x + layer.overlap.x;
					uvRect.height = layer.tileSize.y + layer.overlap.y;
					
					Texture2D texture = (Texture2D)layer.material.mainTexture;
					
					if(layer.readableTexture && !Application.isPlaying)
					{
						try {
							// Find empty columns left
							int start = Mathf.Max(0, (int)Mathf.Round(uvRect.x));
							int end = Mathf.Min(texture.width, (int)Mathf.Round(uvRect.xMax));
							for(int j=start; j<end; j++) {
								int min = Mathf.Max(0, (int)Mathf.Round(uvRect.y));
								int max = Mathf.Min(texture.height - min, (int)Mathf.Round(uvRect.height));
								Color[] pixels = texture.GetPixels(j, min, 1, max);
								bool allTrans = true;
								for(int k=0;k<pixels.Length;k++) 
								{
									if(pixels[k].a != 0) {
										allTrans = false;
										break;
									}
								}
								
								if(!allTrans) 
									break;
								
								uvRect.xMin++;
								vRect.xMin+=layer.tileSpacing.x / layer.tileSize.x;
							}
							
							// Find empty columns right
							start = Mathf.Min(texture.width, (int)Mathf.Round(uvRect.xMax)) - 1;
							end = Mathf.Max(0, (int)Mathf.Round(uvRect.x));
							for(int j=start; j>=end; j--) 
							{
								int min = Mathf.Max(0, (int)Mathf.Round(uvRect.y));
								int max = Mathf.Min(texture.height - min, (int)Mathf.Round(uvRect.height));
								Color[] pixels = texture.GetPixels(j, min, 1, max);
								bool allTrans = true;
								for(int k=0;k<pixels.Length;k++) 
								{
									if(pixels[k].a != 0) 
									{
										allTrans = false;
										break;
									}
								}
								if(!allTrans) break;
								else 
								{
									uvRect.xMax--;
									vRect.xMax-=layer.tileSpacing.x / layer.tileSize.x;
								}
							}
						
							// Find empty rows down
							start = Mathf.Max(0, (int)Mathf.Round(uvRect.y));
							end = Mathf.Min(texture.height, (int)Mathf.Round(uvRect.yMax));
							for(int j=start; j<end; j++) 
							{
								int min = Mathf.Max(0, (int)Mathf.Round(uvRect.x));
								int max = Mathf.Min(texture.width - min, (int)Mathf.Round(uvRect.width));
								
								Color[] pixels = texture.GetPixels(min, j, max, 1);
								bool allTrans = true;
								for(int k=0;k<pixels.Length;k++) 
								{
									if(pixels[k].a != 0) 
									{
										allTrans = false;
										break;
									}
								}
								
								if(!allTrans) 
									break;
	
								uvRect.yMin++;
								vRect.yMin+=layer.tileSpacing.y / layer.tileSize.y;
							}
						
							// Find empty rows up
							start = Mathf.Min(texture.height, (int)Mathf.Round(uvRect.yMax)) - 1;
							end = Mathf.Max(0, (int)Mathf.Round(uvRect.y));
							
							for(int j=start; j>=end; j--) {
								int min = Mathf.Max(0, (int)Mathf.Round(uvRect.x));
								int max = Mathf.Min(texture.width - min, (int)Mathf.Round(uvRect.width));
								Color[] pixels = texture.GetPixels(min, j, max, 1);
								bool allTrans = true;
								for(int k=0;k<pixels.Length;k++) {
									if(pixels[k].a != 0) {
										allTrans = false;
										break;
									}
								}
								
								if(!allTrans) 
									break;
								uvRect.yMax--;
								vRect.yMax-=layer.tileSpacing.y / layer.tileSize.y;
							}
						} catch {
							layer.readableTexture = false;
						}
					}
				} 
				else 
				{
					vRect.x = (int)x - layer.overlap.x;
					vRect.y = (int)y - layer.overlap.y;
					vRect.xMax = layer.tileSpacing.x * (float)sizeX + (int)x + layer.overlap.x;
					vRect.yMax = layer.tileSpacing.y * (float)sizeY + (int)y + layer.overlap.y;
					
					//vRect.xMax = layer.tileSize.x * 1 + (int)x  + layer.overlap.x;
					//vRect.yMax = layer.tileSize.y * 1 + (int)y + layer.overlap.y;
					
					uvRect.x = Mathf.Floor(data.id % columns) * (layer.tileSize.x + layer.borderSize.x * 2f) + (layer.borderSize.x - layer.overlap.x) / sizeX + 1;
					uvRect.y = layer.material.mainTexture.height - (Mathf.Floor(data.id / columns) * (layer.tileSize.x + layer.borderSize.y * 2f) + (layer.borderSize.y + layer.overlap.y) / sizeY + layer.tileSize.y) + 1;
					uvRect.width = layer.tileSize.x + layer.overlap.x - 2;
					uvRect.height = layer.tileSize.y + layer.overlap.y - 2;
				}
				
				
				
				
				Vector2 center = new Vector2(x, y) + layer.tileSpacing / 2f;
				
				//Vecrtices
				vertices[(i*4) + 0] = new Vector3(vRect.x, vRect.yMax, (float)h["z"]);
				vertices[(i*4) + 1] = new Vector3(vRect.xMax, vRect.yMax, (float)h["z"]);
				vertices[(i*4) + 2] = new Vector3(vRect.x, vRect.y, (float)h["z"]);
				vertices[(i*4) + 3] = new Vector3(vRect.xMax, vRect.y, (float)h["z"]);
				
				bool reversed = false;
				
				if(!(bool)h["resizable"]) {
				
					for(int j = 0; j < (uint)data.rotation; j++) {
						vertices[(i*4) + 0] = RotatePoint(vertices[(i*4) + 0], center);
						vertices[(i*4) + 1] = RotatePoint(vertices[(i*4) + 1], center);
						vertices[(i*4) + 2] = RotatePoint(vertices[(i*4) + 2], center);
						vertices[(i*4) + 3] = RotatePoint(vertices[(i*4) + 3], center);
					}
					
					if(data.flippedHorizontally) {
						reversed = !reversed;
						vertices[(i*4) + 0].x = (center.x - vertices[(i*4) + 0].x) + center.x;
						vertices[(i*4) + 1].x = (center.x - vertices[(i*4) + 1].x) + center.x;
						vertices[(i*4) + 2].x = (center.x - vertices[(i*4) + 2].x) + center.x;
						vertices[(i*4) + 3].x = (center.x - vertices[(i*4) + 3].x) + center.x;
					}
					
					if(data.flippedVertically) {
						reversed = !reversed;
						vertices[(i*4) + 0].y = (center.y - vertices[(i*4) + 0].y) + center.y;
						vertices[(i*4) + 1].y = (center.y - vertices[(i*4) + 1].y) + center.y;
						vertices[(i*4) + 2].y = (center.y - vertices[(i*4) + 2].y) + center.y;
						vertices[(i*4) + 3].y = (center.y - vertices[(i*4) + 3].y) + center.y;
					}
				}
				
				
				
				// Triangles
				if(!reversed) {
					triangles[(i*6) + 0] = (i*4) + 0;
					triangles[(i*6) + 1] = (i*4) + 1;
					triangles[(i*6) + 2] = (i*4) + 2;
					triangles[(i*6) + 3] = (i*4) + 1;
					triangles[(i*6) + 4] = (i*4) + 3;
					triangles[(i*6) + 5] = (i*4) + 2;
				} else {
					triangles[(i*6) + 0] = (i*4) + 2;
					triangles[(i*6) + 1] = (i*4) + 1;
					triangles[(i*6) + 2] = (i*4) + 0;
					triangles[(i*6) + 3] = (i*4) + 2;
					triangles[(i*6) + 4] = (i*4) + 3;
					triangles[(i*6) + 5] = (i*4) + 1;
				}
				
				
				// UVS
				uv[(i*4) + 0] = new Vector2(uvRect.x / (float)layer.material.mainTexture.width, uvRect.yMax / (float)layer.material.mainTexture.height);
				uv[(i*4) + 1] = new Vector2(uvRect.xMax / (float)layer.material.mainTexture.width, uvRect.yMax / (float)layer.material.mainTexture.height);
				uv[(i*4) + 2] = new Vector2(uvRect.x / (float)layer.material.mainTexture.width, uvRect.y / (float)layer.material.mainTexture.height);
				uv[(i*4) + 3] = new Vector2(uvRect.xMax / (float)layer.material.mainTexture.width, uvRect.y / (float)layer.material.mainTexture.height);		
			}
			
			m.vertices = vertices;
			m.triangles = triangles;
			m.uv = uv;
			
			m.RecalculateNormals();
		}
	}
	
	public static Vector2 RotatePoint(Vector2 p1, Vector2 center) {
		Vector2 temp = p1 - center;
		return new Vector2(temp.y, -temp.x) + center;
	}
	
	public static Vector2 TransformPoint(Vector2 p1, Vector2 center, bool flippedH, bool flippedV, TileInstance.Rotation rotation) {
		for(int i = 0; i < (int)rotation; i++) {
			p1 = RotatePoint(p1, center);
		}
		if(flippedH) {
			p1.x = (center.x - p1.x) + center.x;
		}
		
		if(flippedV) {
			p1.y = (center.y - p1.y) + center.y;
		}
		
		return p1;
	}
	
	public static Rect TransformRect(Rect rect, Vector2 center, bool flippedH, bool flippedV, TileInstance.Rotation rotation) {
		
		Vector2 v1 = new Vector2(rect.x, rect.y);
		Vector2 v2 = new Vector2(rect.xMax, rect.yMax);
		
		
		
		for(int i = 0; i < (int)rotation; i++) {
			v1 = RotatePoint(v1, center);
			v2 = RotatePoint(v2, center);
		}
		
		if(flippedH) {
			v1.x = (center.x - v1.x) + center.x;
			v2.x = (center.x - v2.x) + center.x;
		}
		
		if(flippedV) {
			v1.y = (center.y - v1.y) + center.y;
			v2.y = (center.y - v2.y) + center.y;
		}
		
		
		if(v2.x < v1.x) {
			float temp = v1.x;
			v1.x = v2.x;
			v2.x = temp;
		}
		
		if(v2.y < v1.y) {
			float temp = v1.y;
			v1.y = v2.y;
			v2.y = temp;
		}
		
		rect.x = v1.x;
		rect.y = v1.y;
		rect.xMax = v2.x;
		rect.yMax = v2.y;
		
		return rect;
		
	}
}