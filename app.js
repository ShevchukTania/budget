var budgetController = (function(){
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
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
        data.persentage = -1;
      };
    },
    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    income: function(){
      var sum;
      for (i=0; i<data.allItems.exp.length; i++){
        sum += parseFloat(data.allItems.exp[i]);
      };
      return sum;
    },
    expenses: function(){
      var sum;
      for (i=0; i<data.allItems.inc.length; i++){
        sum += data.allItems.inc[i];
      };
      return -sum;
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
    percentageLabel: '.budget__expenses--percentage'
  };
  return {
    displayBudget: function(object){
      document.querySelector(DOMstring.budgetLabel).textContent = object.budget;
      document.querySelector(DOMstring.incomeLabel).textContent = object.totalInc;
      document.querySelector(DOMstring.expensesLabel).textContent = object.totalExp;
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
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstring.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      };

      //Replace placeholder text with actual data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);
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
    });
  };

  var updateBudget = function(){
    budgetContr.calculateBudget();

    var budget = budgetContr.getBudget();
    UIContr.displayBudget(budget);
  };
  var ctrlAddItem = function(){
    var input, newItem;
    input = UIContr.getInput();
    if ( !(input.description == '' || input.value <= 0 || isNaN(input.value)) ){
      newItem = budgetContr.addItem(input.type, input.description, input.value);
      UIContr.addListItem(newItem, input.type);
      UIContr.clearInput();
      updateBudget();
    };
  };

  return {
    init: function(){
      console.log('I am in');
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
