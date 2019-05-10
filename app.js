const breakfastList = document.querySelector('#breakfastList>div.list-group.list-group-flush')
const lunDinList = document.querySelector('#lunDinList>div.list-group.list-group-flush')
const drinksList = document.querySelector('#drinksList>div.list-group.list-group-flush')
const snacksList = document.querySelector('#snacksList>div.list-group.list-group-flush')
const typeList = ['breakfast', 'lunch/dinner', 'drink', 'snack']

function hideScreens() {
    $(".content").hide();
    $('#navbarNav').collapse("hide")
}
async function displayPreviewList(list, fName, fAmount) {
    list.innerHTML += `<a href="#${fName.replace(/ /g,'')}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">${fName}<span class="badge badge-primary badge-pill">${fAmount}</span></a>`
    $('#createForm')[0].reset()    
}

async function updateFood(fType, fName, fAmount, fFood = null, fCart = null) {
    await db.foods.put({name: fName, foodType: fFood, amount: fAmount, 'aLaCarte': fCart, mealType: fType}).catch(err => {
        console.log(err)
    })
    $('#mainModal').modal('hide')
}

async function deleteFood(fname) {
    await db.foods.delete(fname).catch(err => {
        console.log(err)
    })
    $('#mainModal').modal('hide')
}

async function updateDrink(name, amo, alc = null, indi = null) {
    await db.drinks.put({name: name, alcoholic: alc, individualyBottled: indi, amount: amo}).catch(err => {
        console.log(err)
    })
    $('#mainModal').modal('hide')
}

async function deleteDrink(name) {
    await db.drinks.delete(name).catch(err => {
        console.log(err)
    })
    $('#mainModal').modal('hide')
}

async function displayInput(type, fName, fAmount) {
    if (type !== 'drink') {
        $('#allFoodsList').append(`<a href="#${fName.replace(/ /g,'')}" class="list-group-item list-group-item-action">${fName} - null</a>`)
        await db.foods.add({name: fName, foodType: null, amount: fAmount, 'aLaCarte': null, mealType: type}).catch(err => {
            console.log(err)
            if (err.name === 'ConstraintError') {
                $('.modal-title').html('Duplicate Food')
                $('.modal-body').html(`<p>You already have this Food on your list.</p>`)
                let btn = $('#modalPrimary')
                btn.html(`Replace Food`)
                btn.on('click', () => { updateFood(type, fName, fAmount); location.reload()})
            }
            $('#mainModal').modal('show')
        })
    } else {
        $('#allDrinksList').append(`<a href="#${fName.replace(/ /g,'')}" class="list-group-item list-group-item-action">${fName} - null</a>`)
        await db.drinks.add({name: fName, alcoholic: null, 'individualyBottled': null, amount: fAmount}).catch(err => {
            console.log(err)
            if (err.name === 'ConstraintError') {
                $('.modal-title').html('Duplicate Drink')
                $('.modal-body').html(`<p>You already have this Drink on your list.</p>`)
                let btn = $('#modalPrimary')
                btn.html(`Replace Drink`)
                btn.on('click', () => { updateDrink(fName, fAmount); location.reload()})
            }
            $('#mainModal').modal('show')
        })
    }
    if (type === 'breakfast') {
        displayPreviewList(breakfastList, fName, fAmount)
    }
    if (type === 'lunch/dinner') {
        displayPreviewList(lunDinList, fName, fAmount)
    }
    if (type === 'drink') {
        displayPreviewList(drinksList, fName, fAmount)
    }
    if (type === 'snack') {
        displayPreviewList(snacksList, fName, fAmount)
    }
}

function enableDrinkEdit(item) {
    $('#editBtn').on('click', () => {
        $('.modal-title').html('Edit/Delete Drink')
        $('.modal-body').html(`<div class="form-group row">
        <label for="drinkName" class="col col-form-label">Name:</label>
        <div class="col">
        <input type="text" readonly class="form-control" id="drinkName" value="${item.name}">
        </div>
    </div>
    <div class="form-group row">
        <label for="alcoholic" class="col col-form-label">Alcoholic:</label>
        <div class="col">
        <input type="text" class="form-control" id="alcoholicM" value="${item.alcoholic}">
        </div>
    </div>
    <div class="form-group row">
        <label for="foodAmount" class="col col-form-label">Amount:</label>
        <div class="col">
        <input type="text" class="form-control" id="drinkAmount" value="${item.amount}">
        </div>
    </div>
    <div class="form-group row">
    <label for="individualyBottled" class="col col-form-label">Individualy Bottled:</label>
    <div class="col">
            <div class="btn-group btn-group-toggle mb-3" id="inputToggle" data-toggle="buttons">
                <label class="btn btn-outline-info">
                    <input required type="radio" value="true" name="indiBottle" id="individualyBottledT" autocomplete="off"> True
                </label>
                <label class="btn btn-outline-info">
                    <input required type="radio" value="false" name="indiBottle" id="individualyBottledF" autocomplete="off"> False
                </label>
            </div>
        </div>
    </div>`)
        let btnP = $('#modalPrimary')
        let btnS = $('#modalSecondary')
        btnS.html(`Delete Drink`)
        btnP.html(`Update Drink`)
        btnP.on('click', () => {
            let dn = $('#drinkName').val().toLowerCase()
            let alc = $('#alcoholicM').val().toLowerCase()
            let da = $('#drinkAmount').val()
            let indi = $('input[name="indiBottle"]:checked').val()
            updateDrink(dn, da, alc, indi)
            location.reload()
        })
        btnS.on('click', () => { 
            let dn = $('#drinkName').val().toLowerCase()
            deleteDrink(dn)
            location.reload()
        })
        $('#mainModal').modal('show')
      })
}

function displayDrinkDetail(item) {
    console.log('debug')
    if (location.hash === `#${item.name.replace(/ /g,'')}`) {
        $('#detailContent').html(`
        <div class="form-group row">
            <label for="foodName" class="col col-form-label">Name:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="foodName" value="${item.name}">
            </div>
        </div>
        <div class="form-group row">
            <label for="alcoholic" class="col col-form-label">Alcoholic:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="alcoholic" value="${item.alcoholic}">
            </div>
        </div>
        <div class="form-group row">
            <label for="foodAmount" class="col col-form-label">Amount:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="foodAmount" value="${item.amount}">
            </div>
        </div>
        <div class="form-group row">
            <label for="individualyBottled" class="col col-form-label">Individualy Bottled:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="individualyBottled" value="${item.individualyBottled}">
            </div>
        </div>
      `)
      let target = $('.detailScreen').attr('id', `${item.name.replace(/ /g,'')}`)
      hideScreens();
      $(target).show();
      enableDrinkEdit(item)
    }
}

function enableFoodEdit(item) {
    $('#editBtn').on('click', () => {
        $('.modal-title').html('Edit/Delete Food')
        $('.modal-body').html(`<div class="form-group row">
        <label for="foodNameM" class="col col-form-label">Name:</label>
        <div class="col">
        <input type="text" readonly class="form-control-plaintext" id="foodNameM" value="${item.name}">
        </div>
    </div>
    <div class="form-group row">
        <label for="foodTypeM" class="col col-form-label">Food Type:</label>
        <div class="col">
        <input type="text" required class="form-control" id="foodTypeM" value="${item.foodType}">
        </div>
    </div>
    <div class="form-group row">
        <label for="foodAmountM" class="col col-form-label">Amount:</label>
        <div class="col">
        <input type="text" required class="form-control" id="foodAmountM" value="${item.amount}">
        </div>
    </div>
    <div class="form-group row">
        <label for="aLaCarteM" class="col col-form-label">A-La-Carte:</label>
        <div class="col">
            <div class="btn-group btn-group-toggle mb-3" id="inputToggle" data-toggle="buttons">
                <label class="btn btn-outline-info">
                    <input required type="radio" value="true" name="aLaCarte" id="modalTrue" autocomplete="off"> True
                </label>
                <label class="btn btn-outline-info">
                    <input required type="radio" value="false" name="aLaCarte" id="modalFalse" autocomplete="off"> False
                </label>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <label for="mealTypeM" class="col col-form-label">Meal Type:</label>
        <div class="col">
        <input type="text" required class="form-control" id="mealTypeM" value="${item.mealType}">
        </div>
    </div>`)
        let btnP = $('#modalPrimary')
        let btnS = $('#modalSecondary')
        btnS.html(`Delete Food`)
        btnP.html(`Update Food`)
        btnP.on('click', () => {
            let fnm = $('#foodNameM').val().toLowerCase()
            let ftm = $('#foodTypeM').val().toLowerCase()
            let fam = $('#foodAmountM').val()
            let facm = $('input[name="aLaCarte"]:checked').val()
            let mtm = $('#mealTypeM').val().toLowerCase()
            updateFood(mtm, fnm, fam, ftm, facm)
            location.reload()
        })
        btnS.on('click', () => { 
            let fnm = $('#foodNameM').val().toLowerCase()
            deleteFood(fnm)
            location.reload()
        })
        $('#mainModal').modal('show')
      })
}

function displayFoodDetail(item) {
    if (location.hash === `#${item.name.replace(/ /g,'')}`) {
        $('#detailContent').html(`
        <div class="form-group row">
            <label for="foodName" class="col col-form-label">Name:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="foodName" value="${item.name}">
            </div>
        </div>
        <div class="form-group row">
            <label for="foodType" class="col col-form-label">Food Type:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="foodType" value="${item.foodType}">
            </div>
        </div>
        <div class="form-group row">
            <label for="foodAmount" class="col col-form-label">Amount:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="foodAmount" value="${item.amount}">
            </div>
        </div>
        <div class="form-group row">
            <label for="aLaCarte" class="col col-form-label">A-La-Carte:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="aLaCarte" value="${item.aLaCarte}">
            </div>
        </div>
        <div class="form-group row">
            <label for="mealType" class="col col-form-label">Meal Type:</label>
            <div class="col">
            <input type="text" readonly class="form-control-plaintext" id="mealType" value="${item.mealType}">
            </div>
        </div>
      `)
      let target = $('.detailScreen').attr('id', `${item.name.replace(/ /g,'')}`)
      hideScreens();
      $(target).show();
      enableFoodEdit(item)
    }
}

function foodTypeToggler() {
    for ([i, type] of typeList.entries()) {
        $('#inputToggle').append(`<label class="btn btn-outline-info">
        <input type="radio" value="${type}" name="foodInputType" required id="option${i}" autocomplete="off"> ${type}
        </label>
        `)
    }
}

function hashHandler() {
    console.log('The hash has changed!')
    // if (location.hash !== '#home' && location.hash !== '#allItems') {
    //     $('#footer').addClass('bottom-footer')
    // } else { $('#footer').removeClass('bottom-footer') }

    db.foods.each(food => {
        displayFoodDetail(food)
    })
    db.drinks.each(drink => {
        displayDrinkDetail(drink)
    })
  }
  
  window.addEventListener('hashchange', hashHandler, false);


$('#home').show()
$(".nav-link").on("click", function(){
    if (this.id === 'btnAdd') {
        return
    }
    hideScreens();
    let target = $(this).attr("href");
    $(target).show();
});

foodTypeToggler()

// event handler
$("#createForm").submit((e) => {
    e.preventDefault()
    console.log(e)
    let foodName = $('#foodInputName').val().toLowerCase()
    let foodType = $('input[name="foodInputType"]:checked').val().toLowerCase()
    let foodAmount = $('#foodInputAmount').val()
    console.log()
    // check food type to add to proper list
    displayInput(foodType, foodName, foodAmount)
    
  });

  let deferredPrompt;
  let btnAdd = document.querySelector('#btnAdd')
  window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can add to home screen
  btnAdd.style.display = 'block';
});

btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});