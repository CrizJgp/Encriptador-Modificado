const btnEncriptar = document.querySelector("#bottonEncrip");
const btnDesencriptar = document.querySelector("#bottonDesencrip");
const cajatexto = document.querySelector("#texto-encriptado");
const textoResultado = document.querySelector("#texto-info");
const resultContainer = document.querySelector("#texto-info");
const robotContainer = document.querySelector("#imagen-robot");
const textContainer = document.querySelector("#instruc-usuario");
const btnCopiar = document.querySelector("#bottonCopy");
const errorMessage = document.querySelector("#error-mj");
let resultado = "";

const remplazar = [
    ["a", "ai"],
    ["e", "enter"],
    ["i", "imes"],
    ["o", "ober"],
    ["u", "ufat"],
];

const decrypter = Object.fromEntries(
  remplazar.map(([key, value]) => [value, key])
);

eventListeners();

function eventListeners() {
  btnEncriptar.addEventListener("click", encriptar);
  btnCopiar.addEventListener("click", copiarTexto);
  btnDesencriptar.addEventListener("click", desencriptar);
}

function encriptarTexto(mensaje) {
  limpiarPantalla();
  if (mensaje.length === 0) return;
  let text = mensaje.toLowerCase(); // Cambia las letras a minúsculas
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina acentos y diacríticos
  text = text.replace(/[^a-z\s]/g,""); // Elimina caracteres no alfabéticos pero conserva los espacios
  let finalText = "";

  for (let i = 0; i < text.length; i++) {
    if (!remplazar.map(x => x[0]).includes(text[i]) || text[i] == " ") {
      finalText += text[i];
      continue;
    } else {
      for (let j = 0; j < remplazar.length; j++) {
        if (text[i] === remplazar[j][0]) {
          finalText += remplazar[j][1];
          break;
        }
      }
    }
  }

  resultContainer.classList.remove("oculto");
  btnCopiar.style.display = "block";
  ocultarDiv();
  return finalText;
}

function desencriptarTexto(mensaje) {
  limpiarPantalla();
  if (mensaje.length === 0) return;
  let text = mensaje.toLowerCase(); // Cambia las letras a minúsculas
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina acentos y diacríticos
  text = text.replace(/[^a-z\s]/g,""); // Elimina caracteres no alfabéticos pero conserva los espacios
  let textoFinal = "";
  let i = 0;

  while (i < text.length) {
    let found = false;

    for (let key in decrypter) {
      if (text.substr(i, key.length) === key) {
        textoFinal += decrypter[key];
        i += key.length;
        found = true;
        break;
      }
    }

    if (!found) {
      textoFinal += text[i];
      i++;
    }
  }
  ocultarDiv();
  return textoFinal;
}

function ocultarDiv() {
  robotContainer.classList.add("oculto");
  textContainer.style.display = "none";
}

function encriptar(e) {
  e.preventDefault();

  const textoAEncriptar = cajatexto.value;

  if (textoAEncriptar.trim() === "") {
    errorMessage.style.display = "inline-block";
  } else {
    errorMessage.style.display = "none";
    textoResultado.innerText = encriptarTexto(textoAEncriptar);
    cajatexto.value = '';
    robotContainer.classList.add("oculto");
    textContainer.style.display = 'none';
    btnCopiar.style.display = 'block';
  }
}

function copiarTexto() {
  const texto = textoResultado.textContent;
  resultado = texto;
  navigator.clipboard.writeText(texto);
  btnCopiar.innerText = "Texto Copiado";
  setTimeout(() => {
    btnCopiar.innerText = "Copiar";
    textoResultado.innerText = "Ningún mensaje fue encontrado";
    textContainer.style.display = 'block';
    btnCopiar.style.display = 'none';
    limpiarPantalla();
  }, 1000); 
}

function desencriptar(e) {
  e.preventDefault();

  const textoDesencriptar = cajatexto.value;

  if (textoDesencriptar.trim() === "") {
    errorMessage.style.display = "inline-block";
  } else {
    errorMessage.style.display = "none";
    textoResultado.innerText = desencriptarTexto(textoDesencriptar);
    cajatexto.value = '';
    robotContainer.classList.add("oculto");
    btnCopiar.style.display = 'block';
    textContainer.style.display = 'none';
  } 
}

function limpiarPantalla() {
  textoResultado.innerText = "Ningún mensaje fue encontrado";
  robotContainer.classList.remove("oculto");
}