//
//  iOSiapImp.cpp
//  memeda
//
//  Created by Lee Justin on 13-9-29.
//
//

#include "iOSiapImp.h"
#import "EBPurchase.h"

#import "MKStoreLib/MKStoreLib/MKStoreKit/MKStoreManager.h"

#pragma mark - Data Struct Handle Defines

@class iOSPurchaseImpl;

typedef struct tagIOS_PurchaseHandle_C{
    iOSPurchaseImpl* obj;
}IOS_PurchaseHandle_C;


@interface iOSPurchaseImpl : NSObject <EBPurchaseDelegate> {
    
    // Assign this class as a delegate of EBPurchaseDelegate.
    // Then add an EBPurchase property.
    
    EBPurchase* demoPurchase;
    BOOL isPurchased;
    
    iOSiap_ResultCallback _callback;
    void* _context;
    NSString* _productID;
}

@property (nonatomic,assign) iOSiap_ResultCallback callback;
@property (nonatomic,assign) void* context;
@property (nonatomic,readonly,retain) NSString* productID;

-(IBAction)purchaseProduct:(NSString*)productID;

@end

// REPLACE THIS VALUE WITH YOUR OWN IN-APP PURCHASE PRODUCT ID.

#define SUB_PRODUCT_ID @"Your.IAP.Product.ID"

// ALSO ADD THE RELATED PARENT APP BUNDLE IDENTIFIER TO THE INFO PLIST.

@implementation iOSPurchaseImpl

@synthesize callback = _callback;
@synthesize context = _context;
@synthesize productID = _productID;

- (void)popupOpenIAPSettingAlert
{
    UIAlertView *updatedAlert = [[UIAlertView alloc] initWithTitle:@"内购功能没有打开" message:@"请切出应用，在您的\"设置\"中打开应用内置购买功能！" delegate:nil cancelButtonTitle:@"关闭" otherButtonTitles:nil];
    [updatedAlert show];
    [updatedAlert release];
    
    if (_callback != NULL)
    {
        std::string product_Id = "";
        std::string errMsg = "";
        if ([_productID UTF8String] != NULL)
        {
            product_Id = [_productID UTF8String];
        }
        errMsg = "内购功能没有打开";
        _callback(kiOSiap_ResultFailed,product_Id,errMsg,_context);
    }
}

- (BOOL)checkCanPurchase
{
    if (![demoPurchase requestProduct:SUB_PRODUCT_ID])
    {
        // Returned NO, so notify user that In-App Purchase is Disabled in their Settings.
        [self popupOpenIAPSettingAlert];
        return NO;
    }
    return YES;
}

-(id)init
{
    self = [super init];
    if(self)
    {
        // Create an instance of EBPurchase.
        demoPurchase = [[EBPurchase alloc] init];
        demoPurchase.delegate = self;
        isPurchased = NO; // default.
    }
    return self;
}

- (void)dealloc
{
    // Release the EBPurchase instance and delegate.
    demoPurchase.delegate = nil;
    [demoPurchase release];
    [_productID release];
    
    [super dealloc];
}

-(IBAction)purchaseProduct:(NSString*)productID
{
    [productID retain];
    [_productID release];
    _productID = productID;
    isPurchased = NO;
    
    // First, ensure that the SKProduct that was requested by
    // the EBPurchase requestProduct method in the viewWillAppear
    // event is valid before trying to purchase it.
    if (![demoPurchase requestProduct:productID])
    {
        // Returned NO, so notify user that In-App Purchase is Disabled in their Settings.
        
        [self popupOpenIAPSettingAlert];
    }
}

-(IBAction)restorePurchase
{
    // Restore a customer's previous non-consumable or subscription In-App Purchase.
    // Required if a user reinstalled app on same device or another device.
    
    // Call restore method.
    if (![demoPurchase restorePurchase])
    {
        [self popupOpenIAPSettingAlert];
    }
}


#pragma mark -
#pragma mark EBPurchaseDelegate Methods

-(void) requestedProduct:(EBPurchase*)ebp identifier:(NSString*)productId name:(NSString*)productName price:(NSString*)productPrice description:(NSString*)productDescription
{
    NSLog(@"iOSPurchaseImpl requestedProduct");
    
    if (productPrice != nil)
    {
        // Product is available, so update button title with price.
        
        //[buyButton setTitle:[@"Buy Game Levels Pack " stringByAppendingString:productPrice] forState:UIControlStateNormal];
        //buyButton.enabled = YES; // Enable buy button.
        
        if (demoPurchase.validProduct != nil)
        {
            // Then, call the purchase method.
            
            if (![demoPurchase purchaseProduct:demoPurchase.validProduct])
            {
                [self popupOpenIAPSettingAlert];
            }
        }
        
        
    } else {
        // Product is NOT available in the App Store, so notify user.
        
        if (_callback != NULL)
        {
            std::string product_Id = "";
            std::string errMsg = "";
            if ([_productID UTF8String] != NULL)
            {
                product_Id = [_productID UTF8String];
            }
            errMsg = [@"请求超时了!请检测网络。" UTF8String];
            _callback(kiOSiap_ResultCancel,product_Id,errMsg,_context);
        }
    }
}

-(void) successfulPurchase:(EBPurchase*)ebp restored:(bool)isRestore identifier:(NSString*)productId receipt:(NSData*)transactionReceipt
{
    NSLog(@"iOSPurchaseImpl successfulPurchase");
    
    // Purchase or Restore request was successful, so...
    // 1 - Unlock the purchased content for your new customer!
    // 2 - Notify the user that the transaction was successful.
    
    if (!isPurchased)
    {
        // If paid status has not yet changed, then do so now. Checking
        // isPurchased boolean ensures user is only shown Thank You message
        // once even if multiple transaction receipts are successfully
        // processed (such as past subscription renewals).
        
        isPurchased = YES;
        
        //-------------------------------------
        
        // 1 - Unlock the purchased content and update the app's stored settings.
        
        //-------------------------------------
        
        // 2 - Notify the user that the transaction was successful.
        
        if (_callback != NULL)
        {
            std::string product_Id = "";
            std::string errMsg = "";
            if ([_productID UTF8String] != NULL)
            {
                product_Id = [_productID UTF8String];
            }
            errMsg = "";
            _callback(kiOSiap_ResultSuccess,product_Id,errMsg,_context);
        }
    }
    
}

-(void) failedPurchase:(EBPurchase*)ebp error:(NSInteger)errorCode message:(NSString*)errorMessage
{
    NSLog(@"iOSPurchaseImpl failedPurchase");
    
    // Purchase or Restore request failed or was cancelled, so notify the user.
    
    if (_callback != NULL)
    {
        std::string product_Id = "";
        std::string errMsg = "";
        if ([_productID UTF8String] != NULL)
        {
            product_Id = [_productID UTF8String];
        }
        if ([errorMessage UTF8String] != NULL)
        {
            errMsg = [errorMessage UTF8String];
        }
        _callback(kiOSiap_ResultFailed,product_Id,errMsg,_context);
    }
}

-(void) incompleteRestore:(EBPurchase*)ebp
{
    NSLog(@"iOSPurchaseImpl incompleteRestore");
    
    // Restore queue did not include any transactions, so either the user has not yet made a purchase
    // or the user's prior purchase is unavailable, so notify user to make a purchase within the app.
    // If the user previously purchased the item, they will NOT be re-charged again, but it should
    // restore their purchase.
    
    if (_callback != NULL)
    {
        std::string product_Id = "";
        std::string errMsg = "";
        if ([_productID UTF8String] != NULL)
        {
            product_Id = [_productID UTF8String];
        }
        errMsg = "";
        _callback(kiOSiap_ResultCancel,product_Id,errMsg,_context);
    }
}

-(void) failedRestore:(EBPurchase*)ebp error:(NSInteger)errorCode message:(NSString*)errorMessage
{
    NSLog(@"iOSPurchaseImpl failedRestore");
    
    // Restore request failed or was cancelled, so notify the user.
    
    if (_callback != NULL)
    {
        std::string product_Id = "";
        std::string errMsg = "";
        if ([_productID UTF8String] != NULL)
        {
            product_Id = [_productID UTF8String];
        }
        if ([errorMessage UTF8String] != NULL)
        {
            errMsg = [errorMessage UTF8String];
        }
        _callback(kiOSiap_ResultFailed,product_Id,errMsg,_context);
    }
}

@end


#pragma mark - Extern Functions

void iOSiap_init()
{
    /*
    [[MKStoreManager sharedManager] removeAllKeychainData];
    [MKStoreManager sharedManager];
    [[MKStoreManager sharedManager] purchasableObjectsDescription];
     */
}

void* iOSiap_create()
{
    IOS_PurchaseHandle_C* handle_C = (IOS_PurchaseHandle_C*)malloc(sizeof(IOS_PurchaseHandle_C));
    memset(handle_C, 0, sizeof(IOS_PurchaseHandle_C));
    handle_C->obj = [[iOSPurchaseImpl alloc] init];
    return handle_C;
}

void iOSiap_payforPuduct(void* handle, std::string productID, iOSiap_ResultCallback callback,void* context)
{
    if (!handle)
    {
        return;
    }
    
    IOS_PurchaseHandle_C* handle_C = (IOS_PurchaseHandle_C*)handle;
    handle_C->obj.callback = callback;
    handle_C->obj.context = context;
    
    /*
    [[MKStoreManager sharedManager] buyFeature:[NSString stringWithUTF8String:productID.c_str()] onComplete:^(NSString* purchasedFeature, NSData*purchasedReceipt, NSArray* availableDownloads){
        handle_C->obj.callback(kiOSiap_ResultSuccess,productID.c_str(),"",handle_C->obj.context);
    } onCancelled:^(){
        handle_C->obj.callback(kiOSiap_ResultCancel,productID.c_str(),"",handle_C->obj.context);
    }];
     */
    [handle_C->obj purchaseProduct:[NSString stringWithUTF8String:productID.c_str()]];
}

void iOSiap_destory(void* handle)
{
    if (!handle)
    {
        return;
    }
    
    IOS_PurchaseHandle_C* handle_C = (IOS_PurchaseHandle_C*)handle;
    if (handle_C->obj)
    {
        [handle_C->obj release];
    }
    
    free(handle_C);
}


