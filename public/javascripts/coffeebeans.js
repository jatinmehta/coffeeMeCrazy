var viewModel = {
  flash: ko.observable(),
  shownOnce: ko.observable(),
  currentPage: ko.observable(),
  errors: ko.observableArray(),
  items: ko.observableArray(),
  comments: ko.observableArray(),
  selectedItem: ko.observable(),
  newcontent: ko.observable(),
 beanid: ko.observable(0),
  filter: ko.observable(""),
  tempName: ko.observable(),
  tempDescription: ko.observable(),
  tempPlace: ko.observable(),

  tempItem: {
    id: ko.observable(),
    name: ko.observable(),
    description: ko.observable(),
    place: ko.observable(),
    likes: ko.observable(),
    updated_at: ko.observable(),
    created_at: ko.observable()
  },

  newcomment: {
    coffeebean_id: "",
    content: ""
  },

  newBean: {
    name: "",
    description: "",
    place: "",
    likes: 0
  },

  setFlash: function(flash) {
    this.flash(flash);
    this.shownOnce(false);
  },

  checkFlash: function() {
    if (this.shownOnce() == true) {
      this.flash('');
    }
  },
  
  clearTempItem: function() {
    this.tempItem.id('');
    this.tempItem.name('');
    this.tempItem.description('');
    this.tempItem.place('');
    this.tempItem.likes('');
    this.tempItem.updated_at('');
    this.tempItem.created_at('');
  },

  clearComments: function() {
    this.comments('');
  },
  
  prepareTempItem : function() {
    this.tempItem.id(ko.utils.unwrapObservable(this.selectedItem().id));
    this.tempItem.name(ko.utils.unwrapObservable(this.selectedItem().name));
    this.tempItem.description(ko.utils.unwrapObservable(this.selectedItem().description));
    this.tempItem.place(ko.utils.unwrapObservable(this.selectedItem().place));
    this.tempItem.likes(ko.utils.unwrapObservable(this.selectedItem().likes));
    this.tempItem.updated_at(ko.utils.unwrapObservable(this.selectedItem().updated_at));
    this.tempItem.created_at(ko.utils.unwrapObservable(this.selectedItem().created_at));
  },
  
  indexBean: function() {
    this.checkFlash();
    this.errors([]);
    this.flash('');
    this.clearComments();
    $.getJSON('/coffeebeans.json', function(data) {
      viewModel.items(data);
      viewModel.currentPage('index');
      viewModel.shownOnce(true);
    });
  },

  showBean: function(itemToShow) {
    this.checkFlash();
    this.errors([]);
    this.newcontent('');
    this.selectedItem(itemToShow);
    this.prepareTempItem();
    var url = '/coffeebeans/' + itemToShow.id + '/comments.json';
    $.getJSON(url, function(data) {
      viewModel.comments(data);
    });
    this.currentPage('show');
    this.shownOnce(true);
    this.beanid(itemToShow.id);
  },


  editBean: function(itemToEdit) {
    this.checkFlash();
    this.selectedItem(itemToEdit);
    this.prepareTempItem();
    this.currentPage('edit');
    this.shownOnce(true);
  },

  addBean: function() {
    this.newBean.name = this.tempName();
    this.newBean.description = this.tempDescription();
    this.newBean.place = this.tempPlace();
    var json_data = ko.toJS(this.newBean);
    
    $.ajax({
      type: 'POST',
      url: '/coffeebeans.json',
      data: {
        // /// 17
        coffeebean: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
      
        viewModel.items.push(viewModel.newBean);
        viewModel.tempName('');
        viewModel.tempDescription('');
        viewModel.tempPlace('');
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },

  addComment: function() {
    this.newcomment.coffeebean_id = this.beanid();
    this.newcomment.content = this.newcontent();
    var json_data = ko.toJS(this.newcomment);
    
    $.ajax({
      type: 'POST',
      url: '/coffeebeans/' + this.beanid() + '/comments.json',
      data: {
        // /// 17
        comment: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
      
        viewModel.comments.push(viewModel.newcomment);
        viewModel.newcontent('');
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  // /// 16
  createBean: function(itemToCreate) {
    var json_data = ko.toJS(itemToCreate);
    $.ajax({
      type: 'POST',
      url: '/coffeebeans.json',
      data: {
        // /// 17
        coffeebean: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
        viewModel.setFlash('New Coffee Bean Added.');
        viewModel.showBean(createdItem);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },

  tryBean: function(itemToUpdate) {
    itemToUpdate.likes(itemToUpdate.likes() + 1);
    var temp = 0;
    var json_data = ko.toJS(itemToUpdate);
    delete json_data.id;
    delete json_data.created_at;
    delete json_data.updated_at;

    $.ajax({
      type: 'PUT',
      url: '/coffeebeans/' + itemToUpdate.id() + '.json',
      data: {
        coffeebean: json_data
      },
      dataType: "json",
      success: function(updatedItem) {
        viewModel.errors([]);
        
        viewModel.showAction(updatedItem);
        this.temp(1);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });  

  },
  // /// 18
  updateBean: function(itemToUpdate) {
    var json_data = ko.toJS(itemToUpdate);
    delete json_data.id;
    delete json_data.created_at;
    delete json_data.updated_at;

    $.ajax({
      type: 'PUT',
      url: '/coffeebeans/' + itemToUpdate.id() + '.json',
      data: {
        coffeebean: json_data
      },
      dataType: "json",
      success: function(updatedItem) {
        viewModel.errors([]);

        viewModel.showBean(updatedItem);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  // /// 19
  destroyBean: function(itemToDestroy) {
    if (confirm('Are you sure?')) {
      $.ajax({
        type: "DELETE",
        url: '/coffeebeans/' + itemToDestroy.id + '.json',
        dataType: "json",
        success: function(){
          viewModel.errors([]);
          
          viewModel.indexBean();
        },
        error: function(msg) {
          viewModel.errors(JSON.parse(msg.responseText));
        }
      });
    }
  }
};

ko.utils.stringStartsWith = function (string, startsWith) {         
  string = string || "";
  if (startsWith.length > string.length)
      return false;
  return string.substring(0, startsWith.length) === startsWith;
};

viewModel.filteredItems = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.items();
    } else {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return ko.utils.stringStartsWith(item.name.toLowerCase(), filter);
        });
    }
}, viewModel);


// /// 20
$(document).ready(function() {
  ko.applyBindings(viewModel);
  viewModel.indexBean();
  viewModel.clearTempItem();
});
