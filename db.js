
    // Define your database
    let db = new Dexie("food_database");
    db.version(1).stores({
        foods: 'name,foodType,amount,aLaCarte,mealType',
        drinks: 'name,alcoholic,individualyBottled,amount'
    });

    // Put some data into it
    db.foods.put({name: "Bacon", foodType: 'Meat', amount: 10, 'aLaCarte': 'true', mealType: 'breakfast'});
    db.foods.put({name: "Eggs", foodType: 'Meat', amount: 12, 'aLaCarte': 'true', mealType: 'breakfast'});
    db.foods.put({name: "Pizza", foodType: 'Meal', amount: 6, 'aLaCarte': 'true', mealType: 'lunch/dinner'});
    db.foods.put({name: "Pasta", foodType: 'Grain', amount: 2, 'aLaCarte': 'true', mealType: 'lunch/dinner'});
    db.foods.put({name: "Mango", foodType: 'Fruit', amount: 4, 'aLaCarte': 'true', mealType: 'snack'});
    db.drinks.put({name: "Gin", alcoholic: 'true', 'individualyBottled': 'false', amount: 1});
    db.drinks.put({name: "Apple Juice", alcoholic: 'false', 'individualyBottled': 'true', amount: 12});

    // Display Data
    db.foods.each((food) => {
      console.log(food.name);
      if (food.mealType === 'breakfast') {
        document.querySelector('#breakfastList>div.list-group.list-group-flush').innerHTML += `<a href="#${food.name.replace(/ /g,'')}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${food.name}
          <span class="badge badge-primary badge-pill">${food.amount}</span>
          </a>`
      }
      if (food.mealType === 'lunch/dinner') {
        document.querySelector('#lunDinList>div.list-group.list-group-flush').innerHTML += `<a href="#${food.name.replace(/ /g,'')}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${food.name}
          <span class="badge badge-primary badge-pill">${food.amount}</span>
          </a>`
      }
      if (food.mealType === 'snack') {
        document.querySelector('#snacksList>div.list-group.list-group-flush').innerHTML += `<a href="#${food.name.replace(/ /g,'')}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${food.name}
        <span class="badge badge-primary badge-pill">${food.amount}</span>
        </a>`
      }
      document.getElementById("allFoodsList").innerHTML += `<a href="#${food.name.replace(/ /g,'')}" class="list-group-item list-group-item-action">${food.name} - ${food.foodType}</a>`
    });

    db.drinks.each((drink) => {
      console.log(drink.name);
      document.querySelector('#drinksList>div.list-group.list-group-flush').innerHTML += `<a href="#${drink.name.replace(/ /g,'')}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${drink.name}
        <span class="badge badge-primary badge-pill">${drink.amount}</span>
        </a>`        
      document.getElementById("allDrinksList").innerHTML += `<a href="#${drink.name.replace(/ /g,'')}" class="list-group-item list-group-item-action">${drink.name} - ${drink.alcoholic === 'true' ? 'alcoholic' : 'non-alcoholic'}</a>`
    });