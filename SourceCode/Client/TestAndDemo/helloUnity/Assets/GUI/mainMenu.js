#pragma strict

function Start () {

}

function Update () {

}

// Create a public variable where we can assign the GUISkin
//创建一个公有变量用于分配用户图形界面皮肤。
var customSkin : GUISkin;

// Apply the Skin in our OnGUI() function
//在OnGUI()方法中应用这个皮肤
function OnGUI () {
	GUI.skin = customSkin;

	// Now create any Controls you like, and they will be displayed with the custom Skin
	//现在随意创建一个控件，它们将显示为自定义的皮肤
	GUILayout.Button ("I am a re-Skinned Button");

	// You can change or remove the skin for some Controls but not others
	//你可以修改或移除这个皮肤以便于显示不使用此皮肤样式的控件。
	//GUI.skin = null;

	// Any Controls created here will use the default Skin and not the custom Skin
	//在这里创建的控件将使用默认皮肤而不是自定义皮肤

	//GUILayout.Button ("This Button uses the default UnityGUI Skin");
	
}