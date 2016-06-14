function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
var Store = function(name) {
	//通过键值对获取值 
  this.name = name; 
  var store = localStorage.getItem(this.name);
  
  this.data = (store && JSON.parse(store)) || {}; 
  
};

_.extend(Store.prototype, {
  save: function() {
  	console.log("save");
    localStorage.setItem(this.name, JSON.stringify(this.data));
  },
  create: function(model) {
    if (!model.id) model.id = model.attributes.id = guid();
    this.data[model.id] = model;
    console.log("create");
    this.save();
    return model;
  },
  update: function(model) {
    this.data[model.id] = model;
     console.log("update");
    this.save();
    return model;
  },
  find: function(model) {
  	 console.log("find");
    return this.data[model.id];
  },
  findAll: function() {
  	 console.log("findAll");  console.log(_.values(this.data));
    return _.values(this.data);
  
  },
  destroy: function(model) {
  	console.log(model);
  	 console.log("destroy");
    delete this.data[model.id];
    this.save();
    return model;
  }
});


Backbone.sync = function(method, model, options) {
  var resp; 
  
  var store = model.localStorage || model.collection.localStorage;
  
  switch (method) {
    case "read":    resp = model.id ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }
  if (resp) {  
  	console.log(resp);
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};



