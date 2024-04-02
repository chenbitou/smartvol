const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../helper/time_helper.js');
const cacheHelper = require('../../../../../helper/cache_helper.js');
const ActivityBiz = require('../../../biz/activity_biz.js');
const projectSetting = require('../../../public/project_setting.js');

module.exports = Behavior({
	/**
	 * 页面的初始数据
	 */
	data: { 

		isLoad: false,
		_params: null,

		sortMenus: [],
		sortItems: [],

		isShowCate: projectSetting.ACTIVITY_CATE.length > 1
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			ProjectBiz.initPage(this);

			let city = cacheHelper.get('CACHE_CITY', '北京市');
			this.setData({
				city
			});

			if (options && options.s) {
				cacheHelper.set('share', options.s, 86400 * 365);
			}

			if (options && options.id) {
				this.setData({
					isLoad: true,
					_params: {
						cateId: options.id,
					}
				});
				ActivityBiz.setCateTitle();
			} else {
				this._getSearchMenu();
				this.setData({
					_params: {
						sortType: 'run',
						sortVal: city,
					},

					isLoad: true
				});
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () { },

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: async function () {

		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function () {

		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function () {

		},

		url: async function (e) {
			pageHelper.url(e, this);
		},

		bindCommListCmpt: function (e) {
			pageHelper.commListListener(this, e);

			if (this.data.dataList && this.data.dataList.type != 'run') return;


			let today = '';

			if (!this.data.dataList || !this.data.dataList.list) return;
			let list = this.data.dataList.list;

			for (let k = 0; k < list.length; k++) {
				if (today != list[k].ACTIVITY_START_DAY) {
					today = list[k].ACTIVITY_START_DAY;
					list[k].mark = today;
					list[k].mon = Number(today.split('-')[1]);

					let mark1 = timeHelper.timestamp2Time(list[k].ACTIVITY_START, '月D日');
					list[k].mark1 = mark1 + ' ' + timeHelper.week(today);
				}
			}

			this.setData({ 'dataList.list': list });
		},


		onShareAppMessage: function () {

		}, 

		_getSearchMenu: function () {
			let city = cacheHelper.get('CACHE_CITY', '北京市');

			let sortItem1 = [{
				label: '全部',
				type: 'cateId',
				value: ''
			}];

			if (ActivityBiz.getCateList().length > 1)
				sortItem1 = sortItem1.concat(ActivityBiz.getCateList());

			let sortItems = [];
			let sortMenus = [
				{ label: '即将进行', type: 'run', value: city },
				{ label: '历史活动', type: 'his', value: city },
			];
			this.setData({
				sortItems,
				sortMenus
			})

		},
	}

});