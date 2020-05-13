//BUDGET CONTROLLER
let budgetController = (function () {
  //Creating a function constructor for the Expense and Income
  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0){
    this.percentage = Math.round((this.value/totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  //Create an object to store all data
  let data = {
    //Store all expenses and incomes in two different arrays and put them both in an object
    //This will end up meaning an object inside another object
    allItems: {
      exp: [],
      inc: [],
    },
    //Still inside the data object, set totals for incomes and expenses to zero, putting them in another obj
    totals: {
      exp: 0,
      inc: 0,
    },

    budget: 0,
    percentage: -1 //-1 because it doesn't exist initiallly.
  };

  //return an object so that the function constructors can be accessed outdie the module.
  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      //Examples to understand ID
      //[1 3 5 7 8], next ID = 9
      //[1 2 3 4 5], next ID = 6
      // ID = last ID + 1

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      //push it into our data structure (appropriate inc or exp array)
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      let ids, index;
      //id = 7;
     // data.allItems[type][id];
     //ids =[1,3,4,5,6,7,9];
     //index = 6;

     ids = data.allItems[type].map(function(current){
       return current.id;
     });
     index = ids.indexOf(id);

     if (index !== -1){
       data.allItems[type].splice(index, 1);
     }
    },

    calculateBudget: function () {
      //calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the % of income spent
      if (data.totals.inc > 0){
      data.percentage =  Math.round((data.totals.exp/data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function(){
      data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function (){
      let allPerc = data.allItems.exp.map(function(cur){
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      }

    },

    testing: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER
let UIController = (function () {
  //Create a private object to store all of the strings from the html
  let DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
  };
  //read the input data
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will either be 'inc' or 'exp'
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;
      //Create HTML strings with placeholder tags
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace placeholder tags with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);
      //Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      let el = document.getElementById(selectorID);
      //Get the parent element, the apply removeChild() method to delete the child.
      //This is weird, but it's how javascript works.
      el.parentNode.removeChild(el);

    },
    //Clear the input fields after the input has been entered.
    clearFields: function () {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + "," + DOMStrings.inputValue
      );
      //'querySelectorAll' returns a list, so turning it into an array using the Array prototype:
      //"call" helps to borrow the prototype method of Array object.
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      //set the focus
      fieldsArr[0].focus();
    },

    displayObject: function(obj){
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
      
      if (obj.percentage > 0){
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '----'
      }

    },

    //make the DOMStrings object public
    getDOMStrings: function () {
      return DOMStrings;
    },
  };
})();

// GLOBAL APP CONTROLLER (The link)
let controller = (function (budgetCtrl, UICtrl) {
  let setUpEventListeners = function () {
    let DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  let updateBudget = function () {
    // Calculate the budget.
    budgetCtrl.calculateBudget();
    // Return the budget.
    let budget = budgetCtrl.getBudget();
    //6.Display the budget on the UI.
    UICtrl.displayObject(budget);
  };

  let updatePercentages = function() {
    //1. Calculate percentages
    budgetCtrl.calculatePercentages();
    //2.Read percentages from the budget controller
    let percentages = budgetCtrl.getPercentages();
    //3. Update the UI with the new percentages.
    console.log(percentages);
  }
  let ctrlAddItem = function () {
    let input, newItem;
    //1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget calculator.
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add the item to the UI.
      UICtrl.addListItem(newItem, input.type);
      //4. Clear the fields
      UICtrl.clearFields();
      //5. Calculate and update budget.
      updateBudget();
      //6. Calculate and update percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function(event){
    let itemID, splitID, type, id;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);

      //1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, id);
      //2. Delete the item from the UI.
      UICtrl.deleteListItem(itemID);
      //3.Update and show new budget.
      updateBudget();
      //4. Calculate and update percentages
      updatePercentages();
    }
  };
   
  return {
    init: function () {
      UICtrl.displayObject({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      })
        
      console.log("Application has started");
      setUpEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
