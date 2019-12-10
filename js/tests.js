var expect = chai.expect;

var resto = new Restaurant();

// test de funciones del objeto Restaurant

describe('Test en Restaurant.reservarHorarios(horario)', function () {
  it('Cuando se reserva un horario, el horario se elimina del arreglo', function () {
    resto.horarios = ['14:00', '15:00'];
    resto.reservarHorario('15:00');
    expect(resto.horarios).to.eql(['14:00']);
  })

  it(
    'Si se reserva un horario q el resto no posee, el arreglo se mantiene igual'
    ,
    function () {
      resto.horarios = ['14:00'];
      resto.reservarHorario('17:00');
      expect(resto.horarios).to.eql(['14:00']);
    })

  it('Si se intenta reservar un horario pero no se pasa parametro a la funcion, el arreglo se mantiene igual',
    function () {
      resto.horarios = ['14:00'];
      resto.reservarHorario();
      expect(resto.horarios).to.eql(['14:00']);
    })
});

describe('Test en funcion obtenerPuntuacion()', function () {
  it('Que se calcule correctamente el promedio de las puntuaciones', function () {
    resto.calificaciones = [10, 8];
    expect(resto.obtenerPuntuacion()).to.eql(9);
  })
  it('Si un resto no tiene calificacion alguna, la puntuacion sea cero', function () {
    resto.calificaciones = [];
    expect(resto.obtenerPuntuacion()).to.eql(0);
  })
});

describe('Test de la funcion calificar()', () => {
  it('Que solo acepte numeros enteros', () => {
    expect(resto.calificar(9.5)).to.eql(undefined);
  })
  it('Que no acepte numeros menores a 1 y mayores a 10', () => {
    expect(resto.calificar(0)).to.eql(undefined);
    expect(resto.calificar(11)).to.eql(undefined);
  })
  it('Que acepte numeros enteros entre 1 a 10 y los agregue a la lista de calificaciones correctamente', () => {
    resto.calificaciones = [10, 8];
    resto.calificar(10);
    expect(resto.calificaciones).to.eql([10, 8, 10])
  });
});

// test de funciones del objeto Listado

var listadoDeRestaurantes = [
  new Restaurant(1, "TAO Uptown", "Asiática", "Nueva York", ["13:00", "15:30", "18:00"], "../img/asiatica1.jpg", [6, 7, 9, 10, 5]),
  new Restaurant(2, "Mandarín Kitchen", "Asiática", "Londres", ["15:00", "14:30", "12:30"], "../img/asiatica2.jpg", [7, 7, 3, 9, 7]),
  new Restaurant(3, "Burgermeister", "Hamburguesa", "Berlín", ["11:30", "12:00", "22:30"], "../img/hamburguesa4.jpg", [5, 8, 4, 9, 9])
];

var listado = new Listado(listadoDeRestaurantes);


describe('Test funcion buscarRestaurante(id)', () => {
  it('Que devuelva un restaurante segun id valido', () => {
    expect(listado.buscarRestaurante(2)).to.eql(listadoDeRestaurantes[1]);
  })
  it('En caso de no encontrar restaurante con dicho id devuelva un mensaje', () => {
    expect(listado.buscarRestaurante(4)).to.eql("No se ha encontrado ningún restaurant")
  })
});

describe('Test funcion obtenerRestaurantes()', () => {
  it('devolver la lista completa de restaurantes si se pasa como valor null a todos los paramentros', () => {
    expect(listado.obtenerRestaurantes(null, null, null)).to.eql(listadoDeRestaurantes);
  })
  it('devolver restaurant segun rubro', () => {
    expect(listado.obtenerRestaurantes('Asiática', null, null)).to.eql([listadoDeRestaurantes[0], listadoDeRestaurantes[1]]);
  })
  it('devolver restaurant segun ciudad', () => {
    expect(listado.obtenerRestaurantes(null, 'Londres', null)).to.eql([listadoDeRestaurantes[1]]);
  })
  it('devolver restaurant segun horario', () => {
    expect(listado.obtenerRestaurantes(null, null, '11:30')).to.eql([listadoDeRestaurantes[2]]);
  })
  it('devolver restaurant segun rubro,ciudad y horario', () => {
    expect(listado.obtenerRestaurantes('Hamburguesa', 'Berlín', '11:30')).to.eql([listadoDeRestaurantes[2]]);
  })
})

// Test sobre Reserva

// Viernes 24 de Agosto
var reserva1 = new Reserva(new Date(2018, 7, 24, 11, 00), 8, 350, "DES1");

// Lunes 27 de Agosto
var reserva2 = new Reserva(new Date(2018, 7, 27, 14, 10), 2, 150, "DES200");

// Test sobre Descuentos

describe('Test sobre descuentoPorGrupos(numPersonas)', () => {
  it('Dada una reserva de 8 personas, se tiene q aplicar un descuento del 10% sobre el precio base', () => {
    expect(reserva1.descuentoPorGrupos(reserva1.cantidadPersonas)).to.eql(280)
  })
  it('Dada una reserva de 2 personas, se tiene q aplicar un descuento del 0% sobre el precio base', () => {
    expect(reserva2.descuentoPorGrupos(reserva2.cantidadPersonas)).to.eql(0)
  })
})

describe('Test sobre descuentoCodigo(stringCodigo)', () => {
  it('Dado un codigo DES1, se tiene q aplicar un descuento sobre el valor de una persona', () => {
    expect(reserva1.descuentoCodigo(reserva1.codigoDescuento)).to.eql(reserva1.precioPersona)
  })
  it('Dado un codigo DES200, se tiene q aplicar un descuento de 200', () => {
    expect(reserva2.descuentoCodigo(reserva2.codigoDescuento)).to.eql(200)
  })
})

describe('Test sobre descuentos()', () => {
  it('Dado los descuentos sobre el codigo DES1 y por grupos, se suman entre si para dar con el descuento final', () => {
    expect(reserva1.descuentos()).to.eql(reserva1.precioPersona + 280)
  })
  it('Dado los descuentos sobre el codigo DES200 y por grupos(en este caso no aplica por ser un grupo reducido), se suman entre si para dar con el descuento final', () => {
    expect(reserva2.descuentos()).to.eql(200 + 0)
  })
})

// Test sobre Adicionales
describe('Test sobre adicionalHorario(fecha)', () => {
  it('Dado que las 11 horas no es horario concurrido, recargo tiene q ser 0', () => {
    expect(reserva1.adicionalHorario(reserva1.horario)).to.eql(0)
  })
  it('Dado que las 14:10 hs ya no es un horario concurrido(solo de 13hs a 14hs y 20hs a 21hs) tiene que dar 0', () => {
    expect(reserva2.adicionalHorario()).to.eql(0)
  })
})

describe('Test sobre adicionalFinSemana(fecha)', () => {
  it('Dado que esta reserva es un Viernes, tiene que haber un 10% adicional sobre el precio base', () => {
    expect(reserva1.adicionalFinSemana(reserva1.horario.getDay())).to.eql(reserva1.porcentajeSobrePrecioBase(10))
  })
  it('Dado que esta reserva es un Lunes, no hay recargo adicional', () => {
    expect(reserva2.adicionalFinSemana(reserva2.horario.getDay())).to.eql(0)
  })
})

describe('Test sobre adicionales()', () => {
  it('En la primer reserva solo se hizo un adicional del 10%, un total de 280', () => {
    expect(reserva1.adicionales()).to.eql(280)
  })
  it('En la segunda reserva no hubo adicional ni por dia ni horario, con un total de 0', () => {
    expect(reserva2.adicionales()).to.eql(0)
  })
})

// Test calcularPrecioFinal()

describe('Test sobre calcularPrecioFinal()', () => {
  it('En la primera reserva, el precio total base es 2800, mas un adicional de 280 por fin de semana, menos un descuento sobre cantidad de personas del 10%(8 integrantes) de 280 mas un codigo sobre el precio una persona.. de 350.. \n el total seria 2800 + 280 - (280+350)', () => {
    expect(this.reserva1.calcularPrecioFinal()).to.eql(2800 + 280 - (280 + 350))
  })
  it('En la segunda reserva, no hubo adicionales ni por dia ni horario, y solo se desconto por cupon de $200 .. el precio total base es 300, el total seria 300 + 0 - 200', () => {
    expect(this.reserva2.calcularPrecioFinal()).to.eql(300 + 0 - 200)
  })
})