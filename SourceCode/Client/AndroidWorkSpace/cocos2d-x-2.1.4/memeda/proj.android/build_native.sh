APPNAME="memeda"

# options

buildexternalsfromsource=
PARALLEL_BUILD_FLAG=

usage(){
cat << EOF
usage: $0 [options]

Build C/C++ code for $APPNAME using Android NDK

OPTIONS:
-s	Build externals from source
-p  Run make with -j8 option to take advantage of multiple processors
-h	this help
EOF
}

while getopts "sph" OPTION; do
case "$OPTION" in
s)
buildexternalsfromsource=1
;;
p)
PARALLEL_BUILD_FLAG=\-j8
;;
h)
usage
exit 0
;;
esac
done


# paths

# 
NDK_ROOT="/Users/leejustin/Documents/adt-bundle-mac-x86_64-20130729/android-ndk-r9"
#NDK_ROOT="PATH:${NDK_ROOT}"

if [ -z "${NDK_ROOT+aaa}" ];then
echo "NDK_ROOT not defined. Please define NDK_ROOT in your environment or in local.properties"
exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# ... use paths relative to current directory
PLUGIN_ROOT="$DIR/../../plugin"
COCOS2DX_ROOT="$DIR/../.."
APP_ROOT="$DIR/.."
APP_ANDROID_ROOT="$DIR"
RESROUCE_ROOT="$APP_ROOT/Resources"
BINDINGS_JS_ROOT="$APP_ROOT/../scripting/javascript/bindings/js"

echo ""
echo "Paths"
echo "    NDK_ROOT = $NDK_ROOT"
echo "    COCOS2DX_ROOT = $COCOS2DX_ROOT"
echo "    APP_ROOT = $APP_ROOT"
echo "    APP_ANDROID_ROOT = $APP_ANDROID_ROOT"
echo ""

# Debug
set -x

# make sure assets is exist
if [ -d "$APP_ANDROID_ROOT"/assets ]; then
    rm -rf "$APP_ANDROID_ROOT"/assets
fi

mkdir "$APP_ANDROID_ROOT"/assets

# copy "Resources" into "assets"
cp -rf "$RESROUCE_ROOT"/* "$APP_ANDROID_ROOT"/assets

# copy bindings/*.js into assets' root
cp -f "$BINDINGS_JS_ROOT"/*.js "$APP_ANDROID_ROOT"/assets

# copy plugin js into assets' path
cp -f "$PLUGIN_ROOT/jsbindings/js"/* "$APP_ANDROID_ROOT"/assets

# copy "shareSDK config" into "assets"
cp -f "$RESROUCE_ROOT"/../ShareSDK.conf "$APP_ANDROID_ROOT"/assets

echo "Using prebuilt externals"
echo ""

set -x

"$NDK_ROOT"/ndk-build $PARALLEL_BUILD_FLAG -C "$APP_ANDROID_ROOT" $* \
    "NDK_MODULE_PATH=${PLUGIN_ROOT}/publish:${COCOS2DX_ROOT}:${COCOS2DX_ROOT}/cocos2dx/platform/third_party/android/prebuilt" \
    NDK_LOG=0 V=0