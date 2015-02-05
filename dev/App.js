	undefined;
	var App=angular.module('App',['mgcrea.ngStrap','ui.mask','angularFileUpload','ui.bootstrap.typeahead']);
	//angular.module('App.controllers', ['App.constants']);
	//angular.module('App.constants', []).constant('_token', angular.element('meta[name=_token]')[0].content);
	//angular.module('App.constants', []).constant('_token', 'Teste');

//angular.module("App", ["ngResource","ngRoute","ngSanitize"]).run;
/** /
App.run(function($http, $location) {
  $http.get("http://stivyw.no-ip.org:120/auth").then(function(response) {
    angular.module("app").constant("CSRF_TOKEN", response.data.csrf_token);
    angular.bootstrap(document, ['app']);
  });
});
/**/

	App.service('Data', function ($http, $upload, $q) {

		return {
			debug:true,
			base: 'http://stivyw.com/Imo/public',
			tabPrefix: 'tab_',
			tabIndex:0,
			tabs:[],
			CFG:{},
			instance: function(){
				return Data;
			},
			newTab: function(p){
				p=angular.copy(p);
				p.i = this.tabs.length;
				this.tabs.push(p);
				this.tabIndex = p.i;
			},
			closeTab: function(i){
				var l = this.tabs.length-1, c = this.tabIndex;
				//return console.log(i);
				this.tabs.splice(i, 1);
				var n=0;
				for (var n = this.tabs.length - 1; n >= 0; n--) {
					this.tabs[n].i=n;
				};
				if(c > i || c==l){
					this.tabIndex--;	
				}
			},
			load:function(u){
				$http.get(this.base + '/api/v1/' + u).success(function(x){
					console.log(x);
				});
			},
			post:function(o){
				$http.post(this.base + '/api/v1/' + o.url, o.data).success(function(x){
					//console.log(x);
					o.res = x;
				});
				return o;
			},
			edit: function(o){
				var BASE = this.base + '/api/v1/';
				!o.params && (o.params = {});
				console.log(o);
				o.load=function(id,rels){
					if(id){
						
						this.id = id;
						this.scope && (this.scope.stat = 1);
						
						var url = BASE + this.url + (this.id ? '/' + this.id: '');
						
						console.log('Edit.load');
						var params = angular.copy(this.params);
						params.rels = JSON.stringify(rels);


						console.log(params);
						$http.get(url, {params:params}).success(function(x){
							o.res = x;
							console.log(x);
							o.set(o.res.item);
							if(o.res.error){
								o.scope && (o.scope.stat = 3);
							}else{
								if(o.cache)
									o.cache[x.current_page] = x;
								o.scope && (o.scope.stat = 2);
							}

						}).error(function(data, status){
							o.scope && (o.scope.stat = 3);
							o.res={error:[{message: "Verifique sua conexão com a internet."}]};
						});
					}
					return this;
				};
				//o.form = {};
				o.set=function(item){
					if(item){
						this.form = angular.copy(item);
						this.pseudo = angular.copy(item);
					}

				};
				o.save = function(){
					var dt = {}, url = BASE + this.url + (this.id ? '/' + this.id: '');
					
					if(this.form && this.res && this.res.item){
						for(var i in this.form)
							if(this.form[i]!=this.res.item[i])
								dt[i]=this.form[i];
					}else
						dt = this.form;
					console.log('Save.dt');
					console.log(dt);
					this.scope && (this.scope.stat=1);
					this.disabled = true;
					$http.post(url, dt).success(function(x){
						console.log(x);
						o.res = x;
						if(o.res.error){
							o.scope && (o.scope.stat = 3);

						}else
							o.scope && (o.scope.stat = 2);
						x && o.set(x.item);
					}).error(function(data, status){
						o.scope && (o.scope.stat = 3);
						o.res={error:[{message: "Verifique sua conexão com a internet."}]};
					});
				};
				o.toggleCancel=function(){
					this.disabled = !this.disabled;
					if(this.disabled)
						this.set(this.res.item);
					this.res && (this.res.ok = false);
				};
				return o;
			},
			upload: function(o){
				if(!o) return;
				o.res && (o.res = []);
				o.scope && (o.scope.stat = 1);
				if(o.del){
					!o.url && (o.url = 'tools/remove');
					$http.post(this.base + '/' + o.url, o.del).success(function(x){
						o.scope && (o.scope.stat = (x.error? 3 : 2));
						o.res = x;
					}).error(function(){
						o.scope && (o.scope.stat = 3);
						o.res={error:[{message: "Verifique sua conexão com a internet."}]};
					});
				}else
				if(o.fls && o.fls.length){
					var l = o.fls.length;
					!o.url && (o.url = 'tools/upload');
					o.onProgress = function(){
						var loaded = 0;
						for (var i = 0; i < this.fls.length; i++) {
							var file = this.fls[i];
							if(file.progress)
								loaded += file.progress||0;
						}
						this.loaded = loaded;
					};

					for (var i = 0; i < l; i++) {
						var file = o.fls[i];
						var res = {};
						file.progress=1;
						$upload.upload({
							url: this.base + '/' + o.url,
							//method: 'POST' or 'PUT',
							//headers: {'Authorization': 'xxx'}, // only for html5
							//withCredentials: true,
							//data: {myObj: $scope.myModelObj},
							//fileName:'file_name' ,
							//fileFormDataName: '/tmp/teste',
							file: file,
							res: res
						}).progress(function(evt) {
							evt.config.file.progress = parseInt(100.0 * evt.loaded / evt.total);
							o.onProgress && o.onProgress();
						}).success(function(data, status, headers, config) {

							//if(config.file.progress)delete config.file.progress;

							if(data.error){
								config.file.error=data.error;
								o.file && (o.file=false);
								o.files && (o.files[config.i]=false);
							}else{
								angular.forEach(data, function(value, key) {
								  this[key] = value;
								}, config.res);

							}
						});//.error(function(){	file.error = [{message:'Erro desconhecido'}];	});

						if(i==0){
							o.first = res;
							o.firstFile = file;
						}
						o.res && o.res.push(res);
					}
				}
				return o;
			},

			list: function(o){
				//o.url = this.base + '/api/v1/' + u;
				!o.params && (o.params = {});
				o.cache !== false && (o.cache = {});
				o.next=function(){
					if(this.res.current_page<this.res.last_page)
						this.set(this.res.current_page + 1);
				};
				o.prev=function(){
					if(this.res.current_page>1)
						this.set(this.res.current_page-1);
				};
				var BASE = this.base + '/api/v1/';
				o.set=function(n){
					
					if(n)
						this.params.page = (n<1 || n>this.res.last_page) ? 1:n;

					if(this.cache && this.cache[n]){
						var c = this.cache[n];
						this.res = o.cache[n];

						this.pg_label = (((c.current_page-1) * c.per_page) + 1) + '-' + 
							(c.current_page == c.last_page ? c.total : (c.current_page * c.per_page)) + '/' + 
							(c.total);
						return;
					}

					console.log('list.set');
					console.log(this.params);
					this.scope && (this.scope.stat = 1);
					$http.get(BASE + this.url, {params:this.params}).success(function(x){
						o.res = x;
						if(o.res.error){
							o.scope && (o.scope.stat = 3);
						}else{
							if(o.cache)
								o.cache[x.current_page] = x;
							o.scope && (o.scope.stat = 2);
						}
						console.log('List');
						console.log(o.res);
						o.pg_label = (((x.current_page-1) * x.per_page) + 1) + '-' + 
							(x.current_page == x.last_page ? x.total : (x.current_page * x.per_page)) + '/' + 
							(x.total);
					}).error(function(data, status){
						o.scope && (o.scope.stat = 3);
						o.res={error:[{message: "Verifique sua conexão com a internet."}]};
					});
					return this;
				};
				var count=0;
				o.options=function(fs){
					//BASE + this.url
    				//var params = {address: val, sensor: false};
 
    				count++;
    				if(this.canceller){
    					console.log('Cancelado ' + count);
    					this.canceller.resolve("user cancelled");
    					
    				}
					this.canceller = $q.defer();

					this.optionsReq = $http.get(BASE + this.url, {timeout: this.canceller.promise, params:{filters:fs}})
					 .then(function(res) {
					 		console.log('Then ' + count);
							console.log(res.data);
							return res.data.data;
						
					 });
					 
					 return this.optionsReq;
				};
				//o.set();
				console.log('List');

				return o;
			}
		};
	});
/** /
	App.config(function($httpProvider) {
	  $httpProvider.defaults.headers.common = {'X-CSRF-Token': Data.base, 'Content-Type': 'application/json'};
	});
/**/

//DIRECTIVES

var c_o = 0;
App.directive('bsTxt', function() {
  return {
    templateUrl: 'sw/bs/txt.html',
    transclude:true,
    link: function(scope, element, attr){
    	scope.name = 'obj_' + (++c_o);
    	scope.label = attr.label;
    	scope.mask = attr.mask;
    	scope.placeholder = attr.placeholder;
    	//scope.fm = scope.$parent.edit;
    },
    scope: {
    	md: '=',
    	disabled:'='

    }
  };
});
App.directive('bsCal', function() {
	
  return {
    templateUrl: 'sw/bs/cal.html',
    transclude:true,
    link: function(scope, element, attr){
    	scope.name = 'obj_' + (++c_o);
    	scope.label = attr.label;
    	//scope.mask = attr.mask;
    	scope.placeholder = attr.placeholder;
    	scope.min = attr.min;
    	scope.max = attr.max;
    	//scope.fm = scope.$parent.edit;
    },
    scope: {
    	md: '=',
    	disabled:'='

    }
  };
});
App.directive('bsSel', function() {
  return {
    templateUrl: 'sw/bs/sel.html',
    transclude:true,
    link: function(scope, element, attr){
    	scope.name = 'obj_' + (++c_o);
    	scope.label = attr.label;
    },
    scope: {
    	md: '=',
    	disabled:'=',
    	opts:'='

    }
  };
});

App.directive('bsRad', function() {
  return {
    templateUrl: 'sw/bs/rad.html',
    transclude: true,
    link: function(scope, element, attr){
    	scope.name = 'obj_' + (++c_o);
    	scope.label = attr.label;
    },
    scope: {
    	md: '=',
    	disabled:'=',
    	opts:'='

    }
  };
});
App.directive('bsUpl', function(Data) {
  return {
    templateUrl: 'sw/bs/upl.html',
    transclude: true,
    link: function(scope, element, attr){
    	scope.name = 'obj_' + (++c_o);
    	scope.label = attr.label;
    	
    	//var file=Data.file({});

    	scope.upload = function(files){
			var up = Data.upload({fls:files,res:true});
			this.file = up.firstFile;
			this.md = up.first;
    	};
    	scope.remove = function(file){
			var up = Data.upload({del:file});
			this.md = null;
			this.file = null;
    	};
    },
    scope: {
    	md: '=',
    	disabled:'='
    }
  };
});

App.directive('bsTyp', function(Data) {
  return {
    templateUrl: 'sw/bs/typ.html',
    transclude: true,
    link: function(scope, element, attr){
    	scope.name = 'obj_' + (++c_o);
    	scope.label = attr.label;
    	scope.$matches = [{nome:'NOme 1', id:1},{nome:'NOme 2', id:2},{nome:'NOme 3', id:3}];
    	scope.$selected = 2;
    	//var file=Data.file({});

    	scope.upload = function(files){
			var up = Data.upload({fls:files,res:true});
			this.file = up.firstFile;
			this.md = up.first;
    	};
    	scope.remove = function(file){
			var up = Data.upload({del:file});
			this.md = null;
			this.file = null;
    	};
    },
    scope: {
    	md: '=',
    	disabled:'='
    }
  };
});
App.directive('bsAlert', function() {
  return {
    templateUrl: 'sw/bs/alert.html',
    transclude:true,
    link: function(scope, element, attr){
    	scope.cl='alert-' + attr.type;
    },
    scope: {
    	arr: '='
    }
  };
});
App.directive('bsFooter', function() {
  return {
  	transclude:true,
    templateUrl: 'sw/bs/footer.html'
  };
});

App.directive( 'pagination', [ function(pag) {
	return {
		template: 
	'<ul class="pagination pagination-sm" ng-if="lst.res.data.length>0">' +
	'<li class="disabled" ng-if="lst.pg_label"><a class="bg-gray">{{lst.pg_label}}</a></li>' +
//	'  <li><a href="#" ng-click="firstPage()" ng-class="{disabled:currentPage==0}">&laquo;</a></li>' +
	'  <li><a href="#" ng-click="lst.prev()" ng-class="{disabled:lst.res.current_page==1}">&lsaquo;</a></li>' +
	'  <li ng-repeat="n in [] | range:lst.res.last_page" ng-class="{disabled:lst.res.current_page==$index+1}">' +
	'    <a href="#" ng-bind="n" ng-click="lst.set(n)">1</a>' +
	'  </li>' +
	'  <li><a href="#" ng-click="lst.next()" ng-class="{disabled:lst.res.current_page==lst.res.last_page}">&rsaquo;</a></li>' +
//	'  <li><a href="#" ng-click="lastPage()">&raquo;</a></li>' +
	'</ul>'
	}
 }]);
//FILTERS
App.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i+1);
    return input;
  };
});
//CONTROLLERS
	App.controller('Form', ['$scope', 'Data', function($scope, Data){

		$scope.Data = Data;
		$scope.load = function(id){
			if(id){
				this.scope && (this.scope.stat = 1);
				
				console.log('edit.load');
				console.log(this);
				var o = this;
				$http.get(BASE + this.url, {params:this.params}).success(function(x){
					o.stat = 2;
					o.disabled = true;
					o.set(x.item);
					o.res = x;
				});
			}
		};
		$scope.res = {};
		$scope.submit = function(){
			console.log(this.elements);
		};
		$scope.item = {};
		//this.$setActive(0);
	}]);
	//App.controller('Form', function($scope){$scope.SelfTab = 3;});
	App.controller('Tabs', ['$scope', 'Data', function($scope, Data){
		$scope.Data = Data;

		Data.tabs.push({title:'Home', url: 'views/home.html', i:'home', fix:true});
		Data.tabIndex = Data.tabs[0].i;

		$scope.removeItem = function(i, obj){
			this[obj] && this[obj][i]!=undefined && (delete this[obj][i]);
		};
		//this.$setActive(0);
	}]);

	App.controller('TopBar', ['$scope', '$http', 'Data', function($scope, $http, Data){
		if(window.sessionStorage) {
			$http.defaults.headers.common['X-Csrf-Token'] = sessionStorage.token || '';
		}
		

		$scope.Data=Data;

		$http.get('conf.json').
		 success(function(data, status) {
			$scope.status = status;
			Data.CFG = data;
		 }).
		 error(function(data, status) {
		 	alert('erro ao carregar script');
			$scope.status = status;
		 }
		);
		$scope.logout = function(){
			console.log('Logout');
			$http.get(Data.base + '/auth/logout').success(function(data){
				console.log(data);
				if(data.ok){
					$scope.user = null;
					window.sessionStorage && (sessionStorage.token = '');
				}
			});
		};
		$scope.login = function(verify){
			console.log('Login');

			var s = verify ? {} : {username:this.username, password:this.password};

			$http.post(Data.base + '/auth',s).success(function(data, status){
				Data.debug&&console.log(data);
				if(data && data.token){
					$http.defaults.headers.common['X-Csrf-Token'] = data.token;
					window.sessionStorage && (sessionStorage.token = data.token);
				}
				if(data.user){
					$scope.user = data.user;
				}
/** /
				else{
					$scope.user = false;
					$http.defaults.headers.common['X-Csrf-Token'] = '';
					window.sessionStorage && (sessionStorage.token = '');
				}
/**/
				$scope.password = '';
			});
		};
		$scope.check = function(){
			$http.get(Data.base + '/auth').success(function(data){
				Data.debug&&console.log(data);
				if(data && data.ok && !$scope.user){
					$scope.login(true);
					return;
				}
				if((!data || !data.ok) && $scope.user){
					$scope.user = false;
				}
			});
		};
		setInterval(function(){
			$scope.check();
		}, 10000);
		$scope.check();
		//alert(Data.menus.menu1[0].dpdown);
	}]);
