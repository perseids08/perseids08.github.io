(function (root) {
  "use strict";

  // This file intentionally has no DOM or module dependency, including on file://.
  var IMAGE_KEYS = ["", "tomato", "pork", "wings", "greens", "curry", "soup"];
  var MAX_DISHES = 500;
  var MAX_ORDERS = 1000;
  var MAX_RAW_LENGTH = 2 * 1024 * 1024;

  function fail(message) {
    throw new Error(message);
  }

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function record(value, label) {
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      fail(label + "格式不正确。");
    }
  }

  function fields(value, required, optional, label) {
    record(value, label);
    if (required.some(function (key) {
      return !Object.prototype.hasOwnProperty.call(value, key);
    }) || Object.keys(value).some(function (key) {
      return required.indexOf(key) === -1 && optional.indexOf(key) === -1;
    })) {
      fail(label + "字段不完整或包含无法识别的字段。");
    }
  }

  function string(value, maxLength, allowEmpty, label, normalize) {
    if (typeof value !== "string") fail(label + "必须是文字。");
    var result = normalize ? value.trim() : value;
    if ((!allowEmpty && !result.trim()) || Array.from(result).length > maxLength) {
      fail(label + (allowEmpty ? "不能超过 " : "需填写 1 至 ") + maxLength + " 个字。");
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)) {
      fail(label + "包含不支持的控制字符。");
    }
    return result;
  }

  function id(value) {
    var result = string(value, 80, false, "编号", false);
    if (result !== result.trim() || /[\r\n\t]/.test(result)) {
      fail("编号不能包含首尾空格、换行或制表符。");
    }
    return result;
  }

  function cooks(value) {
    if (value !== 1 && value !== 2 && value !== 3) {
      fail("请选择会做这道菜的人（我、他或我们都会）。");
    }
    return value;
  }

  function image(value) {
    if (IMAGE_KEYS.indexOf(value) === -1) fail("菜品图片必须使用内置的本地图片。");
    return value;
  }

  function timestamp(value) {
    if (!Number.isSafeInteger(value) || value < 0 || value > 8640000000000000) fail("保存时间格式不正确。");
    return value;
  }

  function savedDish(value) {
    fields(value, ["id", "name", "description", "cooks", "image", "createdAt"], [], "菜品");
    return {
      id: id(value.id),
      name: string(value.name, 30, false, "菜名", false),
      description: string(value.description, 80, true, "菜品介绍", false),
      cooks: cooks(value.cooks),
      image: image(value.image),
      createdAt: timestamp(value.createdAt)
    };
  }

  function uniqueDishes(values, allowEmpty) {
    if (!Array.isArray(values) || values.length > MAX_DISHES || (!allowEmpty && !values.length)) {
      fail("菜品列表格式不正确，最多支持 " + MAX_DISHES + " 道菜。");
    }
    var seen = new Set();
    return values.map(function (value) {
      var dish = savedDish(value);
      if (seen.has(dish.id)) fail("菜品列表存在重复编号。");
      seen.add(dish.id);
      return dish;
    });
  }

  function state(value) {
    fields(value, ["version", "dishes", "orders"], [], "保存的数据");
    if (value.version !== 1) fail("保存的数据版本不受支持。");
    var dishes = uniqueDishes(value.dishes, true);
    if (!Array.isArray(value.orders) || value.orders.length > MAX_ORDERS) {
      fail("订单列表格式不正确，最多支持 " + MAX_ORDERS + " 个订单。");
    }
    var seen = new Set();
    var orders = value.orders.map(function (value) {
      fields(value, ["id", "items", "createdAt"], [], "订单");
      var orderId = id(value.id);
      if (seen.has(orderId)) fail("订单列表存在重复编号。");
      seen.add(orderId);
      return {id: orderId, items: uniqueDishes(value.items, false), createdAt: timestamp(value.createdAt)};
    });
    return {version: 1, dishes: dishes, orders: orders};
  }

  function draftDish(value) {
    fields(value, ["id", "name", "description", "cooks"], ["image"], "菜品");
    var dish = {
      id: id(value.id),
      name: string(value.name, 30, false, "菜名", true),
      description: string(value.description, 80, true, "菜品介绍", true),
      cooks: cooks(value.cooks)
    };
    if (Object.prototype.hasOwnProperty.call(value, "image")) dish.image = image(value.image);
    return dish;
  }

  function storageError(error, writing) {
    var quota = error && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22 || error.code === 1014);
    if (quota) return new Error("浏览器存储空间不足，本次修改未保存，原有数据保持不变。请释放空间后重试。");
    return new Error(writing
      ? "浏览器无法保存数据，本次修改未保存，原有数据保持不变。请检查浏览器的本地存储权限后重试。"
      : "浏览器无法读取本地数据。请检查浏览器的本地存储权限后重试。");
  }

  function KitchenStorage(storage, key, seedDishes) {
    if (!(this instanceof KitchenStorage)) return new KitchenStorage(storage, key, seedDishes);
    try {
      if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
        fail("浏览器不支持本地存储。");
      }
    } catch (error) {
      throw storageError(error, false);
    }
    this._storage = storage;
    this._key = string(key, 8192, false, "存储名称", false);
    this._seed = uniqueDishes(seedDishes, true);
  }

  KitchenStorage.prototype._save = function (value) {
    var clean = state(value);
    var raw = JSON.stringify(clean);
    if (raw.length > MAX_RAW_LENGTH) fail("保存的数据过大，本次修改未保存，原有数据保持不变。");
    try {
      // Web Storage setItem is atomic: failures leave the previous value intact.
      this._storage.setItem(this._key, raw);
    } catch (error) {
      throw storageError(error, true);
    }
    return copy(clean);
  };

  KitchenStorage.prototype.read = function () {
    var raw;
    try {
      raw = this._storage.getItem(this._key);
    } catch (error) {
      throw storageError(error, false);
    }
    if (raw === null) return this._save({version: 1, dishes: copy(this._seed), orders: []});
    try {
      if (typeof raw !== "string" || raw.length > MAX_RAW_LENGTH) fail("数据长度不正确。");
      return state(JSON.parse(raw));
    } catch (error) {
      fail("本地保存的数据已损坏或版本不兼容。原数据已保留，请先备份后再处理；本次操作未保存。");
    }
  };

  KitchenStorage.prototype.createDish = function (value) {
    var dish = draftDish(value);
    var current = this.read();
    if (current.dishes.some(function (item) { return item.id === dish.id; })) fail("这道菜的编号已存在，请重新尝试。");
    if (current.dishes.length >= MAX_DISHES) fail("菜谱最多支持 " + MAX_DISHES + " 道菜，请先删除不需要的菜品。");
    dish.image = dish.image || "";
    dish.createdAt = Date.now();
    current.dishes.unshift(dish);
    return this._save(current);
  };

  KitchenStorage.prototype.updateDish = function (value) {
    var dish = draftDish(value);
    var current = this.read();
    var index = current.dishes.findIndex(function (item) { return item.id === dish.id; });
    if (index === -1) fail("这道菜已被删除，请刷新后重试。");
    dish.image = Object.prototype.hasOwnProperty.call(dish, "image") ? dish.image : current.dishes[index].image;
    dish.createdAt = current.dishes[index].createdAt;
    current.dishes[index] = dish;
    return this._save(current);
  };

  KitchenStorage.prototype.deleteDish = function (dishId) {
    dishId = id(dishId);
    var current = this.read();
    var index = current.dishes.findIndex(function (item) { return item.id === dishId; });
    if (index === -1) fail("这道菜已被删除，请刷新后重试。");
    current.dishes.splice(index, 1);
    return this._save(current);
  };

  KitchenStorage.prototype.createOrder = function (value) {
    fields(value, ["id", "dishIds"], [], "订单");
    var orderId = id(value.id);
    if (!Array.isArray(value.dishIds) || !value.dishIds.length || value.dishIds.length > MAX_DISHES) {
      fail("请先选择菜品，每个订单最多支持 " + MAX_DISHES + " 道菜。");
    }
    var dishIds = Array.from(new Set(value.dishIds.map(id)));
    var current = this.read();
    // A replay returns the saved order even if those dishes have since changed.
    if (current.orders.some(function (order) { return order.id === orderId; })) return copy(current);
    if (current.orders.length >= MAX_ORDERS) fail("订单已达到 " + MAX_ORDERS + " 个的存储上限，本次订单未保存。");
    var items = dishIds.map(function (dishId) {
      var dish = current.dishes.find(function (item) { return item.id === dishId; });
      if (!dish) fail("有菜品已被删除，请重新选择后提交订单。");
      return copy(dish);
    });
    current.orders.unshift({id: orderId, items: items, createdAt: Date.now()});
    return this._save(current);
  };

  root.KitchenStorage = KitchenStorage;
})(globalThis);
