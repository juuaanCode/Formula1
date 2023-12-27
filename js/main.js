/**
 * @file Archivo principal de la página.
 * @author juagonz0
 */

var anoSeleccionado = 2022;
var ancho = 500
var alto = 500
var margen = 30
var radio = Math.min(ancho, alto)/2 - margen
var colors = ["gold","silver","rgb(205, 127, 50)","lightblue"] // Oro, plata, bronce y el resto.

/**
 * Dado un conjunto de datos, lo filtra en función del año seleccionado
 * @param {*} datos 
 * @returns El conjunto de datos correspondiente al año seleccionado
 */
function filtrarDatos(datos){
    var datosFiltrados = datos.filter(function(d){
        if (parseInt(d["year"]) == anoSeleccionado){
            return d;
        }
    })
    return(datosFiltrados);
}

/**
 * Función principal del programa. 
 * Registra el evento de movimiento del deslizador y lo asocia con una función que actualiza los gráficos
 */
function main(){
    var slider = document.getElementById("sliderAno");
    var indicadorAno = document.getElementById("indicadorAno");
    slider.addEventListener("input", actualizar_graficos);
    actualizar_graficos();

    /**
     * Llama a las funciones respectivas de cada gráfico para actualizarse.
     * También actualiza el indicador del año seleccionado.
     */
    function actualizar_graficos(){
        anoSeleccionado = slider.value;
        indicadorAno.textContent = "AÑO: " + anoSeleccionado;
        dibujar_pilotos();
        dibujar_constructores();
    }
}
