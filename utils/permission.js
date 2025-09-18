export function check_overlays() {  
  const isIos = uni.getSystemInfoSync().platform == 'ios'  
  const android_overlays = () => {  
    try {  
      var main = plus.android.runtimeMainActivity()  
      var pkName = main.getPackageName()  
      var Settings = plus.android.importClass('android.provider.Settings')  
      var Uri = plus.android.importClass('android.net.Uri')  
      var Intent = plus.android.importClass('android.content.Intent')  
      var intent = new Intent(  
        'android.settings.action.MANAGE_OVERLAY_PERMISSION',  
        Uri.parse('package:' + pkName)  
      )  
      
      if (!Settings.canDrawOverlays(main)) {  
        // 检测悬浮窗权限  
        uni.showModal({  
          title: '权限请求',  
          content: '为了正常显示悬浮窗功能，请授予悬浮窗权限',  
          showCancel: true,  
          cancelText: '取消',  
          confirmText: '去设置',  
          success: function(res) {  
            if (res.confirm) {  
              main.startActivityForResult(intent, 5004) // 跳转到悬浮窗设置  
            }  
          }  
        })  
      } else {  
        // 已有权限，可以提示用户  
        uni.showToast({  
          title: '已获得悬浮窗权限',  
          icon: 'success',  
          duration: 1500  
        });  
      }  
    } catch (error) {  
      console.error('检查Android悬浮窗权限失败:', error);  
      uni.showToast({  
        title: '权限检查失败，请重试',  
        icon: 'none',  
        duration: 2000  
      });  
    }  
  }  
  
  const ios_overlays = () => {  
    try {  
      uni.showModal({  
        title: '提示',  
        content: 'iOS系统暂不支持悬浮窗功能',  
        showCancel: false,  
        confirmText: '我知道了'  
      });  
    } catch (error) {  
      console.error('iOS平台提示失败:', error);  
    }  
  }  
  
  // 根据平台调用不同的处理函数  
  return !isIos ? android_overlays() : ios_overlays();  
}  

/**  
 * 检查并返回悬浮窗权限状态  
 * @returns {Boolean} 是否有悬浮窗权限  
 */  
export function hasOverlayPermission() {  
  const isIos = uni.getSystemInfoSync().platform == 'ios';  
  
  if (isIos) {  
    return false; // iOS不支持悬浮窗  
  }  
  
  try {  
    var main = plus.android.runtimeMainActivity();  
    var Settings = plus.android.importClass('android.provider.Settings');  
    return Settings.canDrawOverlays(main);  
  } catch (error) {  
    console.error('获取悬浮窗权限状态失败:', error);  
    return false;  
  }  
}  

/**  
 * 请求悬浮窗权限  
 * @param {Function} callback 权限请求结果回调函数  
 */  
export function requestOverlayPermission(callback) {  
  const isIos = uni.getSystemInfoSync().platform == 'ios';  
  
  if (isIos) {  
    if (callback && typeof callback === 'function') {  
      callback(false);  
    }  
    return;  
  }  
  
  try {  
    var main = plus.android.runtimeMainActivity();  
    var Settings = plus.android.importClass('android.provider.Settings');  
    var hasPermission = Settings.canDrawOverlays(main);  
    
    if (hasPermission) {  
      if (callback && typeof callback === 'function') {  
        callback(true);  
      }  
      return;  
    }  
    
    var pkName = main.getPackageName();  
    var Uri = plus.android.importClass('android.net.Uri');  
    var Intent = plus.android.importClass('android.content.Intent');  
    var intent = new Intent(  
      'android.settings.action.MANAGE_OVERLAY_PERMISSION',  
      Uri.parse('package:' + pkName)  
    );  
    
    // 设置权限请求结果监听  
    plus.globalEvent.addEventListener('onActivityResult', function(event) {  
      if (event.requestCode === 5004) {  
        // 移除监听器，避免重复调用  
        plus.globalEvent.removeEventListener('onActivityResult', arguments.callee);  
        
        // 重新检查权限  
        var newPermissionStatus = Settings.canDrawOverlays(main);  
        if (callback && typeof callback === 'function') {  
          callback(newPermissionStatus);  
        }  
      }  
    });  
    
    main.startActivityForResult(intent, 5004);  
  } catch (error) {  
    console.error('请求悬浮窗权限失败:', error);  
    if (callback && typeof callback === 'function') {  
      callback(false);  
    }  
  }  
}