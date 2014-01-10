var viewModel = {
  shownOnce: ko.observable(),
  pageToDisplay: ko.observable(),
  errors: ko.observableArray(),
  successMsg: ko.observable(),
  beans: ko.observableArray(),
  selectedItem: ko.observable(),
  
  tempBean: {
    id: ko.observable(),
    name: ko.observable(),
    description: ko.observable(),
    place: ko.observable(),
    likes: ko.observable(),
    updated_at: ko.observable(),
    created_at: ko.observable()
  },
  
  tempBeanId: ko.observable(0),
  comments: ko.observableArray(),
  newCommentText: ko.observable(),
  newcomment: {
    coffeebean_id: "",
    content: ""
  },
  
  tempBeanName: ko.observable(),
  tempBeanDesc: ko.observable(),
  tempBeanPlace: ko.observable(),
  newBean: {
    name: "",
    description: "",
    place: "",
    likes: 0
  },
  
  filterBeans: ko.observable(""),

  setSuccessMsg: function(successMsg) {
    this.successMsg(successMsg);
    this.shownOnce(false);
  },

  checkSuccessMsg: function() {
    if (this.shownOnce() == true) {
      this.successMsg('');
    }
  },
  
  prepareTempBean : function() {
    this.tempBean.id(ko.utils.unwrapObservable(this.selectedItem().id));
    this.tempBean.name(ko.utils.unwrapObservable(this.selectedItem().name));
    this.tempBean.description(ko.utils.unwrapObservable(this.selectedItem().description));
    this.tempBean.place(ko.utils.unwrapObservable(this.selectedItem().place));
    this.tempBean.likes(ko.utils.unwrapObservable(this.selectedItem().likes));
    this.tempBean.updated_at(ko.utils.unwrapObservable(this.selectedItem().updated_at));
    this.tempBean.created_at(ko.utils.unwrapObservable(this.selectedItem().created_at));
  },
  
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
        viewModel.setSuccessMsg('New Coffee Bean Added.');
        viewModel.beanDisplay(createdItem);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  
  beanDisplay: function(beanToShow) {
    this.checkSuccessMsg();
    this.errors([]);
    this.newCommentText('');
    this.selectedItem(beanToShow);
    this.prepareTempBean();
    var url = '/coffeebeans/' + beanToShow.id + '/comments.json';
    $.getJSON(url, function(data) {
      viewModel.comments(data);
    });
    this.pageToDisplay('display');
    this.shownOnce(true);
    this.tempBeanId(beanToShow.id);
  },


  editBean: function(itemToEdit) {
    this.checkSuccessMsg();
    this.selectedItem(itemToEdit);
    this.prepareTempBean();
    this.pageToDisplay('edit');
    this.shownOnce(true);
  },

  updateBean: function(beanToUpdate) {
    var json_data = ko.toJS(beanToUpdate);
    delete json_data.id;
    delete json_data.created_at;
    delete json_data.updated_at;

    $.ajax({
      type: 'PUT',
      url: '/coffeebeans/' + beanToUpdate.id() + '.json',
      data: {
        coffeebean: json_data
      },
      dataType: "json",
      success: function(updatedBean) {
        viewModel.errors([]);

        viewModel.beanDisplay(updatedBean);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  
  indexBean: function() {
    this.checkSuccessMsg();
    this.errors([]);
    this.successMsg('');
    this.clearComments();
    $.getJSON('/coffeebeans.json', function(data) {
      viewModel.beans(data);
      viewModel.pageToDisplay('index');
      viewModel.shownOnce(true);
    });
  },

  loveBean: function(beanToUpdate) {
    beanToUpdate.likes(beanToUpdate.likes() + 1);
    var temp = 0;
    var json_data = ko.toJS(beanToUpdate);
    delete json_data.id;
    delete json_data.created_at;
    delete json_data.updated_at;

    $.ajax({
      type: 'PUT',
      url: '/coffeebeans/' + beanToUpdate.id() + '.json',
      data: {
        coffeebean: json_data
      },
      dataType: "json",
      success: function(updatedBean) {
        viewModel.errors([]);
        
        viewModel.showAction(updatedBean);
        this.temp(1);
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });  

  },
  
  addBean: function() {
    this.newBean.name = this.tempBeanName();
    this.newBean.description = this.tempBeanDesc();
    this.newBean.place = this.tempBeanPlace();
    var json_data = ko.toJS(this.newBean);
    
    $.ajax({
      type: 'POST',
      url: '/coffeebeans.json',
      data: {
        
        coffeebean: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
      
        viewModel.beans.push(viewModel.newBean);
        viewModel.tempBeanName('');
        viewModel.tempBeanDesc('');
        viewModel.tempBeanPlace('');
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },

  addComment: function() {
    this.newcomment.coffeebean_id = this.tempBeanId();
    this.newcomment.content = this.newCommentText();
    var json_data = ko.toJS(this.newcomment);
    
    $.ajax({
      type: 'POST',
      url: '/coffeebeans/' + this.tempBeanId() + '/comments.json',
      data: {
        
        comment: json_data
      },
      dataType: "json",
      success: function(createdItem) {
        viewModel.errors([]);
      
        viewModel.comments.push(viewModel.newcomment);
        viewModel.newCommentText('');
      },
      error: function(msg) {
        viewModel.errors(JSON.parse(msg.responseText));
      }
    });
  },
  
    
  clearTempItem: function() {
    this.tempBean.id('');
    this.tempBean.name('');
    this.tempBean.description('');
    this.tempBean.place('');
    this.tempBean.likes('');
    this.tempBean.updated_at('');
    this.tempBean.created_at('');
  },

  clearComments: function() {
    this.comments('');
  },
  
  beanDelete: function(beanToDelete) {
    if (confirm('Are you sure?')) {
      $.ajax({
        type: "DELETE",
        url: '/coffeebeans/' + beanToDelete.id + '.json',
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

viewModel.filteredBeans = ko.computed(function() {
    var filterBeans = this.filterBeans().toLowerCase();
    if (!filterBeans) {
        return this.beans();
    } else {
        return ko.utils.arrayFilter(this.beans(), function(item) {
            return ko.utils.stringStartsWith(item.name.toLowerCase(), filterBeans);
        });
    }
}, viewModel);


// /// 20
$(document).ready(function() {
  ko.applyBindings(viewModel);
  viewModel.indexBean();
  viewModel.clearTempItem();
});
