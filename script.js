const $letters = document.querySelector('.letters');
const $word = document.querySelector('.word');
const $hangman = document.querySelector('.hangman')
const $used = document.querySelector('.used')
const $body = document.querySelector('body')
const $title = document.querySelector('.title')
const $again = document.querySelector('.again')
const $score = document.querySelector('.score')
let $letter = document.querySelectorAll('.letter');
let puntaje = 0;
let encontrada = false;
let iguales = false;
let intentos = 0;
let letra_seleccionada = '';
let letras_usadas = '';
let palabra_en_cuadro = [];
let palabra_parcial = '';
let palabra_clave_string = elegir_palabra();
let palabra_clave = palabra_clave_string.split("");
let longitud_palabra = palabra_clave.length;
$hangman.style['background-image'] = `url('images/hangman${intentos}.png')`
$again.addEventListener('key', jugar_otra_vez)


dibujar_letras();
dibujar_rayas();
agregar_event_listener();

function elegir_palabra() {
    let paises_string = `
AFGANISTAN
ALBANIA
ALEMANIA
ANDORRA
ANGOLA
ARGELIA
ARGENTINA
ARMENIA
AUSTRALIA
AUSTRIA
AZERBAIYAN
BAHAMAS
BANGLADES
BARBADOS
BAREIN
BELGICA
BELICE
BENIN
BIELORRUSIA
BIRMANIA
BOLIVIA
BOTSUANA
BRASIL
BRUNEI
BULGARIA
BURUNDI
BUTAN
CAMBOYA
CAMERUN
CANADA
CATAR
CHAD
CHILE
CHINA
CHIPRE
COLOMBIA
COMORAS
CUBA
DINAMARCA
DOMINICA
ECUADOR
EGIPTO
ERITREA
ESLOVAQUIA
ESLOVENIA
ESPAÑA
ESTONIA
ETIOPIA
FILIPINAS
FINLANDIA
FIYI
FRANCIA
GABON
GAMBIA
GEORGIA
GHANA
GRANADA
GRECIA
GUATEMALA
GUYANA
GUINEA
HAITI
HONDURAS
HUNGRIA
INDIA
INGLATERRA
INDONESIA
IRAK
IRAN
IRLANDA
ISLANDIA
ISRAEL
ITALIA
JAMAICA
JAPON
JORDANIA
KAZAJISTAN
KENIA
KIRGUISTAN
KIRIBATI
KUWAIT
LAOS
LESOTO
LETONIA
LIBANO
LIBERIA
LIBIA
LIECHTENSTEIN
LITUANIA
LUXEMBURGO
MADAGASCAR
MALASIA
MALAUI
MALDIVAS
MALI
MALTA
MARRUECOS
MAURICIO
MAURITANIA
MEXICO
MICRONESIA
MOLDAVIA
MONACO
MONGOLIA
MONTENEGRO
MOZAMBIQUE
NAMIBIA
NAURU
NEPAL
NICARAGUA
NIGER
NIGERIA
NORUEGA
OMAN
PAKISTAN
PALAOS
PANAMA
PARAGUAY
PERU
POLONIA
PORTUGAL
RUANDA
RUMANIA
RUSIA
SAMOA
SENEGAL
SERBIA
SEYCHELLES
SINGAPUR
SIRIA
SOMALIA
SUAZILANDIA
SUDAFRICA
SUDAN
SUECIA
SUIZA
SURINAM
TAILANDIA
TANZANIA
TAYIKISTAN
ORIENTAL
TOGO
TONGA
TUNEZ
TURKMENISTAN
TURQUIA
TUVALU
UCRANIA
UGANDA
URUGUAY
UZBEKISTAN
VANUATU
VENEZUELA
VIETNAM
YEMEN
YIBUTI
ZAMBIA
ZIMBABUE`
    let paises_array = paises_string.split('\n')
    let pais = paises_array[Math.floor(Math.random() * paises_array.length)];
    return pais
}

function jugar_otra_vez() {
    $letters.innerHTML = ''
    encontrada = false;
    iguales = false;
    intentos = 0;
    puntaje = 0;
    letra_seleccionada = '';
    letras_usadas = '';
    palabra_en_cuadro = [];
    palabra_parcial = '';
    palabra_clave_string = elegir_palabra();
    palabra_clave = palabra_clave_string.split("");
    longitud_palabra = palabra_clave.length;
    $body.style['background-color'] = 'rgba(150, 215, 253, 0.863)'
    $hangman.style['background-image'] = `url('images/hangman${intentos}.png')`
    $used.innerHTML = '&nbsp'
    $title.textContent = 'Categoría: Paises'
    dibujar_letras();
    dibujar_rayas();
    agregar_event_listener();
}

function agregar_event_listener() {
    $letter = document.querySelectorAll('.letter');

    for (i = 0; i < $letter.length; i++) {
        $letter[i].addEventListener('click', obtener_letra_pulsada);
    }
    $body.addEventListener('keypress', obtener_tecla_presionada)
    $body.addEventListener('keypress',function(e){
        if(e.key == 'Enter'){
            jugar_otra_vez()
        }
    })
}

function obtener_letra_pulsada(element) {
    letra_seleccionada = String(element.target.innerText).replace(/\s+/g, '');
    if (!letras_usadas.includes(letra_seleccionada)) {
        element.target.remove();
        jugar_letra();
    }
}

function obtener_tecla_presionada(e) {
    if (!letras_usadas.includes(e.key.toUpperCase())) {
        letra_seleccionada = e.key.toUpperCase();
        jugar_letra();
    }
}

function jugar_letra() {
    encontrada = false;
    palabra_clave.forEach(comparar_letras);
    if (!encontrada) {
        restar_vida()
        guardar_letra_usada()
    }

    iguales = comparar_arrays(palabra_en_cuadro, palabra_clave);

    if (iguales) {
        ganar()
    }
    actualizar_cuadro();
}

function restar_vida() {
    intentos = intentos + 1;

    if (intentos > 6) {
        perder()
    }
    else {
        $hangman.style['background-image'] = `url('images/hangman${intentos}.png')`
    }
}

function guardar_letra_usada() {
    letras_usadas += letra_seleccionada;
    $used.textContent += letra_seleccionada + ', ';
}

function ganar() {
    $body.style['background-color'] = 'rgb(149, 241, 136)'
    remover_event_listeners();
    puntaje = puntaje + 1;
    $score.textContent = 'Puntaje: ' + puntaje
}

function perder() {
    $body.style['background-color'] = 'rgba(209, 61, 61, 0.45)';
    $title.textContent += ' (' + palabra_clave_string + ')';
    remover_event_listeners();
    puntaje = puntaje - 1;
    $score.textContent = 'Puntaje: ' + puntaje

}

function remover_event_listeners() {
    for (i = 0; i < $letter.length; i++) {
        $letter[i].removeEventListener('click', obtener_letra_pulsada);
    }
    $body.removeEventListener('keypress', obtener_tecla_presionada)
}

function dibujar_letras() {

    for (i = 65; i < 91; i++) {
        let div_letra = document.createElement("DIV");
        $letters.appendChild(div_letra);
        div_letra.className = 'letter'
        div_letra.textContent = String.fromCharCode(i);
        if (i == 78){
            let div_letra = document.createElement("DIV");
            $letters.appendChild(div_letra);
            div_letra.className = 'letter'
            div_letra.textContent = String.fromCharCode(209);
        }
    }
}


function dibujar_rayas() {

    for (i = 0; i < longitud_palabra; i++) {
        palabra_en_cuadro.push('_');
    }
    actualizar_cuadro();
}

function actualizar_cuadro() {
    let aux = palabra_en_cuadro.toString();
    palabra_parcial = aux.replace(/,/g, " ");
    $word.textContent = palabra_parcial;
}

function comparar_arrays(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function comparar_letras(letra_palabra, index) {
    if (letra_palabra == letra_seleccionada) {
        palabra_en_cuadro[index] = letra_seleccionada;
        encontrada = true;
    }
}
