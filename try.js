import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

let input = ""

let loadModelBtn = document.getElementById("loadModelBtn").addEventListener("click", loadSavedModel)
let inputField = document.getElementById("input").addEventListener("change", (e) => {
    input = e.target;
    console.log("Input: " + input)
})

function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    let visual = new VegaTree("#view", 800, 400, decisionTree.toJSON());

    // test om te zien of het werkt
    let patient = { Pregnant: 8, Glucose: 130, Bp: 72, Skin: 35, Insulin: 0}
    // let patient = input

    let prediction = decisionTree.predict(patient)
    console.log("Predicted: " + prediction)
}
