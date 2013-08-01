#pragma strict

public var sprite : GameObject;

function Start () {

}

// Apply the Skin in our OnGUI() function
//在OnGUI()方法中应用这个皮肤
function OnGUI () {
	if(GUI.Button(new Rect(50,20,30,20), "up"))
	{
		sprite.transform.position.y += 10.0;
	}
	if(GUI.Button(new Rect(20,45,30,20), "left"))
	{
		sprite.transform.position.x -= 10.0;
	}
	if(GUI.Button(new Rect(80,45,30,20), "right"))
	{
		sprite.transform.position.x += 10.0;
	}
	if(GUI.Button(new Rect(50,70,30,20), "down"))
	{
		sprite.transform.position.y -= 10.0;
	}
	
}

function Update () 
{	
	
	if(Input.GetKeyDown(KeyCode.Space))
	{
		Debug.Log("Left detected");
		sprite.transform.position.x -= 10.0;
	}
	//Debug.Log("Left detected");
	/*
	else if(Input.GetButtonDown("Right"))
	{
		transform.position.x += 10.0;
	}
	*/
	//transform.rotation.x = 90;
	//transform.rotation.y = 180;
	//transform.rotation.z = 0;
}