import { api } from "./server";

const form = document.querySelector('#form');
const input = document.querySelector('#url');
const content = document.querySelector('#content');


const setContent = (msg) => {
  content.textContent = msg; 
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  content.classList.add("placeholder")

  const videoURL = input.value;

  if (!videoURL.includes("shorts")) {
    return setContent("Esse vídeo não parece ser um short.");
  }

  const [_, params] = videoURL.split('/shorts/');
  const [videoID] = params.split("?si");
  setContent("Obtendo o texto do áudio...")

  const transcription = await api.get(`/summary/${videoID}`);
  setContent("Realizando o resumo...");

  const summary = await api.post("/summary", {
    text: transcription.data.result,
  })
  setContent(summary.data.result);
  content.classList.remove("placeholder")
})