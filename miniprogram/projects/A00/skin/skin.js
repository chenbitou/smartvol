module.exports = {
	PID: 'A00', //志愿者

	NAV_COLOR: '#ffffff',
	NAV_BG: '#00A8C1',

	MEET_NAME: '活动', 

	MENU_ITEM: ['首页', '活动日历', '我的'], // 第1,4,5菜单

	NEWS_CATE: '1=资讯,2=爱心榜|leftbig2,3=志愿风采|bigtext,4=品牌项目|leftbig3',
	MEET_TYPE: '1=志愿培训报名|leftbig2,2=志愿活动报名|leftbig3',

	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		}
	]
}