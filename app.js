
    //BUDGET CONTROLLER
let budgetController = (function(){
     //Creating a function constructor for the Expense and Income
     let Expense = function(id, description, value){
         this.id = id;
         this.description = description;
         this.value = value;
     };   

     let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
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
        }
    };

        //return an object so that the function constructors can be accessed outdie the module.
        return {
            addItem: function(type, des, val){
                let newItem, ID;

                //Examples to understand ID
                //[1 3 5 7 8], next ID = 9
                //[1 2 3 4 5], next ID = 6
                // ID = last ID + 1

                //Create new ID
                if (data.allItems[type].length > 0){
                    ID = data.allItems[type][data.allItems[type].length -1].id + 1;
                } else {
                    ID = 0;
                } 
                

                //create new item based on inc or exp type
                if (type === 'exp'){
                    newItem = new Expense(ID, des, val)
                } else if (type === 'inc'){
                    newItem = new Income(ID, des, val)
                }
                //push it into our data structure (appropriate inc or exp array)
                data.allItems[type].push(newItem);

                //return the new element
                return newItem;
            },

             testing: function(){
                 console.log(data);
             }
        };
}
)();


// UI CONTROLLER
let UIController = (function(){
    //Create a private object to store all of the strings from the html
    let DOMStrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
    };
    //read the input data
    return {
        getInput: function () {
            return {
                type : document.querySelector(DOMStrings.inputType).value, //will either be 'inc' or 'exp'
             description : document.querySelector(DOMStrings.inputDescription).value,
             value : document.querySelector(DOMStrings.inputValue).value,

            };
            
        },

        addListItem: function(obj, type){
            let html, newHtml, element;
            //Create HTML strings with placeholder tags
            if (type === 'inc'){
            element = DOMStrings.expenseContainer;
            html= '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
            element = DOMStrings.incomeContainer;
            html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description% rent</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replace placeholder tags with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        //Clear the input fields after the input has been entered.
        clearFields: function(){
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            //'querySelectorAll' returns a list, so turning it into an array using the Array prototype:
            //"call" helps to borrow the prototype method of Array object.
        fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current, index, array){
            current.value = "";
        });
            //set the focus
            fieldsArr[0].focus();
        },

        

        //make the DOMStrings object public
        getDOMStrings: function(){
            return DOMStrings;
        }
    }

}) ();



// GLOBAL APP CONTROLLER (The link)
let controller = (function(budgetCtrl, UICtrl){
    
    let setUpEventListeners = function(){
    let DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event){
        if (event.keyCode === '13' || event.which === '13'){
            ctrlAddItem();
        }
    });  
    };

    let ctrlAddItem = function(){
        let input, newItem;
        //1. Get the field input data
        input = UICtrl.getInput();
       
        //2. Add the item to the budget calculator.
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3. Add the item to the UI.
        UICtrl.addListItem(newItem, input.type);
        //4. Clear the fields
        UICtrl.clearFields();
        //5. Calculate the budget.

        //6.Display the budget on the UI.
    };     

    return {
        init: function(){
        console.log('Application has started');
        setUpEventListeners();
    }
}
})(budgetController, UIController);

controller.init();