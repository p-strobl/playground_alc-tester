"use strict";

const appReceivedUserDataset = {
  smith: {
    weight: 89.5,
    drinks: [
      {
        type: "wine",
        amount: 5
      },
      {
        type: "beer",
        amount: 3
      },
      {
        type: "wine",
        amount: 2
      },
    ]
  },
  paul: {
    weight: "sixty",
    drinks: [
      {
        type: "wine",
        amount: 2.5
      },
      {
        type: "beer",
        amount: -3
      }
    ]
  },
  marry: {
    weight: 80,
    drinks: [
      {
        type: "wine",
        amount: 2
      }
    ],
    food: [
      {
        type: "sausage",
        amount: 1
      }
    ]
  },
  pete: {
    weight: -78.3,
    food: [
      {
        type: "wings",
        amount: 12
      }
    ]
  }
};

//Arbeitsschritt 1:

const recordHasValidKeys = receivedUserDataset => receivedUserDataset.hasOwnProperty("weight") && receivedUserDataset.hasOwnProperty("drinks");

const recordHasValidWeight = receivedUserDataset => {
  if (receivedUserDataset.hasOwnProperty("weight")) {
    return typeof receivedUserDataset.weight === "number" && receivedUserDataset.weight > 0
      ? true
      : receivedUserDataset.weight;
  } else {
    return false;
  }
};

const recordHasValidNumberOfDrinks = receivedUserDataset => {
  if (receivedUserDataset.hasOwnProperty("drinks")) {
    const amountOfDrinksArray = receivedUserDataset.drinks.map(drinks => drinks.amount);
    if (amountOfDrinksArray.every(amount => Number.isInteger(amount) && amount >= 0)) {
      return true;
    } else {
      return amountOfDrinksArray.filter(amount => !Number.isInteger(amount) || amount < 0).join(" or ");
    }
  } else {
    return false;
  }
};

const validateRecords = receivedUserDataset => {
  const hasValidKeys = recordHasValidKeys(receivedUserDataset);
  const hasValidWeight = recordHasValidWeight(receivedUserDataset);
  const hasValidNumberOfDrinks = recordHasValidNumberOfDrinks(receivedUserDataset);
  const errorMessageArray = [];

  if (hasValidKeys === true && hasValidWeight === true && hasValidNumberOfDrinks === true) {
    return true;
  } else {
    if (hasValidKeys === false || hasValidWeight === false || hasValidNumberOfDrinks === false) errorMessageArray.push("Received JSON dataset, is not valid.");
    if (hasValidWeight !== true && hasValidWeight !== false) errorMessageArray.push(`${hasValidWeight} is not a valid weight.`);
    if (hasValidNumberOfDrinks !== true && hasValidNumberOfDrinks !== false) errorMessageArray.push(`${hasValidNumberOfDrinks} is not a valid number of bottles or glasses.`);
    return errorMessageArray.join("\n");
  }
};

// console.log(recordHasValidKeys(appReceivedUserDataset.smith));
// console.log(recordHasValidKeys(appReceivedUserDataset.paul));
// console.log(recordHasValidKeys(appReceivedUserDataset.marry));
// console.log(recordHasValidKeys(appReceivedUserDataset.pete));
//
// console.log(recordHasValidWeight(appReceivedUserDataset.smith));
// console.log(recordHasValidWeight(appReceivedUserDataset.paul));
// console.log(recordHasValidWeight(appReceivedUserDataset.marry));
// console.log(recordHasValidWeight(appReceivedUserDataset.pete));
//
// console.log(recordHasValidNumberOfDrinks(appReceivedUserDataset.smith));
// console.log(recordHasValidNumberOfDrinks(appReceivedUserDataset.paul));
// console.log(recordHasValidNumberOfDrinks(appReceivedUserDataset.marry));
// console.log(recordHasValidNumberOfDrinks(appReceivedUserDataset.pete));
//
// console.log(validateRecords(appReceivedUserDataset.smith));
// console.log(validateRecords(appReceivedUserDataset.paul));
// console.log(validateRecords(appReceivedUserDataset.marry));
// console.log(validateRecords(appReceivedUserDataset.pete));

//Arbeitsschritt 2:

const reduceDrinkType = (userDrinksTypeAmount, drinkType, returnUserDrinkArray) => {
  return returnUserDrinkArray[drinkType] = userDrinksTypeAmount.filter(typeKey => typeKey[0] === drinkType).map(amountValue => amountValue[1]).reduce((amount, currentAmount) => amount + currentAmount);
};

const getUserDrinkTypeAndAmount = receivedUserDataset => {
  const validUserDataset = validateRecords(receivedUserDataset);
  if (validUserDataset === true) {
    const userDrinksTypeAmount = receivedUserDataset.drinks.map(drinks => [drinks.type, drinks.amount]);
    let returnUserDrinkArray = [];
    if (userDrinksTypeAmount.find(key => key[0] === "wine")) reduceDrinkType(userDrinksTypeAmount, "wine", returnUserDrinkArray);
    if (userDrinksTypeAmount.find(key => key[0] === "beer")) reduceDrinkType(userDrinksTypeAmount, "beer", returnUserDrinkArray);
    return returnUserDrinkArray;
  } else {
    return "Received JSON dataset, is not valid.";
  }
};

const calculateWineAmount = wineGlassAmount => {
  const WINE_GLASS_SIZE = 0.2;
  const WINE_ALC_PERCENTAGE = 14;
  return wineGlassAmount * WINE_GLASS_SIZE * WINE_ALC_PERCENTAGE / 100;
};

const calculateBeerAmount = beerBottleAmount => {
  const BEER_BOTTLE_SIZE = 0.7;
  const BEER_ALC_PERCENTAGE = 5;
  return beerBottleAmount * BEER_BOTTLE_SIZE * BEER_ALC_PERCENTAGE / 100;
};

const calculateAmountOfStandardDrinks = calculatedWineBeerConsumption => {
  const STANDARD_DRINK_ALCOHOL_CONTENT = 17;
  return calculatedWineBeerConsumption * 1000 / STANDARD_DRINK_ALCOHOL_CONTENT;
};

const calculateEbacValue = (userWeight, calculatedAmountOfStandardDrinks) => {
  const WATER_IN_BLOOD = 0.806;
  const FACTOR = 1.2;
  const BODY_WATER = 0.5;
  const CONVERT_TO_PROMILL = 10;
  return ((WATER_IN_BLOOD * calculatedAmountOfStandardDrinks * FACTOR) / (BODY_WATER * userWeight)) * CONVERT_TO_PROMILL;
};

const bloodAlcoholContentFor = receivedUserDataset => {
  const validUserDataset = validateRecords(receivedUserDataset);
  if (validUserDataset === true) {
    const validUserWeight = receivedUserDataset.weight;
    const userDrinkTypeAndAmount = getUserDrinkTypeAndAmount(receivedUserDataset);
    let calculatedWineConsumption = 0;
    let calculatedBeerConsumption = 0;
    let calculatedAmountOfStandardDrinks;
    let calculatedEbacValue;
    if (userDrinkTypeAndAmount.hasOwnProperty("wine")) calculatedWineConsumption = calculateWineAmount(userDrinkTypeAndAmount.wine);
    if (userDrinkTypeAndAmount.hasOwnProperty("beer")) calculatedBeerConsumption = calculateBeerAmount(userDrinkTypeAndAmount.beer);
    calculatedAmountOfStandardDrinks = calculateAmountOfStandardDrinks(calculatedWineConsumption + calculatedBeerConsumption);
    calculatedEbacValue = calculateEbacValue(validUserWeight, calculatedAmountOfStandardDrinks).toFixed(2);
    console.log(`${calculatedEbacValue}\u2030`);
    return calculatedEbacValue;
  } else {
    return "Received JSON dataset, is not valid.";
  }
};

// console.log(getUserDrinkTypeAndAmount(appReceivedUserDataset.smith));
// console.log(getUserDrinkTypeAndAmount(appReceivedUserDataset.paul));
// console.log(getUserDrinkTypeAndAmount(appReceivedUserDataset.marry));
// console.log(getUserDrinkTypeAndAmount(appReceivedUserDataset.pete));
//
// console.log(bloodAlcoholContentFor(appReceivedUserDataset.smith));
// console.log(bloodAlcoholContentFor(appReceivedUserDataset.paul));
// console.log(bloodAlcoholContentFor(appReceivedUserDataset.marry));
// console.log(bloodAlcoholContentFor(appReceivedUserDataset.pete));

//Arbeitsschritt 3:

const sendUserOutput = (receivedUserDataset) => {
  const validUserDataset = validateRecords(receivedUserDataset);
  if (validUserDataset === true) {
    const usersAlcoholContentProMill = bloodAlcoholContentFor(receivedUserDataset);
    const gradations_01 = `Ihr Promille Wert beträgt ${usersAlcoholContentProMill}\u2030, Sie sind vermutlich noch fahrtüchtig. Diese Angabe ist nicht rechtsverbindlich!`;
    const gradations_02 = `Ihr Promille Wert beträgt ${usersAlcoholContentProMill}\u2030, Sie haben vermutlich schon Konzentrationschwierigkeiten. Sie sollten nicht mehr fahren.`;
    const gradations_03 = `Ihr Promille Wert beträgt ${usersAlcoholContentProMill}\u2030, Fahren Sie nicht, das könnte Sie sonst den Führerschein kosten. Denken Sie auch an die armen Schafe.`;
    const gradations_04 = `Ihr Promille Wert beträgt ${usersAlcoholContentProMill}\u2030, Wie viele Handys halten Sie in der Hand?`;
    const gradations_05 = `Ihr Promille Wert beträgt ${usersAlcoholContentProMill}\u2030, Sie sind vermutlich tot – oder haben sich vertippt.`;
    if (usersAlcoholContentProMill >= 0.0 && usersAlcoholContentProMill <= 0.29) return gradations_01;
    if (usersAlcoholContentProMill >= 0.3 && usersAlcoholContentProMill <= 0.59) return gradations_02;
    if (usersAlcoholContentProMill >= 0.6 && usersAlcoholContentProMill <= 0.99) return gradations_03;
    if (usersAlcoholContentProMill >= 1.0 && usersAlcoholContentProMill <= 4.99) return gradations_04;
    if (usersAlcoholContentProMill >= 5.0) return gradations_05;
  } else {
    return "Ihre Eingabe ist nicht komplett oder valide, bitte geben Sie Ihre Daten erneut ein.";
  }
};

// console.log(sendUserOutput(appReceivedUserDataset.smith));
// console.log(sendUserOutput(appReceivedUserDataset.paul));
// console.log(sendUserOutput(appReceivedUserDataset.marry));
// console.log(sendUserOutput(appReceivedUserDataset.pete));
