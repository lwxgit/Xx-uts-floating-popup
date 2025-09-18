<template>
	<view class="page">
		<!-- 头部信息 -->
		<view class="header">
			<image class="logo" src="/static/logo.png"></image>
			<text class="title">UTS 悬浮窗示例</text>
			<text class="subtitle">基于 UniApp 和 UTS 开发的安卓悬浮窗组件</text>
		</view>
		
		<!-- 主要内容 -->
		<view class="content">
			<!-- 基本功能区 -->
			<view class="section">
				<view class="section-title">快速开始</view>
				<button class="primary-btn" @tap="startFloatingWindow">显示悬浮窗</button>
				<button class="default-btn" @tap="checkPermission">检查悬浮窗权限</button>
			</view>
			
			<!-- 权限状态区 -->
			<view class="section" v-if="permissionStatus">
				<view class="section-title">权限状态</view>
				<view class="permission-status" :class="permissionStatusClass">
					<text>{{ permissionStatus }}</text>
				</view>
			</view>
			
			<!-- 功能说明区 -->
			<view class="section">
				<view class="section-title">功能说明</view>
				<view class="feature-list">
					<view class="feature-item">
						<text class="feature-icon">✓</text>
						<text class="feature-text">安卓系统悬浮窗显示</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">✓</text>
						<text class="feature-text">点击事件回调处理</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">✓</text>
						<text class="feature-text">后台应用唤醒</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">⚠</text>
						<text class="feature-text">iOS系统暂不支持</text>
					</view>
				</view>
			</view>
			
			<!-- 测试工具入口 -->
			<view class="section">
				<view class="section-title">高级功能</view>
				<button class="primary-btn" @tap="navigateToTestPage">进入测试工具</button>
				<text class="test-page-desc">测试工具提供更多自定义选项和详细日志</text>
			</view>
			
			<!-- 使用提示区 -->
			<view class="section tips">
				<view class="section-title">使用提示</view>
				<view class="tips-content">
					<text class="tip-item">1. 首次使用需要授予悬浮窗权限</text>
					<text class="tip-item">2. 点击悬浮窗上的按钮可返回应用</text>
					<text class="tip-item">3. 点击关闭按钮可移除悬浮窗</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { startFloating } from "@/uni_modules/xx-uts-floating-popup";
	import { check_overlays, hasOverlayPermission } from "@/utils/permission";
	export default {
		components: {},
		data() {
			return {
				permissionStatus: '',
				permissionStatusClass: ''
			}
		},
		onLoad() {
			// 页面加载时检查权限状态
			this.updatePermissionStatus();
		},
		onShow() {
			// 页面显示时再次检查权限状态，确保用户从设置返回后能看到最新状态
			this.updatePermissionStatus();
		},
		methods: {
			// 启动悬浮窗
			startFloatingWindow() {
				const isIos = uni.getSystemInfoSync().platform == 'ios';
				
				if (isIos) {
					uni.showModal({
						title: '提示',
						content: 'iOS系统暂不支持悬浮窗功能',
						showCancel: false
					});
					return;
				}
				
				// 检查权限
				if (!hasOverlayPermission()) {
					uni.showModal({
						title: '权限提示',
						content: '需要先授予悬浮窗权限才能显示悬浮窗',
						showCancel: true,
						confirmText: '去设置',
						success: (res) => {
							if (res.confirm) {
								check_overlays();
							}
						}
					});
					return;
				}
				
				try {
					// 创建设备信息对象
					let deviceInfo = {
						deviceName: "AirPods Pro",
						brandLogo: "",
						deviceImage: ""
					}
					
					// 启动悬浮窗
					startFloating(deviceInfo, () => {
						console.log('悬浮窗被点击，触发回调');
						uni.showToast({
							title: '悬浮窗被点击',
							icon: 'success'
						});
					});
					
					// 提示用户
					uni.showToast({
						title: '悬浮窗已显示',
						icon: 'success'
					});
				} catch (error) {
					console.error('启动悬浮窗失败:', error);
					uni.showToast({
						title: '启动悬浮窗失败',
						icon: 'none'
					});
				}
			},
			
			// 检查权限
			checkPermission() {
				check_overlays();
				// 延迟更新权限状态
				setTimeout(() => {
					this.updatePermissionStatus();
				}, 1000);
			},
			
			// 更新权限状态
			updatePermissionStatus() {
				const isIos = uni.getSystemInfoSync().platform == 'ios';
				
				if (isIos) {
					this.permissionStatus = 'iOS系统暂不支持悬浮窗';
					this.permissionStatusClass = 'status-ios';
				} else {
					try {
						const hasPermission = hasOverlayPermission();
						this.permissionStatus = hasPermission ? '已获得悬浮窗权限' : '未获得悬浮窗权限';
						this.permissionStatusClass = hasPermission ? 'status-granted' : 'status-denied';
					} catch (error) {
						this.permissionStatus = '权限检查失败';
						this.permissionStatusClass = 'status-error';
					}
				}
			},
			
			// 跳转到测试页面
			navigateToTestPage() {
				uni.navigateTo({
					url: '/pages/test/test'
				});
			}
		}
	}
</script>

<style scoped>
	.page {
		height: 100vh;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
	}
	
	.header {
		background-color: #007aff;
		padding: 40rpx 30rpx;
		text-align: center;
		color: #fff;
	}
	
	.logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;
		margin: 0 auto 20rpx;
	}
	
	.title {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.subtitle {
		display: block;
		font-size: 28rpx;
		opacity: 0.9;
	}
	
	.content {
		flex: 1;
		padding: 30rpx;
		overflow-y: auto;
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
		margin-bottom: 25rpx;
		color: #333;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #eee;
	}
	
	.primary-btn {
		background-color: #007aff;
		color: #fff;
		margin-bottom: 20rpx;
	}
	
	.default-btn {
		background-color: #f5f5f5;
		color: #333;
	}
	
	.permission-status {
		padding: 20rpx;
		border-radius: 10rpx;
		text-align: center;
		font-size: 30rpx;
	}
	
	.status-granted {
		background-color: #e8f5e8;
		color: #4caf50;
	}
	
	.status-denied {
		background-color: #ffebee;
		color: #f44336;
	}
	
	.status-error {
		background-color: #fff3e0;
		color: #ff9800;
	}
	
	.status-ios {
		background-color: #e3f2fd;
		color: #2196f3;
	}
	
	.feature-list {
		margin-left: 20rpx;
	}
	
	.feature-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.feature-item:last-child {
		margin-bottom: 0;
	}
	
	.feature-icon {
		font-size: 30rpx;
		margin-right: 20rpx;
		width: 40rpx;
		text-align: center;
	}
	
	.feature-text {
		font-size: 30rpx;
		color: #666;
	}
	
	.test-page-desc {
		display: block;
		text-align: center;
		margin-top: 15rpx;
		font-size: 26rpx;
		color: #999;
	}
	
	.tips {
		background-color: #f9f9f9;
	}
	
	.tips-content {
		margin-left: 20rpx;
	}
	
	.tip-item {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 15rpx;
	}
	
	.tip-item:last-child {
		margin-bottom: 0;
	}
</style>
