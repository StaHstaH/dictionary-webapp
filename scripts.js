const input = document.getElementById("wordsearch");
const playback = document.querySelector("#word-definition img");
const darkModeSelector = document.querySelector(".switch input");

input.addEventListener("keyup", () => {
  console.log(input.value + "input value");
  let query = input.value.trim();
  let wordDefinition = document.getElementById("word-definition");
  let wordError = document.getElementById("error");
  if(query.length > 0) {
    searchWord(query);
    input.classList.remove("input-error");
  } else {
    input.classList.add("input-error");
    wordDefinition.classList.add("hide");
    wordError.classList.add("hide");
  }

});

playback.addEventListener("click", () => {
  let phoneticPlayback = document.getElementById("pronunciation");
  phoneticPlayback.play();
});

darkModeSelector.addEventListener("change", () => {
  var r = document.querySelector(':root');
  if (darkModeSelector.checked) {
    r.style.setProperty("--background", "var(--black)");
  } else {
    r.style.setProperty("--background", "var(--white)");
  }
});

let currentAbortController = null;
const searchWord = async (word) => {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
    signal: currentAbortController.signal,
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      displayWord(json);
    })
    .catch((error) => {
      // If the request was aborted, do nothing
      if (error.name === "AbortError") return;
      // Otherwise, handle the error here or throw it back to the console
      throw error;
    });
};

function displayWord(json) {
  let errorSection = document.querySelector("#error");
  let wordSection = document.querySelector("#word-definition");

  if (json.title) {
    let title = document.querySelector("#error h3");

    title.innerHTML = json.title;
    errorSection.classList.remove("hide");
    errorSection.classList.add("error-flex");
    wordSection.classList.add("hide");
    return;
  }
  errorSection.classList.add("hide");
  wordSection.classList.remove("hide");

  let phonetic = findPhonetics(json[0]);
  let phoneticDisplay = document.querySelector("#word-result h3");
  let phoneticPlayback = document.getElementById("pronunciation");
  let playButton = document.getElementById("play-button");

  
  if(phonetic.text) {
    phoneticDisplay.innerHTML = phonetic.text;
    phoneticDisplay.classList.remove("hide");
  } else {
    phoneticDisplay.classList.add("hide");
  }

  if(phonetic.audio) {
    playButton.classList.remove("hide");
    phoneticPlayback.src = phonetic.audio;
  } else {
    playButton.classList.add("hide");
  }

  let meanings = document.getElementById("meanings");
  meanings.replaceChildren();

  for (const meaning of json[0].meanings) {
    displayMeaning(meaning);
  }

  let result = document.getElementById("word-search-result");
  result.innerHTML = json[0].word;

  let source = document.querySelector("#source p a");
  let sourceUrl = json[0].sourceUrls[0];
  let sourceContainer = document.getElementById("source");

  if(sourceUrl) {
    source.innerHTML = sourceUrl;
    source.href = sourceUrl;
    sourceContainer.classList.remove("hide");
  } else {
    sourceContainer.classList.add("hide");
  }

}

function displayMeaning(meaning) {
  let meaningTemplate = document.getElementById("meaning-template");
  let domElement = meaningTemplate.cloneNode(true);
  let definitionTemplate = domElement.querySelector("ul li");
  let definitionList = domElement.querySelector("ul");

  domElement.removeAttribute("id");
  domElement.classList.remove("hide");

  let partOfSpeech = domElement.querySelector("h2");
  partOfSpeech.innerHTML = meaning.partOfSpeech;

  let container = document.getElementById("meanings");
  container.appendChild(domElement);

  for (const definition of meaning.definitions) {
    displayDefinition(definition, definitionTemplate, definitionList);
  }
  definitionTemplate.remove();
  console.log(meaning);

  handleSynonymsAntonyms(meaning.synonyms, domElement, ".synonyms");
  handleSynonymsAntonyms(meaning.antonyms, domElement, ".antonyms");
}

function handleSynonymsAntonyms(wordList, domElement, className) {
  if (wordList.length > 0) {
    let synonymList = domElement.querySelector(className + " p");

    for (const synonym of wordList) {
      let synonymLink = document.createElement("a");
      let space = document.createTextNode("\xa0\xa0\xa0 ");
      synonymLink.innerHTML = synonym;
      synonymLink.addEventListener("click", () => {
        searchWord(synonym);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        input.value = synonym;
      });
      synonymList.appendChild(synonymLink);
      synonymList.appendChild(space);
    }
  } else {
    let synonymSection = domElement.querySelector(className);
    synonymSection.remove();
  }
}

function displayDefinition(definition, template, parentNode) {
  let domElement = template.cloneNode(true);
  let definitionText = domElement.querySelector("p.definition-text");
  definitionText.innerHTML = definition.definition;

  let exampleText = domElement.querySelector("p.example");
  if (definition.example) {
    exampleText.innerHTML = definition.example;
  } else {
    exampleText.remove();
  }

  parentNode.appendChild(domElement);
}

function findPhonetics(json) {
  for (const phonemes of json.phonetics) {
    if (phonemes.audio) {
      return {
        text: phonemes.text,
        audio: phonemes.audio,
      };
    }
  }
  return json.phonetic;
}


