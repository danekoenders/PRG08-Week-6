import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

// Accuracy
let accuracyField = document.getElementById("accuracy");
let totalAmount = 0
let amountCorrect = 0

// Confusion Matrix
let correctPositive = 0
let falsePositive = 0
let correctNegative = 0
let falseNegative = 0

let correctPositiveField = document.getElementById("correctPositive");
let falsePositiveField = document.getElementById("falsePositive");
let correctNegativeField = document.getElementById("correctNegative");
let falseNegativeField = document.getElementById("falseNegative");

//
// DATA
//
const csvFile = "./data/diabetes.csv";
const trainingLabel = "Label";
// const ignored = ["Insulin","bmi","Pedigree","Age","Label"];
const ignored = ["Pregnant"];
// const ignored = [];
const maxTreeDepth = 100;

//
// laad csv data als json
//
function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    // complete: (results) => console.log(results.data), // gebruik deze data om te trainen
    complete: (results) => trainModel(results.data), // gebruik deze data om te trainen
  });
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
  // todo : split de data in train en test data`
  data.sort(() => (Math.random() - 0.5))

  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);

  totalAmount = testData.length;
  
  // maak het algoritme aan
  let decisionTree = new DecisionTree({
    ignoredAttributes: ignored,
    trainingSet: trainData,
    categoryAttr: trainingLabel,
    maxTreeDepth: maxTreeDepth,
  });

  // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
  let visual = new VegaTree("#view", 800, 400, decisionTree.toJSON());

  // todo : maak een prediction met een sample uit de testdata
  let diabetes = testData[0]
  let diabetesPrediction = decisionTree.predict(diabetes)
  console.log(`Has diabetes : ${diabetesPrediction}`)
  
  // todo : bereken de accuracy met behulp van alle test data
  for (let i = 0; i < testData.length; i++) {
    testPatient(testData[i], decisionTree);
  }

  let json = decisionTree.toJSON()
  console.log(JSON.stringify(json))

  getAccuracy();
  getMatrix();
}

function testPatient(patient, decisionTree) {

  // kopie van patient maken, zonder het "Label" label
  const patientWithoutLabel = { ...patient }
  delete patientWithoutLabel.Label

  // prediction
  let prediction = decisionTree.predict(patientWithoutLabel);

  // vergelijk de prediction met het echte label
  if (prediction == patient.Label) {
    amountCorrect++
  }

  // Vergelijkingen voor de confusion matrix
  if (prediction == 1 && patient.Label == 1) {
    correctPositive++
  } else if (prediction == 0 && patient.Label == 1) {
    falseNegative++
  } else if (prediction == 0 && patient.Label == 0) {
    correctNegative++
  } else {
    falsePositive++
  }
}

function getAccuracy() {
  let accuracy = amountCorrect / totalAmount
  console.log(accuracy)

  accuracyField.innerHTML = "Accuracy : " + accuracy
}

function getMatrix() {
  correctPositiveField.innerHTML = correctPositive
  falsePositiveField.innerHTML = falsePositive
  correctNegativeField.innerHTML = correctNegative
  falseNegativeField.innerHTML = falseNegative
}

loadData();