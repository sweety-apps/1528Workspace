//
//  iOSiapImp.h
//  memeda
//
//  Created by Lee Justin on 13-9-29.
//
//

#ifndef __memeda__iOSiapImp__
#define __memeda__iOSiapImp__

#include <iostream>

#define kiOSiap_ResultSuccess "Success"
#define kiOSiap_ResultFailed "Failed"
#define kiOSiap_ResultCancel "Cancel"

typedef void (*iOSiap_ResultCallback)(std::string result, std::string productID, std::string errorMsg, void* context);

void* iOSiap_create();
void iOSiap_payforPuduct(void* handle, std::string productID, iOSiap_ResultCallback callback,void* context);
void iOSiap_destory(void* handle);

#endif /* defined(__memeda__iOSiapImp__) */
