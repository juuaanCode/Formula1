/**
 * @file Archivo para el gráfico de constructores.
 * @author juagonz0
 */

/**
 * Función que se encarga de dibujar el gráfico de constructores,
 * borrando previamente todo lo que haya.
 * Tiene en cuenta que antes de 1958 no existía este campeonato.
 */
function dibujar_constructores(){
    // Limpieza
    d3.select("#grafico_2").html("");

    // Creamos el tooltip para los detalles de cada trozo
    var tooltipdiv = d3.select("body").append("div")
        .attr("class", "tooltip-pie");

    d3.csv("data/mundialconstructores.csv").then(function(data){
        if (anoSeleccionado < 1958){
            d3.select("#grafico_2")
                .attr("width", ancho)
                .attr("height", alto)
                .append('text')
                .attr('x', 250)
                .attr('y', 250)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr('width', 50)
                .attr('height', 100)
                .html("No existía este campeonato.")
            return
        }
        
        var datos = filtrarDatos(data, anoSeleccionado);
        
        // Fabricamos el cuarto trozo, el resto
        var resto = [];
        resto.points = 0;
        var numresto = datos.length - 3;
        resto.name = "Otros " +  numresto + " constructores";
        for (var i = 3; i < datos.length; i++) {
            resto.points += parseFloat(datos[i].points);
        }
        var datosRepresentacion = [datos[0], datos[1], datos[2], resto];

        // Dibujado de los trozos
        let generator = d3.pie()
            .value((d) => d.points)
            .padAngle(.03)
            .sort(null)
        let chart = generator(datosRepresentacion);
        let angleInterpolation = d3.interpolate(generator.startAngle()(), generator.endAngle()()); // Necesario para la animación
        let arc = d3.arc();
        d3.select("#grafico_2")
            .attr("width", ancho)
            .attr("height", alto)
            .append("g")
            .attr("transform", "translate(" + ancho / 2 + "," + alto / 2 + ")")
            .selectAll("path")
            .data(chart)
            .enter()
            .append("path")
            .style("fill", (d, i) => colors[i])
            .attr("stroke", "black")
            .attr("stroke-width", "0.5")
            // Eventos
            .on("mouseover", function(event,d){
                d3.select(this).transition()
                    .duration(100)
                    .attr("opacity", ".5");
                tooltipdiv.html(d.data.name + "<br>" + d.data.points + " puntos")
                    .style("left", (event.pageX+10)+"px")
                    .style("top", (event.pageY-15)+"px")
                    .transition()
                    .duration(100)
                    .style("opacity", 1);                    
            })
            .on("mouseout", function(){
                d3.select(this).transition()
                    .duration(300)
                    .attr("opacity", 1);
                tooltipdiv
                    .transition()
                    .duration(300)
                    .style("opacity", 0);
            })
            // Animación de carga
            .transition()
                .duration(1000)
                .attrTween("d", d => {
                let originalEnd = d.endAngle;
                return t => {
                    let currentAngle = angleInterpolation(t);
                    if (currentAngle < d.startAngle) {
                    return "";
                    }

                    d.endAngle = Math.min(currentAngle, originalEnd);
                    d.innerRadius = 140;
                    d.outerRadius = radio;

                    return arc(d);
                };
                });

        // Texto central
        var total_puntos = 0;
        var num_constructores = 0;
        datos.forEach(i => {
            total_puntos += parseFloat(i.points);
            num_constructores++;
        });
        var puntos_3_primeros = Math.round((parseFloat(datos[0].points) + parseFloat(datos[1].points) + parseFloat(datos[2].points))/total_puntos*100);
        var porcent_3_primeros = Math.round(3/num_constructores*100);
        d3.select("#grafico_2")
            .append('text')
            .style("opacity", 0)
            .attr('x', 195)
            .attr('y', 200)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-weight", "bold")
            .style("font-size", "40pt")
            .html(porcent_3_primeros + "%")
            .transition()
                .duration(1000)
                .style("opacity",1);
        d3.select("#grafico_2")
            .append('text')
            .style("opacity", 0)
            .attr('x', 300)
            .attr('y', 215)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .html(" de los equipos")
            .transition()
            .duration(1000)
            .style("opacity",1);
        d3.select("#grafico_2")
            .append('text')
            .style("opacity", 0)
            .attr('x', 250)
            .attr('y', 250)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-style", "italic")
            .html("acumularon el")
            .transition()
                .duration(1000)
                .style("opacity",1); 
        d3.select("#grafico_2")
            .append('text')
            .style("opacity", 0)
            .attr('x', 195)
            .attr('y', 300)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-weight", "bold")
            .style("font-size", "40pt")
            .html(puntos_3_primeros + "%")
            .transition()
                .duration(1000)
                .style("opacity",1);        
        d3.select("#grafico_2")
            .append('text')
            .style("opacity", 0)
            .attr('x', 300)
            .attr('y', 315)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .html(" de los puntos")
            .transition()
                .duration(1000)
                .style("opacity",1);
    })
}