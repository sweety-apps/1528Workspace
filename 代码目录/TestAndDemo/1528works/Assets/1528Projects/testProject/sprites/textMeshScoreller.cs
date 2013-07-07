using UnityEngine;
using System.Collections;

public class textMeshScoreller : MonoBehaviour {
	tk2dTextMesh textMesh;
	public int score = 0;
	int oldScore = 0;
	// Use this for initialization
	void Start () {
		textMesh = GetComponent<tk2dTextMesh>();
	}

	// Update is called once per frame
	void Update () {
		if (score != oldScore)
		{
			oldScore = score;
			textMesh.text = "Score: " + score.ToString();
			// This is important, your changes will not be updated until you call Commit()
			// This is so you can change multiple parameters without reconstructing
			// the mesh repeatedly
			textMesh.Commit();
		}
	}
	
}
