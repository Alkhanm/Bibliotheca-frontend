// eslint-disable-next-line no-undef
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "//mozilla.github.io/pdf.js/build/pdf.worker.js";

export async function renderPDF(urlPDF) {
  const url = urlPDF.constructor.name === "String" ? urlPDF :
           URL.createObjectURL(urlPDF) 
  // eslint-disable-next-line no-undef
  const pdf = await pdfjsLib.getDocument(url).promise;
  return pdf;
}

export async function renderPage(pdf, numPage, id, scale = 2) {
  const scales = { 1: 3.3, 2: 4};
  const defaultScale = 4;
  const scaleFromDevice = scales[window.devicePixelRatio] || defaultScale;
  
  const page = await pdf.getPage(numPage);

  const viewport = page.getViewport({ scale });

  const canvas = id ? 
    document.getElementById(id) : 
    document.createElement("canvas")

  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const displayWidth = 1.7;
  canvas.style.width = `${(viewport.width * displayWidth) / scaleFromDevice}px`;
  canvas.style.height = `${(viewport.height * displayWidth) / scaleFromDevice}px`;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  const renderTask = page.render(renderContext);
try {
  await renderTask.promise;
  return canvas
} catch (err){
 alert(err)
}

}