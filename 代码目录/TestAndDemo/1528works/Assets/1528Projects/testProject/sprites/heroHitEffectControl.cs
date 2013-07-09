using UnityEngine;
using System.Collections;

public class heroHitEffectControl : MonoBehaviour {
// -------------------------------------------------------------------------------------------
	public		GameObject 	m_EffectPrefabs		= null;
	public		float			m_fCreateScale		= 1.0f;
	public		float			m_fRandomRange		= 1;
	protected	GameObject m_LastEffect	= null;

	// -------------------------------------------------------------------------------------------
	void Awake()
	{
	}

	void OnEnable()
	{
	}

	void Start()
	{
// 		m_EffectPrefab = (GameObject)Resources.Load("test", typeof(GameObject));
// 		NcEffectBehaviour.PreloadTexture(m_EffectPrefab);
		Resources.UnloadUnusedAssets();
		Invoke("CreateEffect", 1);
	}
	
	public void CreateEffect(Vector3 position)
	{
		if (m_EffectPrefabs == null)
			return;

		float fRandomRange = 1;
		
		if(m_LastEffect != null)
		{
			for(int n = m_LastEffect.transform.GetChildCount() - 1; n >= 0; n--)
			{
				Destroy(m_LastEffect.transform.GetChild(n).gameObject);
			}
			Destroy(m_LastEffect);
			m_LastEffect = null;
		}
		
		for (int n = 0; n < 1; n++)
		{
			GameObject createObj = (GameObject)Instantiate(m_EffectPrefabs, position, m_EffectPrefabs.transform.rotation);
			createObj.transform.localScale = createObj.transform.localScale * m_fCreateScale;
			NcEffectBehaviour.PreloadTexture(createObj);
			createObj.transform.parent = GetInstanceRoot().transform;
#if (UNITY_4_0 || UNITY_4_1 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_4_7 || UNITY_4_8 || UNITY_4_9)
			SetActiveRecursively(createObj, true);
#endif
			m_LastEffect = createObj;
		}
	}

	void Update()
	{
	}

	void OnGUI()
	{
	}

	public GameObject GetInstanceRoot()
	{
		return NcEffectBehaviour.GetRootInstanceEffect();
	}

	public static void SetActiveRecursively(GameObject target, bool bActive)
	{
#if (UNITY_4_0 || UNITY_4_1 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_4_7 || UNITY_4_8 || UNITY_4_9)
		for (int n = target.transform.GetChildCount()-1; 0 <= n; n--)
			if (n < target.transform.GetChildCount())
				SetActiveRecursively(target.transform.GetChild(n).gameObject, bActive);
		target.SetActive(bActive);
#else
		target.SetActiveRecursively(bActive);
#endif
	}
}
