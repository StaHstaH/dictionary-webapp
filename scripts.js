const input = document.getElementById('wordsearch');

input.addEventListener("keyup", (event) => {
  console.log(input.value + "dupa");
  searchWord(input.value);
});


const searchWord = async (word) => {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    
  );
  const json = await response.json(); 
  console.log(json);
  displayWord(json);
};

function displayWord(json) {
  let errorSection = document.querySelector("#error");
  // let partOfSpeech = document.querySelector("#speech-parts");
  if(json.title) {
    let title = document.querySelector("#error h3");
    title.innerHTML = json.title;
    errorSection.classList.remove("hide");
    return;
  } errorSection.classList.add("hide");

  let meanings = document.getElementById('meanings');
  meanings.replaceChildren();
  
  // let meaning = document.querySelector("#meaning");
  // meaning.classList.remove("hide");
  // partOfSpeech.innerHTML = json[0].meanings[0].partOfSpeech;
//  displayMeaning(json[0].meanings[0]);

  
  for (const meaning of json[0].meanings) {
    displayMeaning(meaning);
  }


  let result = document.getElementById("word-search-result");
  result.innerHTML = json[0].word;
}

function displayMeaning(meaning) {
  let meaningTemplate = document.getElementById('meaning-template');
  let domElement = meaningTemplate.cloneNode(true);
  let definitionTemplate = domElement.querySelector('ul li');
  let definitionList = domElement.querySelector('ul');
  
  domElement.removeAttribute('id');
  domElement.classList.remove('hide');
  
  let partOfSpeech = domElement.querySelector("h2");
  partOfSpeech.innerHTML = meaning.partOfSpeech;

  let container = document.getElementById("meanings");
  container.appendChild(domElement);

  for (const definition of meaning.definitions) {
     displayDefinition(definition, definitionTemplate, definitionList);
   }
  definitionTemplate.remove();
  console.log(meaning);

  handleSynonymsAntonyms(meaning.synonyms, domElement, '.synonyms');
  handleSynonymsAntonyms(meaning.antonyms, domElement, '.antonyms');
}

function handleSynonymsAntonyms(wordList, domElement, className) {
  if (wordList.length > 0) {
    let synonymList = domElement.querySelector(className + " p");

    for (const synonym of wordList) {
      let synonymLink = document.createElement("a");
      synonymLink.innerHTML = synonym;
      synonymList.appendChild(synonymLink);
    }
  } else {
    let synonymSection = domElement.querySelector(className);
    synonymSection.remove();
  }
}


function displayDefinition(definition, template, parentNode) {
  let domElement = template.cloneNode(true);
  let definitionText = domElement.querySelector('p.definition-text');
  definitionText.innerHTML = definition.definition;

let exampleText = domElement.querySelector("p.example");
  if(definition.example) {
    exampleText.innerHTML = definition.example;
  } else {
    exampleText.remove();
  }

  parentNode.appendChild(domElement);
}