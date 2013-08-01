using UnityEngine;
using System.Collections;

public class monsterBehaviourScript : MonoBehaviour {

	public tk2dSprite sprite;
	public heroKakaControl hero = null;
	//public tk2dSpriteAnimation anim;
	//public string idleAnimName;
	//public string cutAnimName;
	protected tk2dSpriteAnimator animator;
	
	protected bool shouldHurt = false;
	public textMeshScoreller scoreMesh = null;
	public monsterHitEffectControl hurtEffect = null;
	
	public AudioClip emptyCutAudio = null;
	public AudioClip hurtCutAudio = null;
	
	protected bool shouldPlayEmptyCutAudio = false;
	
	public hurtAnimationControl hurtNumber = null;
	
	// This is called once the hit animation has compelted playing
    // It returns to playing whatever animation was active before hit
    // was playing.
    void HitCompleteDelegate(tk2dSpriteAnimator sprite, tk2dSpriteAnimationClip clip) {
		onFinishCut();
    }
	
	// Use this for initialization
	void Start () {
		sprite = GetComponent<tk2dSprite>();
		animator = GetComponent<tk2dSpriteAnimator>();
		//sprite.animationCompleteDelegate = HitCompleteDelegate;
	}
	
	void onHurt()
	{
		double heroLeftSide = hero.transform.position.x - 300;
		double heroRightSide = hero.transform.position.x;
		Debug.Log("heroLeft = "+heroLeftSide + " hero Right = " + heroRightSide + " monster x = " + transform.position.x);
		if(hero != null && (transform.position.x > heroLeftSide && transform.position.x < heroRightSide))
		{
			shouldHurt = true;
		}
		else
		{
			shouldPlayEmptyCutAudio = true;
		}
	}
	
	void onFinishCut()
	{
		animator.Play("monsterIdle");
	}

	// Update is called once per frame
	void Update () 
	{
		if(hero.cutDelegate == null)
		{
			hero.cutDelegate = onHurt;
		}
		if (hero != null && shouldHurt)
		{	
			if(animator != null)
			{
				animator.Play("monsterHurt");
				animator.AnimationCompleted = HitCompleteDelegate;
				shouldHurt = false;
				if(scoreMesh != null)
				{
					scoreMesh.score += 50;
				}
				if(hurtEffect != null)
				{
					hurtEffect.CreateEffect(transform.position);
				}
				if(hurtCutAudio != null)
				{
					audio.PlayOneShot(hurtCutAudio,5);
				}
				if(hurtNumber != null)
				{
					long hurtValue = (long)(Time.deltaTime * 1000000.0);
					hurtValue %= 100000000000;
					hurtNumber.ShowHurtNumber(-hurtValue);
				}
			}
		}
		
		if(shouldPlayEmptyCutAudio)
		{
			if(emptyCutAudio != null)
			{
				audio.PlayOneShot(emptyCutAudio,500);
			}
			shouldPlayEmptyCutAudio = false;
		}
		
		if(animator != null && !animator.Playing)
		{
			onFinishCut();
		}
	}
}
