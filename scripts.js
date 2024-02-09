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
  let partOfSpeech = document.querySelector("#speech-parts");
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
  //TODO
  //find the mother element
  //clone the mother element and fill it with content
  let meaningTemplate = document.getElementById('meaning-template');
  let domElement = meaningTemplate.cloneNode(true);
  domElement.removeAttribute('id');
  domElement.classList.remove('hide');
  
  let partOfSpeech = domElement.querySelector("h2");
  partOfSpeech.innerHTML = meaning.partOfSpeech;

  let container = document.getElementById("meanings");
  container.appendChild(domElement);

  console.log(meaning);
}