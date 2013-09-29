//
//  DMOfferWallViewController.h
//  DomobOfferWallSDK
//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

// 消费结果状态码
typedef enum {
    // 消费成功
    // Consume Successfully
    DMOfferWallConsumeStatusCodeSuccess = 1,
    // 剩余积分不足
    // Not enough point
    DMOfferWallConsumeStatusCodeInsufficient,
    // 订单重复
    // Duplicate consume order
    DMOfferWallConsumeStatusCodeDuplicateOrder
} DMOfferWallConsumeStatusCode;

@class DMOfferWallViewController;
@protocol DMOfferWallDelegate <NSObject>
// 积分墙开始加载列表数据。
// Offer wall starts to fetch list info.
- (void)offerWallDidStartLoad;
// 积分墙加载完成。
// Fetching offer wall list successfully.
- (void)offerWallDidFinishLoad;
// 积分墙加载失败。可能的原因由error部分提供，例如网络连接失败、被禁用等。
// Failed to load offer wall.
- (void)offerWallDidFailLoadWithError:(NSError *)error;
// 积分墙页面被关闭。
// Offer wall closed.
- (void)offerWallDidClosed;
#pragma mark Point Check Callbacks
// 积分查询成功之后，回调该接口，获取总积分和总已消费积分。
// Called when finished to do point check.
- (void)offerWallDidFinishCheckPointWithTotalPoint:(NSInteger)totalPoint
                             andTotalConsumedPoint:(NSInteger)consumed;
// 积分查询失败之后，回调该接口，返回查询失败的错误原因。
// Called when failed to do point check.
- (void)offerWallDidFailCheckPointWithError:(NSError *)error;
#pragma mark Consume Callbacks
// 消费请求正常应答后，回调该接口，并返回消费状态（成功或余额不足），以及总积分和总已消费积分。
// Called when finished to do consume point request and return the result of this consume.
- (void)offerWallDidFinishConsumePointWithStatusCode:(DMOfferWallConsumeStatusCode)statusCode
                                          totalPoint:(NSInteger)totalPoint
                                  totalConsumedPoint:(NSInteger)consumed;
// 消费请求异常应答后，回调该接口，并返回异常的错误原因。
// Called when failed to do consume request.
- (void)offerWallDidFailConsumePointWithError:(NSError *)error;

@optional
#pragma mark OfferWall Interstitial
// 当积分墙插屏广告被成功加载后，回调该方法
// Called when interstitial ad is loaded successfully.
- (void)dmOfferWallInterstitialSuccessToLoadAd:(DMOfferWallViewController *)dmOWInterstitial;
// 当积分墙插屏广告加载失败后，回调该方法
// Called when failed to load interstitial ad.
- (void)dmOfferWallInterstitialFailToLoadAd:(DMOfferWallViewController *)dmOWInterstitial withError:(NSError *)err;
// 当积分墙插屏广告要被呈现出来前，回调该方法
// Called when interstitial ad will be presented.
- (void)dmOfferWallInterstitialWillPresentScreen:(DMOfferWallViewController *)dmOWInterstitial;
// 当积分墙插屏广告被关闭后，回调该方法
// Called when interstitial ad has been closed.
- (void)dmOfferWallInterstitialDidDismissScreen:(DMOfferWallViewController *)dmOWInterstitial;
@end

@interface DMOfferWallViewController : UIViewController

@property (nonatomic, assign) NSObject<DMOfferWallDelegate> *delegate;
@property (nonatomic, assign) UIViewController *rootViewController;
// 禁用StoreKit库提供的应用内打开store页面的功能，采用跳出应用打开OS内置AppStore。默认为NO，即使用StoreKit。
@property (nonatomic, assign) BOOL disableStoreKit;

// 使用Publisher ID初始化积分墙ViewController
// Create OfferWallViewController with your own Publisher ID
- (id)initWithPublisherID:(NSString *)publisherID;

// 使用Publisher ID和应用当前登陆用户的User ID（或其它的在应用中唯一标识用户的ID）初始化积分墙ViewController
// Create OfferWallViewController with your own Publisher ID and User ID.
- (id)initWithPublisherID:(NSString *)publisherID andUserID:(NSString *)userID;

// 使用App的rootViewController来弹出并显示积分墙。
// Present offer wall in ModelView way with App's rootViewController.
- (void)presentOfferWall;

// 使用开发者传入的UIViewController来弹出显示OfferWallViewController。
// Present OfferWallViewController with developer's controller.
- (void)presentOfferWallWithViewController:(UIViewController *)controller;

#pragma mark Online Usage Methods
// 请求在线积分检查，成功或失败都会回调Online Usage Callbacks中关于point check的相应方法。
- (void)requestOnlinePointCheck;
// 请求在线消费指定积分，成功或失败都会回调Online Usage Callbacks中关于consume的相应方法。
// 请特别注意参数类型为unsigned int，需要消费的积分为非负值。
- (void)requestOnlineConsumeWithPoint:(NSUInteger)pointToConsume;

#pragma mark OfferWall Interstitial
// 请求加载插屏积分墙
// Request to load interstitial.
- (void)loadOfferWallInterstitial;
// 询问积分墙插屏是否完成，该方法立即返回当前状态，不会阻塞主线程。
// Check if interstitial is ready to show.
- (BOOL)isOfferWallInterstitialReady;
// 显示加载完成的积分墙插屏。若没有加载完成，不会展现。
// Request a present of loaded interstitial.
- (void)presentOfferWallInterstitial;
@end
