const canvas = document.getElementById("canvas");
canvas.width = 400;
canvas.height = 400;

let context = canvas.getContext("2d");
let start_background_color = "rgba(0,0,0,0)"


let image = new Image();
image.onload = function() {
	clear_canvas();
};

//Relleno
let relleno = document.getElementById('rellenoBlanco');
relleno.crossOrigin = 'Anonymous';

//Pergamino
 // context.drawImage(pergamino,33,257);

clear_canvas();

const original_images = document.getElementsByClassName("img");

//VARIABLES PARA GANAR
let totalPintadas = 0;
let nombresPegados = 0;
let totalNombres = original_images.length;

let brush = document.getElementById("brush-icon");
let draw_color = "#000000";
let draw_width = "20";
let is_drawing = false;



canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);



//Variables para las imagenes
for (let index = 0; index < original_images.length; index++) {
	//Eventos de DragOver and DragLeave generales
	original_images[index].addEventListener("dragover", dragover, false);
	original_images[index].addEventListener("dragleave", dragleave, false);
	//Eventos de Drag and Drop de los Stickers
	original_images[index].addEventListener("drop", drop, false);
	//Eventos de Drag and Drop de los Pergaminos
	original_images[index].addEventListener("drop", dropPergamino, false);

	original_images[index].crossOrigin = 'Anonymous';
	original_images[index].draggable = false;
	original_images[index].pintada = false;
	original_images[index].elegible = true;
}



function change_color(element) {
	draw_color = element.style.background;
	brush.style.color = draw_color;
}

function start(event) {
	is_drawing = true;
	context.beginPath();
	context.moveTo(event.clientX - canvas.offsetLeft, 
				   event.clientY - canvas.offsetTop);
	event.preventDefault();
}

function draw(event) {
	if ( is_drawing) {
		context.lineTo(event.clientX - canvas.offsetLeft, 
				       event.clientY - canvas.offsetTop);
		context.strokeStyle = draw_color;
		context.lineWidth = draw_width;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.stroke();
		context.drawImage(image, 0, 0);
	}
	event.preventDefault();
}

function stop(event) {
	if ( is_drawing ) {
		context.stroke();
		context.closePath();
		is_drawing = false;
		context.drawImage(image, 0, 0);
	}
	event.preventDefault();
}

function clear_canvas() {
	limpiar_canvas();
	context.drawImage(relleno, 0, 0);
	context.drawImage(image, 0, 0);
}

function limpiar_canvas(){
	context.fillStyle = start_background_color;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);
}

let sticker;
function Save() {  
	let imgSrc = canvas.toDataURL('image/png');
	sticker = document.createElement('img');
	sticker.className = 'sticker';
	sticker.src = imgSrc;
	sticker.id = image.id;
	sticker.dragstart = "drag(event)";
	sticker.crossOrigin = 'Anonymous';
	limpiar_canvas();
	let gridBottom = document.getElementById('gridBottom');
	gridBottom.appendChild(sticker);
	sticker.addEventListener('dragstart', drag, false);

	for (let index = 0; index < original_images.length; index++) {
		original_images[index].elegible = false;
		original_images[index].style.cursor = "default"
	}

	ocultarSector('field');
	mostrarSector('characters');
	cambiarInfo("Paste the STICKER in the right place >>",'#ff9e59');

}

function change_image(element) {
	if(element.elegible){
		asignarImagen(element);
		clear_canvas();

		ocultarSector('characters');
		mostrarSector('field');
		cambiarInfo("Paint the character, then press SAVE to create a sticker",'#3CEC88');
	}

}

function asignarImagen(element){
	image.src = element.src;
	image.id = element.id;
	image.crossOrigin = "Anonymous"
}


function ocultarSector(idSector){
	let sector = document.getElementById(idSector);
	sector.style.display = 'none';
}

function mostrarSector(idSector){
	let sector = document.getElementById(idSector);
	sector.style.display = 'flex';	
}

function cambiarInfo(texto,backColor){
	let info = document.getElementById('info');
	info.innerHTML = texto;
	info.style.backgroundColor = backColor;
}


function drag(event){
	event.dataTransfer.setData('Image',event.target.id);
}

function dragover(event){
	event.preventDefault();
	event.target.style.backgroundColor = 'rgba(250,250,120,50)';
}

function dragleave(event){
	event.preventDefault();
	event.target.style.backgroundColor = 'rgba(0,0,0,0)';
}

function drop(event) {
	event.preventDefault();
	event.target.style.backgroundColor = 'rgba(0,0,0,0)';


	const idDrag = event.dataTransfer.getData('Image');
	const idPlace = this.id;

	if(idDrag === idPlace){
		event.target.src = sticker.src;
		event.target.appendChild(sticker);
		sticker.style.display = 'none';
		//Marca la imagen actual como pintada
		event.target.pintada = true;
		totalPintadas++;

		if(totalPintadas === original_images.length){
			//Poner los nombres
			mostrarSector('nombres');
			cambiarInfo("Paste the Names Correctly",'#fff78a');
		}else{
			cambiarInfo("Select a new Character to Paint",'#8aebff');
			volverElegibles();
		}
	
	}
}

//Puede elegirse una nueva imagen (si es que no está pintada)
function volverElegibles(){
	for (let index = 0; index < original_images.length; index++) {
		if(!original_images[index].pintada){
		original_images[index].elegible = true;
		original_images[index].style.cursor = "pointer"
		}	
	}
}

function ganaste(){
	ocultarSector('nombres');
	ocultarSector('info');
	mostrarSector('felicidades');
}

//PERGAMINOS
const pergaminosLista = document.getElementsByClassName('pergamino');
for(let index=0; index<pergaminosLista.length; index++){
	pergaminosLista[index].addEventListener('dragstart', dragPergamino, false);	
	pergaminosLista[index].crossOrigin = 'Anonymous';
}


function dragPergamino(event){
	event.dataTransfer.setData('nombre',event.target.id);
}

function dropPergamino(event){
	event.preventDefault();
	event.target.style.backgroundColor = 'rgba(0,0,0,0)'; //resetear el color de fondo

	//el id del pergamino viene asi: 'name-' + el nombre del personaje
	//se corta la cadeno para obtener solo el nombre y se guarda en dragNombre
	var idCompleto = event.dataTransfer.getData('nombre');
	var arrayId = idCompleto.split('-');
	let dragNombre = arrayId[1];
	let dropNombre = event.target.id;

	
	if(dragNombre == dropNombre){
		let pergamino = document.getElementById(idCompleto);
		image = event.target
		asignarImagen(image);
		agregarPergamino(image,pergamino);

		nombresPegados++;
		if(nombresPegados===totalNombres){
			ganaste();
		}
	}

	console.log(dragNombre);
	console.log(dropNombre);
}

function agregarPergamino(imag,perga){
	limpiar_canvas();
	context.drawImage(imag,0,0);
	context.drawImage(perga,33,257);
	let imgURL = canvas.toDataURL('image/png');
	let nuevaImagen = document.createElement('img');
	nuevaImagen.src = imgURL;
	imag.src = nuevaImagen.src;
	imag.appendChild(perga);
	perga.style.display = 'none';	
	limpiar_canvas();
}





