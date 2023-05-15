<script>
	import { check_overlays } from "@/utils/permission";
	export default {
		onLaunch: function() {
			check_overlays()
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
</style>
