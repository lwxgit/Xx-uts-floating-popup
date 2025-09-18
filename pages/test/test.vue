<template>
  <view class="page">
    <view class="uni-padding-wrap">
      <view class="uni-title">悬浮窗测试工具</view>
      
      <!-- 基本控制区域 -->
      <view class="section">
        <view class="section-title">基本控制</view>
        <button class="control-btn primary" @tap="showFloatingWindow">显示悬浮窗</button>
        <button class="control-btn default" @tap="hideFloatingWindow">隐藏悬浮窗</button>
      </view>
      
      <!-- 自定义内容区域 -->
      <view class="section">
        <view class="section-title">自定义内容</view>
        
        <view class="form-item">
          <text class="form-label">设备名称：</text>
          <input class="form-input" v-model="deviceInfo.deviceName" placeholder="例如：AirPods"/>
        </view>
        
        <view class="form-item">
          <text class="form-label">按钮文本：</text>
          <input class="form-input" v-model="customButtonText" placeholder="例如：连接设备"/>
        </view>
        
        <view class="form-item">
          <text class="form-label">悬浮窗宽度：</text>
          <slider class="form-slider" v-model="windowWidthPercent" min="50" max="100" show-value/>
          <text class="form-note">屏幕宽度百分比 (%)</text>
        </view>
        
        <view class="form-item">
          <text class="form-label">背景颜色：</text>
          <view class="color-picker">
            <view 
              class="color-item" 
              v-for="color in colorOptions" 
              :key="color.value"
              :style="{ backgroundColor: color.value }"
              @tap="selectedColor = color.value"
            ></view>
          </view>
          <view class="selected-color">
            <text>已选择：</text>
            <view class="color-preview" :style="{ backgroundColor: selectedColor }"></view>
            <text>{{ selectedColor }}</text>
          </view>
        </view>
      </view>
      
      <!-- 高级设置区域 -->
      <view class="section">
        <view class="section-title">高级设置</view>
        
        <view class="form-item">
          <text class="form-label">显示关闭按钮：</text>
          <switch class="form-switch" v-model="showCloseButton"/>
        </view>
        
        <view class="form-item">
          <text class="form-label">可拖拽移动：</text>
          <switch class="form-switch" v-model="isDraggable"/>
        </view>
      </view>
      
      <!-- 权限检查区域 -->
      <view class="section">
        <view class="section-title">权限管理</view>
        <button class="control-btn default" @tap="checkPermission">检查悬浮窗权限</button>
        <text class="permission-status" v-if="permissionStatus">
          权限状态：{{ permissionStatus }}
        </text>
      </view>
      
      <!-- 回调信息区域 -->
      <view class="section">
        <view class="section-title">回调日志</view>
        <view class="log-area" v-if="callbackLog.length > 0">
          <view class="log-item" v-for="(log, index) in callbackLog" :key="index">
            <text class="log-time">{{ log.time }}</text>
            <text class="log-content">{{ log.content }}</text>
          </view>
        </view>
        <view class="log-empty" v-else>
          <text>暂无日志信息</text>
        </view>
        <button class="clear-log-btn" @tap="clearLogs">清空日志</button>
      </view>
    </view>
  </view>
</template>

<script>
import { startFloating } from "@/uni_modules/xx-uts-floating-popup";
import { check_overlays } from "@/utils/permission";

export default {
  components: {},
  data() {
    return {
      deviceInfo: {
        deviceName: "AirPods Pro",
        brandLogo: "",
        deviceImage: ""
      },
      customButtonText: "连接设备",
      windowWidthPercent: 90,
      selectedColor: "#FFFFFF",
      colorOptions: [
        { name: "白色", value: "#FFFFFF" },
        { name: "浅灰", value: "#F5F5F5" },
        { name: "蓝色", value: "#E3F2FD" },
        { name: "绿色", value: "#E8F5E8" },
        { name: "黄色", value: "#FFF8E1" },
        { name: "粉色", value: "#FCE4EC" }
      ],
      showCloseButton: true,
      isDraggable: false,
      permissionStatus: "",
      callbackLog: []
    };
  },
  onLoad() {
    // 初始化时检查权限状态
    this.checkPermission(true);
  },
  methods: {
    showFloatingWindow() {
      // 检查权限
      const isIos = uni.getSystemInfoSync().platform == 'ios';
      
      if (!isIos) {
        const hasPermission = this.checkPermission(false);
        if (!hasPermission) {
          return;
        }
      } else {
        uni.showToast({
          title: 'iOS暂不支持悬浮窗功能',
          icon: 'none'
        });
        return;
      }
      
      try {
        // 创建配置对象，整合所有自定义选项
        const config = {
          deviceName: this.deviceInfo.deviceName,
          brandLogo: this.deviceInfo.brandLogo,
          deviceImage: this.deviceInfo.deviceImage,
          buttonText: this.customButtonText,
          widthPercent: this.windowWidthPercent,
          backgroundColor: this.selectedColor,
          showClose: this.showCloseButton,
          draggable: this.isDraggable
        };
        
        // 显示悬浮窗
        startFloating(config, () => {
          const log = {
            time: new Date().toLocaleTimeString(),
            content: '悬浮窗被点击，触发回调'
          };
          this.callbackLog.unshift(log);
          
          // 最多保留20条日志
          if (this.callbackLog.length > 20) {
            this.callbackLog.pop();
          }
          
          uni.showToast({
            title: '悬浮窗被点击',
            icon: 'success'
          });
        });
        
        // 添加日志
        const log = {
          time: new Date().toLocaleTimeString(),
          content: '悬浮窗显示请求已发送'
        };
        this.callbackLog.unshift(log);
        
      } catch (error) {
        console.error('显示悬浮窗失败:', error);
        const log = {
          time: new Date().toLocaleTimeString(),
          content: '显示悬浮窗失败: ' + error.message
        };
        this.callbackLog.unshift(log);
        
        uni.showToast({
          title: '显示悬浮窗失败',
          icon: 'none'
        });
      }
    },
    
    hideFloatingWindow() {
      // 目前没有直接隐藏的API，这里是模拟操作
      try {
        // 可以尝试通过其他方式隐藏悬浮窗
        const log = {
          time: new Date().toLocaleTimeString(),
          content: '尝试隐藏悬浮窗'
        };
        this.callbackLog.unshift(log);
        
        uni.showToast({
          title: '请点击悬浮窗上的关闭按钮',
          icon: 'none'
        });
      } catch (error) {
        console.error('隐藏悬浮窗失败:', error);
      }
    },
    
    checkPermission(silent = false) {
      try {
        const isIos = uni.getSystemInfoSync().platform == 'ios';
        
        if (isIos) {
          this.permissionStatus = 'iOS暂不支持悬浮窗权限检查';
          return false;
        }
        
        // 获取Android权限状态
        const main = plus.android.runtimeMainActivity();
        const Settings = plus.android.importClass('android.provider.Settings');
        const hasPermission = Settings.canDrawOverlays(main);
        
        this.permissionStatus = hasPermission ? '已获得悬浮窗权限' : '未获得悬浮窗权限';
        
        if (!silent && !hasPermission) {
          check_overlays();
        }
        
        return hasPermission;
      } catch (error) {
        console.error('检查权限失败:', error);
        this.permissionStatus = '权限检查失败';
        return false;
      }
    },
    
    clearLogs() {
      this.callbackLog = [];
      uni.showToast({
        title: '日志已清空',
        icon: 'success'
      });
    }
  }
};
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 40rpx;
}

.uni-padding-wrap {
  padding: 30rpx;
}

.uni-title {
  font-size: 48rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
  color: #333;
}

.section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #eee;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.form-slider {
  width: 100%;
  margin: 10rpx 0;
}

.form-note {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15rpx;
}

.color-item {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  margin-bottom: 15rpx;
  border: 2rpx solid #eee;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
}

.selected-color {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
}

.color-preview {
  width: 40rpx;
  height: 40rpx;
  border-radius: 6rpx;
  margin: 0 15rpx;
  border: 1rpx solid #ddd;
}

.form-switch {
  float: right;
  transform: scale(0.8);
}

.control-btn {
  margin-bottom: 20rpx;
  width: 100%;
}

.control-btn.primary {
  background-color: #007aff;
}

.control-btn.default {
  background-color: #f5f5f5;
  color: #333;
}

.permission-status {
  display: block;
  text-align: center;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.log-area {
  max-height: 300rpx;
  overflow-y: auto;
  border: 1rpx solid #eee;
  border-radius: 10rpx;
  padding: 15rpx;
  background-color: #f9f9f9;
}

.log-item {
  margin-bottom: 15rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #eee;
}

.log-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.log-time {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-bottom: 5rpx;
}

.log-content {
  display: block;
  font-size: 26rpx;
  color: #666;
  word-break: break-all;
}

.log-empty {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 26rpx;
}

.clear-log-btn {
  margin-top: 15rpx;
  background-color: #f5f5f5;
  color: #666;
  font-size: 26rpx;
  height: 70rpx;
  line-height: 70rpx;
}
</style>