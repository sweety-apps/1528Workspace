// Copyright 2011 Sven Magnus

using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

[CustomEditor (typeof(ObjectLayer))]

public class ObjectLayerEditor : Editor {
	
	
	Vector3 selectionOffset;
	Vector3 halfPoint;
	
	bool showProperties = true;
	
	void OnEnable() {
		
		Tools.current = Tool.View;
		
		UniTileManager manager = UniTileManager.instance;
		ObjectLayer layer = target as ObjectLayer;
		if(layer == null) return;
		manager.activeObjectLayer = layer;
	}
	
	void OnDisable() {
		UniTileManager manager = UniTileManager.instance;
		manager.activeObjectLayer = null;
	}
	
	public override void OnInspectorGUI () {
		Tools.current = Tool.View;
		ObjectLayer layer = target as ObjectLayer;
		
		
		layer.gridSize = EditorGUILayout.Vector2Field ("Grid Size", layer.gridSize);
		layer.layerSize = EditorGUILayout.Vector2Field ("Layer Size", layer.layerSize);
		layer.gridOffset = EditorGUILayout.Vector2Field ("Snap Offset", layer.gridOffset);
		layer.snapToGrid = EditorGUILayout.Toggle("Snap to grid", layer.snapToGrid);
		
		if(layer.selected != null) {
			EditorGUILayout.LabelField("","");
			Rect r = EditorGUILayout.BeginVertical();
			showProperties = EditorGUILayout.Foldout(showProperties, "Selected object");
			if(showProperties) {
				
				if (Application.platform == RuntimePlatform.OSXEditor) {
					EditorGUILayout.LabelField("","");
				}
				
				layer.selected.name = EditorGUILayout.TextField("Name", layer.selected.name);
				layer.selected.localPosition = EditorGUILayout.Vector3Field("Object position", layer.selected.localPosition);
				layer.selected.localScale = EditorGUILayout.Vector3Field("Object scale", layer.selected.localScale);
				
				if (Application.platform == RuntimePlatform.OSXEditor) {
					EditorGUILayout.LabelField("","");
				}
				
				if (GUILayout.Button(new GUIContent("Go to selected object"),GUILayout.Width(150), GUILayout.Height(30))) {
					Object[] sel = new Object[1];
					sel[0] = layer.selected.gameObject;
					Selection.objects = sel;
				}
				if (Application.platform == RuntimePlatform.OSXEditor) {
					EditorGUILayout.LabelField("","");
				}
			}
			//y+=40;
			
			EditorGUILayout.EndVertical();
			if (Application.platform == RuntimePlatform.OSXEditor) {
				GUI.Box(r, "");
			}
			
			
		}
		
		EditorGUILayout.LabelField("","");
		
		this.DrawDefaultInspector();
		
		if (Application.platform == RuntimePlatform.OSXEditor) {
			EditorGUILayout.LabelField("","");
		}
		
		Rect rect = EditorGUILayout.BeginVertical();
		EditorGUILayout.EndVertical();
		
		
		
		int x = 10;
		int y = (int)rect.y + 10;
		
		
		Rect box = new Rect(rect.x, y - 5, rect.width, 10);
		bool inc = false;
		if(layer.prefabs!=null) {
			for(int i = 0; i<layer.prefabs.Length; i++) {
				if(layer.prefabs[i]!=null) {
					inc = true;
					if (GUI.Button(new Rect(x, y, 100, 30), new GUIContent(layer.prefabs[i].name))) {
						Undo.RegisterSceneUndo("Add object "+layer.prefabs[i].name);
						//Hack for backwards compatibility
#if (UNITY_3_5 || UNITY_3_6 || UNITY_3_7 || UNITY_3_8 || UNITY_3_9)
						Object o = PrefabUtility.InstantiatePrefab(layer.prefabs[i]);
#else
						Object o = EditorUtility.InstantiatePrefab(layer.prefabs[i]);
#endif
						GameObject g = o as GameObject;
						if(g == null) g = ((Transform)o).gameObject;
						Transform t = g.transform;
						t.parent = layer.transform;
						t.localPosition = new Vector3(halfPoint.x, halfPoint.y, 0);
						layer.selected = t;
					}
					x+=105;
					if(x+100>rect.width) {
						inc = false;
						x=10;
						y+=30;
						box.height+=30;
					}
				}
			}
			if(inc) box.height+=30;
			if (Application.platform == RuntimePlatform.OSXEditor) {
				GUI.Box(box, "");
			}
		}
	}
	
	
	void OnSceneGUI() {
		Tools.current = Tool.View;
		ObjectLayer layer = target as ObjectLayer;
		if(layer == null) return;
		UniTileManager manager = UniTileManager.instance;
		if(manager == null) return;
		
		if(EditorWindow.mouseOverWindow) {
			Vector3 pos = GetCoordinates();
			
			if(Event.current.type==EventType.mouseDown) {
				if(Event.current.button==0) {
					layer.selected = this.Select(pos);
					
					if(layer.selected != null && Event.current.modifiers.ToString()=="Control") {
						Undo.RegisterSceneUndo("Delete object "+layer.selected.name);
						DestroyImmediate(layer.selected.gameObject);
						layer.selected = null;
						
					}
				}
			}
			
			if(Event.current.type==EventType.mouseUp) {
				if(Event.current.button==0) {
					
						if(layer.selected != null && layer.snapToGrid) {
							Undo.RegisterSceneUndo("Move "+layer.selected.name);
							layer.selected.transform.localPosition = new Vector3(Mathf.Round((pos.x - layer.gridOffset.x - selectionOffset.x)/layer.gridSize.x) * layer.gridSize.x + layer.gridOffset.x, Mathf.Round((pos.y - layer.gridOffset.y - selectionOffset.y)/layer.gridSize.y) * layer.gridSize.y + layer.gridOffset.y, layer.selected.transform.localPosition.z);
						}
						this.Repaint();
						
					
				}
			}
			
			if(Event.current.type==EventType.dragPerform || Event.current.type==EventType.DragExited || Event.current.type==EventType.dragUpdated || Event.current.type==EventType.mouseDrag) {
				if(Event.current.button==0 && layer.selected != null) {
					Event.current.Use();
					Undo.RegisterSceneUndo("Move "+layer.selected.name);
					layer.selected.transform.localPosition = new Vector3(pos.x, pos.y, layer.selected.transform.localPosition.z) - selectionOffset;
				}
				
			}
			
			
			HandleUtility.Repaint();
		}
		
		halfPoint = GetCoordinates(new Vector2(Screen.width / 2, Screen.height / 2));
	}
	
	
	private Vector3 GetCoordinates() {
		return GetCoordinates(Event.current.mousePosition);
	}
	
	private Vector3 GetCoordinates(Vector2 pos) {
		Plane p = new Plane((this.target as MonoBehaviour).transform.TransformDirection(Vector3.forward), (this.target as MonoBehaviour).transform.position);
		Ray ray = HandleUtility.GUIPointToWorldRay(pos);
		
        Vector3 hit = new Vector3();
        float dist;
		
		if (p.Raycast(ray, out dist))
        	hit = ray.origin + ray.direction.normalized * dist;
		
		return (this.target as MonoBehaviour).transform.InverseTransformPoint(hit);
	}
	
	Transform Select(Vector3 pos) {
		ObjectLayer layer = target as ObjectLayer;
		Transform t;
		Bounds b;
		bool keepSelection = false;
		Vector3 pos2 = (this.target as MonoBehaviour).transform.TransformPoint(pos);
		
		for(int i = 0; i<layer.transform.childCount; i++) {
			t = layer.transform.GetChild(i);
			b = layer.FindBounds(t);
			if(t.gameObject.active) {
				pos2.z = pos.z = t.position.z;
				if(b.Contains(pos2)) {
					if(layer.selected == t) {
						keepSelection = true;
						continue;
					}
					selectionOffset = pos - t.localPosition;
					selectionOffset.z = 0;
					return t;
				}
			}
		}
		if(keepSelection) {
			selectionOffset = pos - layer.selected.localPosition;
			selectionOffset.z = 0;
			return layer.selected;
		}
		return null;
	}
	
}
