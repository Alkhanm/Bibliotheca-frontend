// eslint-disable-next-line no-undef
const pdfjs = pdfjsLib
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js";

/* Constroe o objeto de PDF.
* Recebe o URL deste PDF e cria o objeto. 
* Se o argumento não for um URL, irá tentar criar um novo objeto URL usando esse argumento. */
export async function renderPDF(pdf) {
  const url = pdf.constructor.name === "String" ? pdf : URL.createObjectURL(pdf)
  return await pdfjs.getDocument(url).promise;
}

/* Renderiza uma página PDF
* Espera como parâmetro o próprio PDF, o número da página q será renderizada o id do elemento HTML 
* que irá representar essa página (no caso um canvas), e a escala de zoom desta página.
* Se nem um id for passado, ele irá buscar esse elemento e irá renderizar a página nela, 
* se não for irá criar um novo elemento no DOM */
export async function renderPage(pdf, numPage, id, scale = 2) {
  const page = await pdf.getPage(numPage);
  const viewport = page.getViewport({ scale });
  
  const canvas = id ? document.getElementById(id) : document.createElement("canvas")
  
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  const scales = { 1: 3, 2: 5 };
  const defaultScale = 4;
  const scaleFromDevice = scales[window.devicePixelRatio] || defaultScale;
  const displayWidth = 1.9;
  canvas.style.width = `${(viewport.width * displayWidth) / scaleFromDevice}px`;
  canvas.style.height = `${(viewport.height * displayWidth) / scaleFromDevice}px`;

  const renderContext = {
    canvasContext: canvas.getContext("2d"),
    viewport: viewport
  };
  const renderTask = page.render(renderContext)

  await renderTask.promise;

  return canvas
}

/* Cria blob da capa do livro (primeira página do PDF), 
* retorna esse blob junto com a quantidade de páginas */
export async function getBookCover(file) {
  const pdf = await renderPDF(file)
  const page = await renderPage(pdf, 1)
  const img = page.toDataURL("image/jpeg", 0.1)
  const numPages = pdf.numPages
  return { img, numPages }
}


export function getAuxiliaryName(filename) {
  const regExp = /.pdf$|@|-|=|%|#|_|~|\+|\$|\*|\|/g;
  const auxName = filename.replace(regExp, " ");
  const formatedFileName = auxName.replaceAll("  ", "").trim();
  return formatedFileName
}