//
//  iOSiapWrapper.h
//  memeda
//
//  Created by Lee Justin on 13-9-29.
//
//

#ifndef __memeda__iOSiapWrapper__
#define __memeda__iOSiapWrapper__

#include <iostream>

class iOSiapWrapperCallBackClass
{
public:
    iOSiapWrapperCallBackClass(){};
    virtual ~iOSiapWrapperCallBackClass(){};
    virtual void onPurchaseCallback(std::string result, std::string productID, std::string errorMsg);
};

class iOSiapWrapper
{
protected:
    static iOSiapWrapper* g_singleInstance;
    void* handle;
public:
    iOSiapWrapper();
    virtual ~iOSiapWrapper();
    
    static iOSiapWrapper* getInstance();
    
    iOSiapWrapperCallBackClass* purchaseCallbackTarget;
    
    void setPurchaseCallbackTarget(iOSiapWrapperCallBackClass* target)
    {
        purchaseCallbackTarget = target;
    }
    iOSiapWrapperCallBackClass*  getPurchaseCallbackTarget(){
        return purchaseCallbackTarget;
    };
    
    void payForProduct(std::string productID);
    
    static void initAll();
};

#endif /* defined(__memeda__iOSiapWrapper__) */
