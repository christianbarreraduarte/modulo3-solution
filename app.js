(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('menuList', MenuListDirective)
;

function MenuListDirective() {
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
      items: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller: MenuListDirectiveController,
    controllerAs: 'menu',
    bindToController: true
  };
  return ddo;
}

function MenuListDirectiveController() {
  var menu = this;
  menu.foundElements = function () {
    if (menu.items===undefined){
      return false
    }
    else{
      if (menu.items.length>0) {
        return true;
      }
    }
    return false;
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {

  var menu = this;

  var promise = MenuSearchService.getAllMenuItems();
  menu.title = "Found Items List";
  menu.cadenaDeBusqueda = "rice";
  var losItems;

  promise.then(function (response) {
    losItems = response.data;
  })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  menu.getMatchedMenuItems = function (searchString) {
    menu.items = MenuSearchService.getMatchedMenuItems(searchString, losItems);
  };

  menu.removeItem = function (itemIndex) {
    menu.items.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  service.getAllMenuItems = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    });
    return response;
  };
  service.getMatchedMenuItems = function (cadenaDeBusqueda, unArray) {
    var encontrados = [];
    var contador = 0;
    if (cadenaDeBusqueda!="")
    {
      for (var i = 0; i < unArray.menu_items.length; i++) {
        var name = unArray.menu_items[i].name;
        if (name.toLowerCase().indexOf(cadenaDeBusqueda.toLowerCase()) !== -1) {
          encontrados[contador] = unArray.menu_items[i];
          contador += 1;
        }
      }
    }
    else {
      console.log("empty search string detected")
    }
    return encontrados;
  };
}

})();
