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
  let result = document.getElementById("word-search-result");

  result.innerHTML = json[0].word;
}