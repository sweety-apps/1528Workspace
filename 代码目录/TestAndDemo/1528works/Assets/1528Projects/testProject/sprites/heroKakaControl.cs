using UnityEngine;
using System.Collections;

public class heroKakaControl : MonoBehaviour {
	
	public tk2dSprite sprite;
	//public tk2dSpriteAnimation anim;
	//public string idleAnimName;
	//public string cutAnimName;
	protected tk2dSpriteAnimator animator;
	
	public int moveSpeed = 100;
	
	public delegate void HeroCutDelegate();
	public HeroCutDelegate cutDelegate = null;
	
	public bool isCutting = false;
	
	// This is called once the hit animation has compelted playing
    // It returns to playing whatever animation was active before hit
    // was playing.
    void HitCompleteDelegate(tk2dSpriteAnimator sprite, tk2dSpriteAnimationClip clip) {
        onFinishCut();
    }
	
	bool CheckCut()
	{
		if((Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Began)
			|| Input.GetKeyDown(KeyCode.Space)
			)
		{
			return true;
		}
		return false;
	}
	
	void onFinishCut()
	{
		isCutting = false;
		animator.Play("testHeroKakaIdleAnim");
	}
	
	void doCut()
	{
		if(animator != null)
		{
			animator.Play("testHeroKakaCutAnim");
			animator.AnimationCompleted = HitCompleteDelegate;
			isCutting = true;
			
			if(cutDelegate != null)
			{
				cutDelegate();
			}
			
		}
	}
	
	//movement control
	void doMove()
	{
		float transformValue = 0;
		
		float KeyVertical = Input.GetAxis ("Vertical") ;
		float KeyHorizontal = Input.GetAxis ("Horizontal");
		
		if(KeyHorizontal > 0)
		{
			//Right
			Debug.Log("move value "+KeyHorizontal);
			transformValue = KeyHorizontal * Time.deltaTime * moveSpeed;
		}
		else if(KeyHorizontal < 0)
		{
			//Left
			Debug.Log("move value "+KeyHorizontal);
			transformValue =  KeyHorizontal * Time.deltaTime * moveSpeed;
		}
		
		if(transform.position.x + transformValue < 960 && transform.position.x + transformValue > -960)
		{
			//move
			transform.Translate(Vector3.right * transformValue) ;
		}
	}
	
	// Use this for initialization
	void Start () {
		sprite = GetComponent<tk2dSprite>();
		animator = GetComponent<tk2dSpriteAnimator>();
		//sprite.animationCompleteDelegate = HitCompleteDelegate;
	}

	// Update is called once per frame
	void Update () 
	{
		doMove();
		
		if (CheckCut())
		{
			doCut();
		}
		
		if(animator != null && !animator.Playing)
		{
			onFinishCut();
		}
		
	}

}
