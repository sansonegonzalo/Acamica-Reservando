var Reserva = function (horario, cantidadPersonas, precioPersona, codigoDescuento) {
    this.horario = horario;                     //      Tipo Date
    this.cantidadPersonas = cantidadPersonas;   //      Int
    this.precioPersona = precioPersona;         //      Int
    this.codigoDescuento = codigoDescuento;     //      String
}


Reserva.prototype.calcularPrecioBase = function () {
    return this.cantidadPersonas * this.precioPersona;
}

Reserva.prototype.calcularPrecioFinal = function () {
    return this.calcularPrecioBase() + this.adicionales() - this.descuentos();
}

Reserva.prototype.descuentos = function () {
    return this.descuentoPorGrupos(this.cantidadPersonas) + this.descuentoCodigo(this.codigoDescuento);
}

Reserva.prototype.adicionales = function () {
    let fecha = this.horario;
    return this.adicionalHorario() + this.adicionalFinSemana(fecha.getDay());
}

Reserva.prototype.descuentoPorGrupos = function (numPersonas) {
    if (numPersonas >= 4 && numPersonas <= 6) {
        return this.porcentajeSobrePrecioBase(5);
    }
    if (numPersonas >= 7 && numPersonas <= 8) {
        return this.porcentajeSobrePrecioBase(10);
    }
    if (numPersonas > 8) {
        return this.porcentajeSobrePrecioBase(15);
    }
    return 0;
}

Reserva.prototype.descuentoCodigo = function (stringCodigo) {
    switch (stringCodigo) {
        case 'DES15':
            return this.porcentajeSobrePrecioBase(15);
        case 'DES200':
            return 200;
        case 'DES1':
            return this.precioPersona;

        default:
            return 0;
    }
}

Reserva.prototype.adicionalHorario = function () {
    let horas = this.horario.getHours();
    let minutos = this.horario.getMinutes();

    return (this.horarioConRecargo(horas, minutos)) ? this.porcentajeSobrePrecioBase(5) : 0;
}

Reserva.prototype.adicionalFinSemana = function (numDia) {
    return (numDia == 0 || numDia > 4) ? this.porcentajeSobrePrecioBase(10) : 0;
}

Reserva.prototype.horarioConRecargo = function (horas, minutos) {
    if (horas == 13 || horas == 20) {
        return true;
    }
    if ((horas == 14 || horas == 21) && minutos == 0) {
        return true;
    }
    return false;
}

Reserva.prototype.porcentajeSobrePrecioBase = function (numPorcentaje) {
    return (this.calcularPrecioBase() * numPorcentaje) / 100;
}