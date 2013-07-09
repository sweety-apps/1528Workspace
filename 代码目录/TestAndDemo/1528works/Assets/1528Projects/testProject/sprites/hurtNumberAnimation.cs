using UnityEngine;
using System.Collections;

public class hurtNumberAnimation : MonoBehaviour {
	
	public float duration = 1.0f;
	public tk2dTextMesh textMesh = null;
	
	protected bool shouldRestart = false;
	protected string stringToShow = "";
	protected Vector3 maxLocalScale;
	
	protected enum TextShowingState {
		TX_STOPPED,
		TX_PLAYING,
	};
	
	protected TextShowingState currentState = TextShowingState.TX_STOPPED;
	protected float playedTime = 0;
	
	public void PlayAnimationWithNumber(long number)
	{
		stringToShow = number.ToString();
		shouldRestart = true;
	}
	
	public bool IsPlayingAnimation()
	{
		if(currentState == TextShowingState.TX_STOPPED)
		{
			return false;
		}
		return true;
	}
	
	void resetState()
	{
		currentState = TextShowingState.TX_PLAYING;
		playedTime = 0;
		if(textMesh != null)
		{
			textMesh.text = stringToShow;
			textMesh.Commit();
		}
	}
	
	void doAnim()
	{
		if(currentState == TextShowingState.TX_PLAYING)
		{
			playedTime += Time.deltaTime;
			if(textMesh != null)
			{
				float scale = playedTime * 2.0f / duration;
				if(scale > 1.0)
				{
					scale = 1.0f;
				}
				Vector3 newScale = maxLocalScale * scale;
				newScale.Set(newScale.x,newScale.y,maxLocalScale.z);
				transform.localScale = newScale;
			}
			if(playedTime > duration)
			{
				currentState = TextShowingState.TX_STOPPED;
			}
		}
		
		if(currentState == TextShowingState.TX_STOPPED)
		{
			transform.localScale = maxLocalScale * 0;
		}
	}
	
	// Use this for initialization
	void Start () 
	{
		textMesh = GetComponent<tk2dTextMesh>();
		maxLocalScale = transform.localScale;
	}
	
	// Update is called once per frame
	void Update () 
	{
		if(shouldRestart)
		{
			resetState();
			shouldRestart = false;
		}
		
		doAnim();
	}
}
