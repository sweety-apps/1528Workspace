using UnityEngine;
using System.Collections;

public class monsterHitEffectControl : MonoBehaviour {
// -------------------------------------------------------------------------------------------
	public		GameObject[]	m_EffectPrefabs		= new GameObject[1];
	public		int				m_nIndex = 0;
	public		float			m_fCreateScale		= 1.0f;
	public		int				m_nCreateCount		= 1;
	public		float			m_fRandomRange		= 1;

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
		if (m_EffectPrefabs[m_nIndex] == null)
			return;

		float fRandomRange = 0;
		if (1 < m_nCreateCount)
			fRandomRange = m_fRandomRange;

		for (int n = 0; n < GetInstanceRoot().transform.GetChildCount(); n++)
			Destroy(GetInstanceRoot().transform.GetChild(n).gameObject);
		for (int n = 0; n < m_nCreateCount; n++)
		{
			GameObject createObj = (GameObject)Instantiate(m_EffectPrefabs[m_nIndex], position, Quaternion.identity);
			createObj.transform.localScale = createObj.transform.localScale * m_fCreateScale;
			NcEffectBehaviour.PreloadTexture(createObj);
			createObj.transform.parent = GetInstanceRoot().transform;
#if (UNITY_4_0 || UNITY_4_1 || UNITY_4_2 || UNITY_4_3 || UNITY_4_4 || UNITY_4_5 || UNITY_4_6 || UNITY_4_7 || UNITY_4_8 || UNITY_4_9)
			SetActiveRecursively(createObj, true);
#endif
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
