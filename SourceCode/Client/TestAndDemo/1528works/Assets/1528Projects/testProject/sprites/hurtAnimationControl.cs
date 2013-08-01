using UnityEngine;
using System.Collections;

public class hurtAnimationControl : MonoBehaviour {
	
	public hurtNumberAnimation[] hurtAnimations = new hurtNumberAnimation[3];
	protected int lastHurtIndex = 0;

	// Use this for initialization
	void Start () {
		
	}
	
	public void ShowHurtNumber(long hurtNumber)
	{
		bool isAllPlaying = true;
		for(int i = 0; i < hurtAnimations.Length; ++i)
		{
			if(!hurtAnimations[i].IsPlayingAnimation())
			{
				lastHurtIndex = i;
				isAllPlaying = false;
			}
		}
		if(isAllPlaying)
		{
			lastHurtIndex ++;
			lastHurtIndex %= hurtAnimations.Length;
		}
		hurtAnimations[lastHurtIndex].PlayAnimationWithNumber(hurtNumber);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
