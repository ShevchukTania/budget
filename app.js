var budgetController = (function(){
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function(totalIncome){
    if (totalIncome > 0){
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else{
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };

  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function(type){
    var sum=0;
    data.allItems[type].forEach(function(i){
      sum = sum + i.value;
    });
    data.totals[type] = sum;
  };

  return {
    calculateBudget: function(){
      calculateTotal('exp');
      calculateTotal('inc');
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
      } else {
        data.percentage = -1;
      };
    },

    calculatePercentages: function(){
      data.allItems.exp.forEach(function(curr){
        curr.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function(){
      var allPrc = data.allItems.exp.map(function (curr){
        return curr.getPercentage();
      });
      return allPrc;
    },
    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    deleteItem: function(type, id){
      var ids = data.allItems[type].map(function(curr){
        return curr.id;
      });
      var index = ids.indexOf(id);
      if(index !== -1){
        data.allItems[type].splice(index, 1)
      }
    },

    addItem: function(type, des, val){
      var newItem, ID;
      if (data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0
      };
      if (type === 'exp'){
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      };
      data.allItems[type].push(newItem);
      return newItem;
    }

  };
})();


var UIController = (function() {
  var DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };
  var formatNumber = function(num, type){
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    };
    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  return {
    displayBudget: function(object){
      var type;
      object.budget > 0 ? type = "inc" : type = "exp"
      document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(object.budget, type);
      document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(object.totalInc, "inc");
      document.querySelector(DOMstring.expensesLabel).textContent = formatNumber(object.totalExp, "exp");
      if ( object.percentage > 0){
        document.querySelector(DOMstring.percentageLabel).textContent = object.percentage + '%';
      } else {
        document.querySelector(DOMstring.percentageLabel).textContent = '---';
      };
    },
    getInput: function(){
      return{
        type: document.querySelector(DOMstring.inputType).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value),
        description: document.querySelector(DOMstring.inputDescription).value
      };
    },
    addListItem: function(obj, type){
      var html, newHTML, element;
      // HTML with placeholder text
      if (type === 'inc'){
        element = DOMstring.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstring.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      };

      //Replace placeholder text with actual data
      newHTML = html.replace('%id%', formatNumber(obj.id));
      newHTML = newHTML.replace('%description%', formatNumber(obj.description));
      newHTML = newHTML.replace('%value%', formatNumber(obj.value));
      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

    },
    getDOMstring: function(){
      return DOMstring;
    },
    clearInput: function(){
      var input;
      input = document.querySelectorAll(DOMstring.inputDescription+ ', '+ DOMstring.inputValue);
      inputArr = Array.prototype.slice.call(input);
      inputArr.forEach(function(current, index, array){
        current.value = "";
      });
      inputArr[0].focus();
    },

    deleteListItem: function(ID){
      var el = document.getElementById(ID);
      el.parentNode.removeChild(el);
    },

    displayPercentages: function(percentages){
      var fields = document.querySelectorAll(DOMstring.expensesPercLabel);
      var noddeListForEach = function(list, callback){
        for (var i=0; i<list.length; i++){
          callback(list[i], i )
        };
      };

      noddeListForEach(fields, function(curr, index){
        if (percentages[index] > 0){
          curr.textContent = percentages[index] + '%';
        } else {
          curr.textContent = '---';
        };
      });
    },
    displayMonth: function() {
      var now, months, month, year;
      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function() {
      var fields = document.querySelectorAll(
      DOMstrings.inputType + ',' +
      DOMstrings.inputDescription + ',' +
      DOMstrings.inputValue);
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    }
  }
})();


var controller = (function(budgetContr, UIContr){
  var setupEventListeners = function(){
    var DOM = UIContr.getDOMstring();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      };
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    });
  };

  var updateBudget = function(){
    budgetContr.calculateBudget();

    var budget = budgetContr.getBudget();
    UIContr.displayBudget(budget);
  };

  var updatePercentages = function(){
    budgetContr.calculatePercentages();
    var percentages = budgetContr.getPercentages();
    UIContr.displayPercentages(percentages);
  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      budgetContr.deleteItem(type, ID);
      UIContr.deleteListItem(itemID);
      updateBudget();
      updatePercentages();
    };
  };

  var ctrlAddItem = function(){
    var input, newItem;
    input = UIContr.getInput();
    if ( !(input.description == '' || input.value <= 0 || isNaN(input.value)) ){
      newItem = budgetContr.addItem(input.type, input.description, input.value);
      UIContr.addListItem(newItem, input.type);
      UIContr.clearInput();
      updateBudget();
      updatePercentages();
    };
  };

  return {
    init: function(){
      UIContr.displayMonth();
      setupEventListeners();
      UIContr.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  };
})(budgetController, UIController);
controller.init();
