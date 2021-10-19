const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();


const socketController = (socket) => {
//Cuando un cliente se conecta se disparan todos estos eventos
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );

    socket.emit( 'estado-actual', ticketControl.ultimos4 );

    socket.emit('tickets-pendientes', ticketControl.tickets.length);
    //Tamaño del array de tickets pendientes


    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();

        callback( siguiente );

        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        //Notificar que hay un nuevo ticket pendiente de asignar
    })


    socket.on('atender-ticket', ( {escritorio}, callback) =>{
        //El back escucha la peticion
        if (!escritorio) {
            return callback({
                ok: false,
                msg:'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );
        

//Notificar cambio en el arreglo de ultimos4 a todas las pantallas (broadcast)
        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 );
//Notificar los tickets pendientes a todos y al cliente que solicita
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay mas tickets'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })
}



module.exports = {
    socketController
}

