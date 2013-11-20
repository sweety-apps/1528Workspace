/**
 * Created with JetBrains WebStorm.
 * User: leejustin
 * Date: 13-10-20
 * Time: 下午8:11
 * To change this template use File | Settings | File Templates.
 */


function UtilsFunctions_setSpriteImageWithName(sprite,imageName)
{
    var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(imageName);
    if(spriteFrame == null || spriteFrame == undefined)
    {
        var image = imageName;
        var rect = sprite.getTextureRect();
        spriteFrame = cc.SpriteFrame.create(image,rect);
        cc.SpriteFrameCache.getInstance().addSpriteFrame(spriteFrame,imageName);
        spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
    }
    sprite.setDisplayFrame(spriteFrame);
}

function UtilsFunctions_setScale9SpriteImageWithName(sprite,imageName)
{
    var spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(imageName);
    if(spriteFrame == null || spriteFrame == undefined)
    {
        var image = imageName;
        var rect = sprite.getTextureRect();
        spriteFrame = cc.SpriteFrame.create(image,rect);
        cc.SpriteFrameCache.getInstance().addSpriteFrame(spriteFrame,imageName);
        spriteFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(image);
    }
    sprite.setSpriteFrame(spriteFrame);
}