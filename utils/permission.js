export function check_overlays() {  
  const isIos = uni.getSystemInfoSync().platform == 'ios'  
  const android_overlays = () => {  
    var main = plus.android.runtimeMainActivity()  
    var pkName = main.getPackageName()  
    var Settings = plus.android.importClass('android.provider.Settings')  
    var Uri = plus.android.importClass('android.net.Uri')  
    var Build = plus.android.importClass('android.os.Build')  
    var Intent = plus.android.importClass('android.content.Intent')  
    var intent = new Intent(  
      'android.settings.action.MANAGE_OVERLAY_PERMISSION',  
      Uri.parse('package:' + pkName)  
    )  
    // main.startActivityForResult(intent, 5004);  
    if (!Settings.canDrawOverlays(main)) {  
      // 检测悬浮窗  
      uni.showModal({  
        title: '温馨提示',  
        content: '请先打开悬浮窗权限，带来更好的体验',  
        showCancel: true,  
        success: function(res) {  
          if (res.confirm) {  
            main.startActivityForResult(intent, 5004) // 转跳到悬浮窗设置  
          }  
        }  
      })  
    }  
  }  
  const ios_overlays = () => {  
    // 有空在写  
    // var UIApplication = plus.ios.import("UIApplication");  
    // var app = UIApplication.sharedApplication();  
    // var enabledTypes  = 0;  
  }  
  return !isIos ? android_overlays() : ios_overlays()  
}  