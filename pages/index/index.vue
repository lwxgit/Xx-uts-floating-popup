<template>
	<view class="page">
		<view class="uni-padding-wrap">
			<view class="uni-flex uni-column">
				<button @tap="startW()">弹窗测试</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { startFloating } from "@/uni_modules/xx-uts-floating-popup";
	export default {
		components: {
		},
		data() {
			return {
			}
		},
		onLoad() {
			
		},
		methods: {
			startW(){
				let deviceInfo = {
					deviceName: "ggggg",
					brandLogo: "https://pics4.baidu.com/feed/42a98226cffc1e17573493b9b52c0d06718de9f6.jpeg",
					deviceImage: "https://pics4.baidu.com/feed/42a98226cffc1e17573493b9b52c0d06718de9f6.jpeg"
				}
				startFloating(deviceInfo,()=>{
					console.log('触发回调')
				})
			}
		}
	}
</script>

<style>
	.page{
		height: 100vh;
		background-color: #EEEEEE;
	}
</style>
