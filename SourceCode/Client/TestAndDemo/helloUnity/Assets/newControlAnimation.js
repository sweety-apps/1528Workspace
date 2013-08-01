#pragma strict

//动画数组
private var animUp: Object[] ;
private var animDown: Object[] ;
private var animLeft: Object[] ;
private var animRight: Object[] ;
//地图贴图
private var map : Texture2D;
//当前人物动画
private var tex : Object[];
//人物X坐标
private var x:int;
//人物Y坐标
private var y:int;
//帧序列
private var nowFram : int;
//动画帧的总数
private var mFrameCount : int;
//限制一秒多少帧
private var fps : float = 10;
//限制帧的时间 
private var time : float = 0;
function Start()
{
//得到帧动画中的所有图片资源
animUp = Resources.LoadAll("up");
animDown = Resources.LoadAll("down");
animLeft = Resources.LoadAll("left");
animRight = Resources.LoadAll("right");
    //得到地图资源
    map = Resources.Load("map/map");
    //设置默认动画
    tex  = animUp;
}
function OnGUI() 
{
//绘制贴图
GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), map, ScaleMode.StretchToFill, true, 0);

//绘制帧动画
DrawAnimation(tex,Rect(x,y,32,48));
    //点击按钮移动人物
if(GUILayout.RepeatButton("向上"))
{
  y-=2;
  tex = animUp;
}
if(GUILayout.RepeatButton("向下"))
{
  y+=2;
  tex = animDown;
}
if(GUILayout.RepeatButton("向左"))
{
  x-=2;
  tex = animLeft;
}
if(GUILayout.RepeatButton("向右"))
{
  x+=2;
  tex = animRight;
}
}

function  DrawAnimation(tex : Object[] , rect : Rect)
{
  //绘制当前帧
  GUI.DrawTexture(rect, tex[nowFram], ScaleMode.StretchToFill, true, 0);
  //计算限制帧时间
  time += Time.deltaTime;
   //超过限制帧则切换图片
   if(time >= 1.0 / fps){
          //帧序列切换
          nowFram++;
          //限制帧清空
          time = 0;
          //超过帧动画总数从第0帧开始
          if(nowFram >= tex.Length)
          {
           nowFram = 0;
          }
        } 
}