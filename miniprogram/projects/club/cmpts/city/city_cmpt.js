const cityJson = require('./city_data.js');
const cityOld = require('./city_items.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cacheHelper = require('../../../../helper/cache_helper.js');
const CACHE_CITY = 'CACHE_CITY';
const CACHE_REGION = 'CACHE_REGION';
const REGION_TOKEN_EXPIRE = 86400 * 720;

const app = getApp();

Component({
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	properties: {
		isCustomBar: {
			type: Boolean,
			value: false
		},
		nowCity: { //当前城市
			type: String,
			value: ''
		},
		defaultCity: {
			type: String,
			value: '北京'
		},
		showCityList: {
			type: Boolean,
			value: false
		},
		haveHistory: {
			type: Boolean,
			value: true
		},

		scrollWithAnimation: {
			type: Boolean,
			value: true
		}
	},
	data: {
		customBarHeight: 0,

		citys: [],
		hotCitys: [],
		historyCitys: [],
		locationCity: '',
		scrollWord: 'location',
		currentActive: 'location',
		searchRes: [],
		remindHide: true,
		remindWord: '...',
		scrollHeight: 500
	},
	lifetimes: {
		created() {


		},
		attached() {
			console.log(app.globalData);
		},
		ready() {
			if (this.data.isCustomBar) {
				this.setData({
					customBarHeight: app.globalData.customBarHeight
				})
			}


			let data = cityJson;

			let citys = [];
			for (const { subLevelModelList } of data.data
				.cityList) {
				for (const city of subLevelModelList) {
					const findRes = citys.find(
						v => v[0] === city.firstChar.toUpperCase()
					);
					if (findRes) {
						findRes[1].push(city);
					} else {
						citys.push([
							city.firstChar.toUpperCase(),
							[city]
						]);
					}
				}
			}
			citys = citys.sort();
			//console.log(citys)
			let historyCitys =
				wx.getStorageSync('$city_choose_history') || [];
			this.setData(
				{
					locationCity: data.data.locationCity,
					hotCitys: data.data.hotCityList,
					...this.diff('citys', citys),
					...this.diff(
						'historyCitys',
						historyCitys.reverse()
					),
					choosedCitys: data.data.locationCity
				}
			);

			// 当前城市
			let nowCity = cacheHelper.get(CACHE_CITY, this.data.defaultCity);
			if (!nowCity) {
				this.setData({
					showCityList: true
				});
				return;
			}
			this.setData({
				nowCity
			});

			/*
			return new Promise(resolve =>
				wx.getSystemInfo({ success: resolve })
			)
				.then(({ windowHeight }) => {
					const query = wx.createSelectorQuery().in(this);
					query.select('#scroll-view').boundingClientRect();
					query.selectViewport();
					query.exec(res =>
						this.setData({
							scrollHeight: windowHeight - res[0].top
						})
					);
				})
				.catch(console.error);*/
		},



	},
	pageLifetimes: {
		show() {
			console.log('show')
			// 当前城市
			let nowCity = this.getCity();
			this.setData({
				nowCity
			});
		}
	},

	methods: {
		bindShowTap: function (e) {
			this.setData({
				showCityList: true
			}, () => {
				return new Promise(resolve =>
					wx.getSystemInfo({ success: resolve })
				)
					.then(({ windowHeight }) => {
						const query = wx.createSelectorQuery().in(this);
						query.select('#scroll-view').boundingClientRect();
						query.selectViewport();
						query.exec(res =>
							this.setData({
								scrollHeight: windowHeight - res[0].top
							})
						);
					})
					.catch(console.error);
			});

		},
		setCity({ currentTarget: { dataset } }) {
			console.log(dataset.choosedCitys)
			let choosedCitys = dataset.choosedCitys;
			let name = choosedCitys.name;


			let historyCitys = this.data.historyCitys;
			const findIndex = historyCitys.findIndex(
				({ code }) => code === choosedCitys.code
			);
			findIndex >= 0 && historyCitys.splice(findIndex, 1);
			historyCitys.reverse().push(choosedCitys);
			historyCitys.length > 4 && historyCitys.splice(0, 1);
			wx.setStorage({
				key: '$city_choose_history',
				data: historyCitys
			});

			// 从城市找出行政单位
			for (let k = 0; k < cityOld.length; k++) {
				for (let j = 0; j < cityOld[k].children.length; j++) {

					if (cityOld[k].children[j].startsWith(name)) {
						console.log([cityOld[k].name, cityOld[k].children[j]]);

						let cb = () => {
							this.setRegion([cityOld[k].name, cityOld[k].children[j], '全部']);
							this.setData({
								showCityList: false,
								nowCity: cityOld[k].children[j]
							});

							this.triggerEvent('select');
						}
						pageHelper.showNoneToast('正在为您切换到' + cityOld[k].children[j], 1500, cb);

						return;
					}
				}
			}


			this.setData(dataset);
		},

		setWord({ currentTarget: { dataset } }) {
			let remindWord = dataset.scrollWord;
			if (remindWord === 'location') {
				remindWord = '当';
			} else if (remindWord === 'hot') {
				remindWord = '热';
			}
			this.setData({ ...dataset, remindWord, remindHide: false }, () => {
				const remindTime = setTimeout(
					() =>
						this.setData({ remindHide: true }, () =>
							clearTimeout(remindTime)
						),
					500
				);
			});
		},

		search({ detail: { value } }) {
			value = value.trim();
			if (value.length === 0 && this.data.searchRes.length > 0) {
				this.setData({ searchRes: [] });
			} else if (value.length > 0) {
				const searchRes = this.data.citys
					.map(city =>
						city[1].filter(
							({ name, firstChar }) =>
								name.includes(value) ||
								firstChar === value ||
								firstChar.toUpperCase() === value
						)
					)
					.reduce((acc, val) => acc.concat(val), []);
				this.setData({ searchRes });
			}
		},

		confirm() {

			this.setData({
				showCityList: false
			})
		},

		/**
		 * 优化setData数据
		 */
		diff: (key, arr) =>
			arr.reduce(
				(data, v, i) => Object.assign(data, { [`${key}[${i}]`]: v }),
				{}
			),

		getCity() {
			let token = cacheHelper.get(CACHE_CITY);
			if (!token) {
				this.setRegion(['北京市', '北京市', '全部']);
				return '北京市';
				return '';
			}
			return token;
		},

		getRegion() {
			let token = cacheHelper.get(CACHE_REGION);
			if (!token || !Array.isArray(token) || token.length != 3) {
				this.setRegion(['北京市', '北京市', '全部']);
				return null;
			}
			return token;
		},

		setRegion(region) {
			if (!region || !Array.isArray(region) || region.length < 2) return;

			cacheHelper.set(CACHE_REGION, region, REGION_TOKEN_EXPIRE);
			cacheHelper.set(CACHE_CITY, region[1], REGION_TOKEN_EXPIRE);
		}
	}
});
