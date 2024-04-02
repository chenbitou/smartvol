

module.exports = { //club 
	PROJECT_COLOR: '#1ad7b9',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#1ad7b9',


	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
		{ title: '用户使用协议', key: 'SETUP_YS' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [ 
	],
	USER_CHECK_FORM: {
		name: 'formName|must|string|min:1|max:30|name=昵称',
		mobile: 'formMobile|must|mobile|name=手机',
		pic: 'formPic|must|string|name=头像',
		forms: 'formForms|array'
	},


	NEWS_NAME: '公告通知',
	NEWS_CATE: [
		{ id: 1, title: '公告通知' },

	],
	NEWS_FIELDS: [
	],

	ACTIVITY_NAME: '活动',
	ACTIVITY_CATE: [
		{ id: 1, title: '活动' },
	],
	ACTIVITY_FIELDS: [
		{ mark: 'city', title: '城市', type: 'area', ext: { city: true }, must: true },
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'swiper', title: '轮播图图片', type: 'image', min: 1, max: 1, must: false },
		{ mark: 'desc', title: '活动介绍', type: 'content', must: true }, 

	],
	ACTIVITY_FIELDS2: [
		{ mark: 'plat', title: '活动平台', type: 'text', must: true },
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'swiper', title: '轮播图图片', type: 'image', min: 1, max: 1, must: false },
		{ mark: 'desc', title: '活动介绍', type: 'content', must: true }, 

	],
	ACTIVITY_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, max: 30 },
		{ mark: 'phone', type: 'mobile', title: '手机', must: true, edit: false, ext: { hidden: true } }
	],


	COMMENT_NAME: '评价',
	COMMENT_FIELDS: [
		{ mark: 'content', title: '评价内容', type: 'textarea', must: true },
		{ mark: 'img', title: '图片', type: 'image', min: 0, max: 8, must: false },

	],

}