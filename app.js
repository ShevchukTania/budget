var budgetController = (function(){

})();



var UIController = (function() {
  var DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };
  return{
    getInput: function(){
      return{
        type: document.querySelector(DOMstring.inputType).value,
        value: document.querySelector(DOMstring.inputValue).value,
        description: document.querySelector(DOMstring.inputDescription).value
      };
    },
    getDOMstring: function(){
      return DOMstring;
    }
  };
})();



var controller = (function(budgetContr, UIContr){
  var DOM = UIController.getDOMstring();
  var ctrlAddItem = function(){
    var input = UIController.getInput();
    console.log(input);
  };
  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13) {
      console.log("Enter");
      ctrlAddItem();
    };
  });
})(budgetController, UIController);
