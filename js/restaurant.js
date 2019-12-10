var Restaurant = function (id, nombre, rubro, ubicacion, horarios, imagen, calificaciones) {
    this.id = id;
    this.nombre = nombre;
    this.rubro = rubro;
    this.ubicacion = ubicacion;
    this.horarios = horarios;
    this.imagen = imagen;
    this.calificaciones = calificaciones;
}

Restaurant.prototype.reservarHorario = function (horarioReservado) {
    this.horarios = this.horarios.filter(horario => horario !== horarioReservado)
}

Restaurant.prototype.calificar = function (nuevaCalificacion) {
    if (Number.isInteger(nuevaCalificacion) && nuevaCalificacion > 0 && nuevaCalificacion <= 10) {
        this.calificaciones.push(nuevaCalificacion);
    }
}

Restaurant.prototype.obtenerPuntuacion = function () {
    var calificaciones = this.calificaciones;

    if (calificaciones.length === 0) {
        return 0;
    }

    return promedio(sumatoria(calificaciones), calificaciones.length);
}

function promedio(numTotal, numDivisor) {
    return Math.round(numTotal / numDivisor);
}

function sumatoria(arrayNum) {
    var total = 0;

    arrayNum.forEach(numero => total += numero);

    return total;
}