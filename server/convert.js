import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import wav from 'node-wav';

const filePath = './tmp/audio.mp4';
const outputPath = filePath.replace(".mp4", '.wav');

export let progressNum;

export const convert = () => new Promise((resolve, reject) => {
  console.log("Convertendo o vídeo...");

  ffmpeg.setFfmpegPath(ffmpegStatic);
  ffmpeg()
  .input(filePath)
  .audioFrequency(16000)
  .audioChannels(1)
  .format("wav")
  .on("end", () => {
    const file = fs.readFileSync(outputPath);
    const fileDecoded = wav.decode(file);

    const audioData = fileDecoded.channelData[0];
    const floatArray = new Float32Array(audioData);

    console.log("Vídeo convertido com sucesso!");

    resolve(floatArray);
    fs.unlinkSync(outputPath);
  })
  .on("error", (err) => {
    console.log("Erro ao converter o vídeo", err);
    reject(err)
  })
  .on("progress", (progress) => {
    progressNum = Math.round(progress.progress * 100);
  })
  .save(outputPath)
})