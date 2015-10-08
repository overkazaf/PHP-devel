/**
 * @authors John Nong (overkazaf@gmail.com)
 * @date    2015-09-30 15:15:40
 * @version 1.0
 *
 * 
 * [widgetFactory for new feature that supports HTML codes loading and pre-defined widget replacing]
 * @param  {[Object]} $ [window referrence]
 * @param  {[Object]} $ [jQuery operator]
 * @return {[void]}   [description]
 */
;(function (rootWin, $){
	var 
		widgetIndicatorCache = {}; // 用于缓存原始的元素dom结构

	function WidgetFactory () {
		return new _WidgetFactory().init(arguments);
	};

	var defaults = {
		WIDGET_INDECATOR : '.widget-indicator', // a container that will be used to embed a well choosen widget
		WIDGET_COLLECTOR_CONTAINER_PREFIX : '#widget-tab-container-',
		WIDGET_COLLECTOR_TAB_PREFIX : '#widget-tab-',
		WIDGET_COLLECTOR_CTS_PREFIX : '#widget-cts-',
		WIDGET_COLLECTOR_INIT : fetchWidgetCollection, 
		WIDGET_COLLECTOR : null,
		CLASSICFIED_WIDGET_ARRAY : 'home;list;cont'.split(';')
	};


	/**
	 * [fetchWidgetCollection 抓取相应dom中的数据，建立一个分类部件的字典]
	 * @param  {Function} fn [抓取函数]
	 * @return {[type]}      [良好分类的部件]
	 */
	var fetchWidgetCollection = function (fn) {
		var cache;
		return function (){
			return cache || (cache = fn.apply(this, arguments));
		};
	};


	/**
	 * [description]
	 * @param  {[type]} ){	} [collect widget fn]
	 * @return {[type]}        [widget collection that has been well classified]
	 */
	var classifyWidgetCollection = fetchWidgetCollection(function (){
		var collection = {};
		$.each('home;list;cont'.split(';') ,function (index, widgetType){
			
			var $tab = $(defaults.WIDGET_COLLECTOR_TAB_PREFIX + widgetType),
				$tabItems = $tab.find('.widget-items-tab>.widget-item-radio'),
				$cts  = $(defaults.WIDGET_COLLECTOR_CTS_PREFIX + widgetType),
				$widgetContents = $cts.find('.widget-content'),
				subType = {};
			
			$tabItems.each(function (i){
				var specItems = [];
				var type = $(this).find('small').text();
				$widgetContents.eq(i).find('.widget-list>.widget-list-item').each(function (j, item){
					var itemJson,
						itemATag = $(this).find('a'),
						itemImgTag = itemATag.find('img'),
						itemName = itemATag.attr('alt'),
						itemUrl = $(this).attr('data-widget'),
						itemImgUrl = itemImgTag.attr('src');

					itemJson = {
						name : itemName,
						url : itemUrl,
						img : itemImgUrl,
						pos : widgetType + ";" + type
					};
					specItems.push(itemJson);
				});
				subType[type] = specItems;
				specItems = null;
			});
			collection[widgetType] = subType;
		});

		return collection;
	});


	function _WidgetFactory () {
		var self = this;
		this.rawWidgets = classifyWidgetCollection();
		this.$modal = $('#configModal');
		this.$modalBody = $('#configModal').find('.modal-body');
		this.instance = null;
		this.cacheWidgets = {}; // Mapping: url -> htmlCode
		return {
			init : function (options){
				var opt = $.extend({}, defaults, options || {});
				
				return this;
			},
			resetWidgetIndicator : function ($dom) {
				$dom.replaceWith(widgetIndicatorCache[$dom.attr('id')]);
			},
			// allow users to choose a system-defined widget
			create : function () {
				var rawWidgets = self.rawWidgets,
					$modal = self.$modal,
					$modalBody = self.$modalBody,
					instance = self.instance,
					cache,
					shopHTML,
					genNavMenuHtml = function (){
						var keys2Chinese = {
							'home' : '首页部件',
							'list' : '列表页部件',
							'cont' : '内容页部件'
						};
						var first = true;
						var html = '';
						html += '<ul class="nav nav-tabs" role="tablist">';
						for (var widgetPos in rawWidgets) {
							var className = first ? 'active' : '';
							first = false;
							html += '<li role="presentation" data-widget-pos="'+ widgetPos +'" class="'+ className +'"><a href="#">'+ keys2Chinese[widgetPos] +'</a></li>';
						}
						html += '</ul>';
						return html;
					},
					genWidgetStaticHtml = function (){
						var html = '';
						var index = 0;
						html += '<div class="col-md-2">';
						// header types
						html += '<ul class="nav nav-pills" role="tablist">';
						$.each(rawWidgets, function (idx, items){
							var widgetPosArray = ['home', 'list', 'cont'];
							for (var subTypeKey in items) {
								var wp = widgetPosArray[index];
								wp += ';' + subTypeKey;
								html += '<li role="presentation" data-widget-pos="'+wp+'"><a href="#">'+ subTypeKey +' <span class="badge">'+ items[subTypeKey].length +'</span></a></li>';
							}
							++index;
						}) 
							
						html += '</ul>';
						html += '</div>';


						html += '<hr>';
						html += '<div class="row">';
						html += '<div class="col-md-4">';
						$.each(rawWidgets, function (i, posWidget){
							$.each(posWidget, function (j, itemArray){
								//html += '<div class="col-xs-3">';
								$.each(itemArray, function (k, item){
									html += '<div data-widget-pos="'+ item['pos'] +'" class="widget-item pull-left text-center" style="width:115px;height:120px;margin-right:8px;padding-bottom:45px;">';

									html += '<div style="height:80px;padding-bottom:5px;overflow:hidden;cursor:pointer;">';
									html += '<img width="88" height="60" src="'+ item['img'] +'" title="'+ item['name'] +'"/>';
									html += '</div>';

									html += '<div class="caption" data-url="'+ item['url'] +'">';
									html += '<button class="btn btn-xs btn-success">选择部件</button>'
									html += '</div>';

									html += '</div>';
								});
								
								//html += '</div>';
							});
						});

						html += '</div>';
						html += '</div>';
						return html;
					};
				
				return self.instance = {
					constructWidgetShop : function (){
						if(shopHTML) return showHTML;
						var navMenuHtml = genNavMenuHtml();;
						var widgetStaticHtml = genWidgetStaticHtml();

						var html  = '';
							html += '<div class="col-md-5">';
							
							/* nav part */

							html += '<ul id="nav4widget" class="nav nav-tabs">';
							html += navMenuHtml;
							html += '</ul>';								
							

							/* widget part */
							html += '<div class="row">';
							html += widgetStaticHtml;
							html += '</div>';
							
							html += '</div>';
						return shopHTML = html;
					},
					displayRawWidgets : function(){
						$modalBody.html(self.instance.constructWidgetShop());
						self.instance.bindWidgetEvents();
						$modal.modal('show');
					},
					bindWidgetEvents : function (){
						var that = this;
						var posNav = $modalBody.find('#nav4widget');
						var posNavItems = posNav.find('li');
						var subTypeNav = $modalBody.find('.nav-pills>li');
						var widgets = $modalBody.find('.widget-item');

						posNavItems.on('click', function (){

							var currentPos = $(this).attr('data-widget-pos');
							if (subTypeNav.length){
								subTypeNav.each(function (){
									var widgetPos = $(this).attr('data-widget-pos');
									widgetPos = widgetPos.split(';')[0];
									if(widgetPos === currentPos){
										$(this).show();
									} else {
										$(this).hide();
									}
								});

								var $first = $modalBody.find('.nav-pills>li:visible').first();
								if($first.length){
									$first.trigger('click');
								}
							}
						});

						if (subTypeNav.length) {
							subTypeNav.on('click', function (ev){
								var currentSubType = $(this).attr('data-widget-pos');
								widgets.each(function (){
									if($(this).attr('data-widget-pos') === currentSubType){
										$(this).show();
									} else {
										$(this).hide();
									}
								});

								$modalBody.find('.nav-pills>li').filter(function (){
									return $(this).is(':visible');
								});
							});
						}

						if (widgets.length) {
							widgets.on('click', '.btn-success', function (){
								var data = $(this).closest('.caption').attr('data-url');
								var params = $.parseJSON(unescape(data));
								var ajaxObject = that.requestWidget(params);

								ajaxObject.done(function (){
									
									var newWidget = self.cacheWidgets[params.filename];
									// build setting panel and inject css/js
									// only inject css for now
									
									that.injectWidgetCSSJS(newWidget);
									// $modalBody.html(newWidget.html);
									that.embedWidget.replaceWidget($srcEl, $(newWidget.html));
								});
							});
						}
					},
					injectWidgetCSSJS : function (json){
						var css = json.css;
						if (css) {
							var cssArray = css.split(';');
							var existedCss = $('#main-wrapper').find('link');
							$.each(cssArray, function (i, href){
								var flag = true;
								$.each(existedCss, function (j, linkEl){
									var html = linkEl.prop('outerHTML');
									if(html.indexOf(href) >= 0){
										flag = false;
									}
								});

								if (flag){
									$style = $('<link>').attr({
						                rel: "stylesheet",
						                type: "text/css",
						                href: href
						              });
									$('#main-wrapper').prepend($style);
								}
							});
						}
					},
					requestWidget : function (params){
						var 
                      		attributes = jsonToString(params);
                      		attributes = StringUtil.Base64Encode(attributes);

                      	if (self.cacheWidgets[params.filename]) {
                      		return self.cacheWidgets[params.filename];
                      	}

						return $.ajax({
							type : 'GET',
							url : params.filename + '&t=' + Math.random(),
							data : {params : attributes},
							dataType : 'json',
							success : function (json){
								self.cacheWidgets[params.filename] = json;
							},
							error : function (err){
								console.log(err);
							}
						});
					},
					confirmWidgetSettings : function (){

					}
				};
			},
			// embed a widget instance and replace the indicator
			embedWidget : function () {


				return {
					replaceWidget : function($sourceElement, $targetElement){
						// generate widget UUID and replace the widget dom
						var uuid = generatorId(10, 16, 'widget', 'static');
						widgetIndicatorCache[uuid] = $sourceElement.prop('outerHTML');

						return $sourceElement.replaceWith($targetElement);

					},
					initializeWidget : function($element){
						// init potential widget events
						// 

					},
					dataBinding : function (){
						// write cache data to the widget, in case of later usage
					}
				};
			}
		};
	};
	rootWin.WidgetFactory = WidgetFactory;
	rootWin._WidgetFactory = _WidgetFactory;
})(window, jQuery);