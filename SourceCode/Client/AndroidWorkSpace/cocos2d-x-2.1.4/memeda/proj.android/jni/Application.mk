##APP_STL := gnustl_static
##APP_CPPFLAGS := -frtti -DCOCOS2D_JAVASCRIPT=1
##APP_CPPFLAGS += -DCOCOS2D_DEBUG=1 -DCC_ENABLE_CHIPMUNK_INTEGRATION=1
APP_STL := gnustl_static
##APP_CPPFLAGS := -frtti -DCOCOS2D_DEBUG=1 -std=c++11 -Wno-literal-suffix -O0 -gstabs+
##APP_CPPFLAGS += -DCOCOS2D_JAVASCRIPT=1 -DCOCOS2D_DEBUG=1 -DCC_ENABLE_CHIPMUNK_INTEGRATION=1
APP_CPPFLAGS := -frtti -DCOCOS2D_DEBUG=0 -std=c++11 -Wno-literal-suffix -O2 -gstabs+
APP_CPPFLAGS += -DCOCOS2D_JAVASCRIPT=1 -DCOCOS2D_DEBUG=0 -DCC_ENABLE_CHIPMUNK_INTEGRATION=1
APP_ABI := armeabi
APP_OPTIM := debug
NDK_APP_OPTIM := debug
NDK_DEBUG := 1
APP_PLATFORM := android-19
