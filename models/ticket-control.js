const path = require('path');
const fs = require('fs');


class Ticket {
    constructor( num, escr) {
        this.numero = num;
        this.escritorio = escr;
    }
}


class TicketControl {

    constructor() {

        this.ultimo   = 0; //Ultimo ticket
        this.hoy      = new Date().getDate(); // Dia de hoy
        this.tickets = []; //Tickets pendientes
        this.ultimos4 = []; // 4 ultimos tickets

        this.init();
    }


    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init() {
        //Obtiene un objeto del archivo si este un archivo JSON
        const { hoy, tickets, ultimo, ultimos4} = require('../db/data.json'); 
       
//Si es hoy le damos la info que habia y guarda los cambios, si es otro dia guardamos 
//en la base de datos el nuevo dia y se resetea toda la info 

        if (hoy === this.hoy ) {
           this.tickets = tickets;
           this.ultimo  = ultimo;
           this.ultimos4 = ultimos4;
       } else {
           //Es otro dia
           this.guardarDB();
       }
    }

    guardarDB() {
        // Especificar la ruta donde se va a guardar la info
        const dbPath = path.join( __dirname, '../db/data.json');

        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ));
    }


    siguiente() {
        this.ultimo += 1; //Forma corta para acumulador

        const ticket = new Ticket( this.ultimo, null );

        this.tickets.push( ticket )

        this.guardarDB();
        
        return 'Ticket ' + ticket.numero;
    }


    atenderTicket( escrit ) {
        //Si no tenemos tickets pendientes
        if ( this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift();
//Como sabemos que hay tickets extraemos y borramos (con shift) el primero almacenado 
        
        ticket.escritorio = escrit;//Al ticket borrado le asignamos el escrit recibido como argumento

        this.ultimos4.unshift( ticket ); //Insertamos un elemento al inicio del arreglo

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1,1);
//Empezamos en la ultima posicion del arreglo (-1) y cortamos solo 1 (el ultimo)
        }

        this.guardarDB();

        return ticket;
    }
}


module.exports = TicketControl;