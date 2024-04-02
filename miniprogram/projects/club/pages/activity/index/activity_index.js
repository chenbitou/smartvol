const behavior = require('activity_index_bh.js');

Page({
	behaviors: [behavior],
	data: {
		route: 'activity/offline_list',
	},

	bindCityTap: function (e) {
		wx.reLaunch({
			url: 'activity_index',
		});
	},

})