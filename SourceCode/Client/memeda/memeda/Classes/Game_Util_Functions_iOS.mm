//
//  Game_Util_Functions.mm
//  memeda
//
//  Created by Lee Justin on 13-11-11.
//
//

#include "cocos2d.h"
#include "Game_Util_Functions.h"

double Game_Util_getIntervalSecondsFromDateString(const char* lastDate)
{
    NSDateFormatter* df = [[[NSDateFormatter alloc] init] autorelease];
    [df setDateFormat:@"EEE MMM dd HH:mm:ss yyyy"];
    NSString* nsstr = [[NSString alloc]initWithUTF8String:lastDate];
    
    NSDate* oldDate = [df dateFromString:nsstr];
    NSDate* now = [NSDate date];
    
    [nsstr release];
    
    NSTimeInterval time= [now timeIntervalSinceDate:oldDate];
    
    return time;
}