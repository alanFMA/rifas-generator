const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

// Definindo as dimensões da folha A4 em pixels a 300 DPI no modo paisagem
const A4_WIDTH = 3508; // Largura em pixels (A4 na horizontal)
const A4_HEIGHT = 2480; // Altura em pixels (A4 na horizontal)

const baseImagePath = "./bilhetes13.png"; // Caminho da imagem base
const outputDir = "./output/";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const ticketsPerSheet = 6; // Quantas riffas por folha (6 por folha)
const startNumber = 145; // Número inicial (por exemplo, 101)
const endNumber = 288; // Número final (por exemplo, 200)
const rows = 3; // Número de linhas (3 linhas)
const cols = 2; // Número de colunas (2 colunas)

// Calcular as posições com base no tamanho da imagem e na disposição desejada
const ticketWidth = A4_WIDTH / cols; // Largura de cada imagem na folha
const ticketHeight = A4_HEIGHT / rows; // Altura de cada imagem na folha

// Posições X e Y para cada imagem
const xOffsets = [0, ticketWidth]; // Posições X para as 2 colunas
const yOffsets = [0, ticketHeight, 2 * ticketHeight]; // Posições Y para as 3 linhas

async function generateRaffleSheets(
  baseImagePath,
  outputDir,
  ticketsPerSheet,
  startNumber,
  endNumber,
) {
  const baseImage = await loadImage(baseImagePath);

  let sheetNumber = 1;
  let currentNumber = startNumber;

  while (currentNumber <= endNumber) {
    const canvas = createCanvas(A4_WIDTH, A4_HEIGHT);
    const ctx = canvas.getContext("2d");

    // Limpa o fundo da folha A4
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

    for (let j = 0; j < ticketsPerSheet; j++) {
      if (currentNumber > endNumber) break;

      const row = Math.floor(j / cols);
      const col = j % cols;

      const x = xOffsets[col];
      const y = yOffsets[row];

      // Desenhar a imagem na folha A4
      ctx.drawImage(baseImage, x, y, ticketWidth, ticketHeight);

      // Formatar o número com zeros à esquerda
      const formattedNumber = currentNumber.toString().padStart(3, "0");

      // Adicionar o número da rifa do lado da palavra "RUBACÃO"
      ctx.font = "bold 27px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "left";
      ctx.fillText(formattedNumber, x + 56, y + 120);

      // Adicionar o número da rifa na área do "NÚMERO DO BILHETE:"
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "left";
      ctx.fillText(formattedNumber, x + 1600, y + ticketHeight - 675);

      currentNumber++;
    }

    const outputPath = `${outputDir}/raffle-sheet-${sheetNumber}.jpg`;
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync(outputPath, buffer);

    console.log(`Sheet ${sheetNumber} saved at ${outputPath}`);
    sheetNumber++;
  }
}

generateRaffleSheets(
  baseImagePath,
  outputDir,
  ticketsPerSheet,
  startNumber,
  endNumber,
);
