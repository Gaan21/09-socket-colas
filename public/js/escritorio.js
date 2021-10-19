// Referencias HTML
const lblEscritorio = document.querySelector('h1'); //El primer h1 que encuentre
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');//Primera clase que encuentre con alert
const lblPendientes = document.querySelector('#lblPendientes');


//Para buscar el parametro indicado en los parametros de la url (Chrome y firefox)
const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    //Para devolver al usuario a la pagina de inicio
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;


divAlerta.style.display = 'none';


const socket = io();


socket.on('connect', () => {
    
    btnAtender.disabled = false;
});
//Si esta caido el servidor el boton no estara disponible
socket.on('disconnect', () => {  //.on: escuchar  .emit: emitir
  
    btnAtender.disabled = true;
});

//Para que aparezca el numero de tickets que quedan por atender
socket.on('tickets-pendientes', (pendientes) => {

    if (pendientes === 0) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
    
})


btnAtender.addEventListener( 'click', () => {
    //Al tocar el boton necesito pedirle al backend que este escuchando un evento.
    //El front emite una peticion
    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        
        if ( !ok ) { //Atrapa cualquier error.
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.numero;
    });

   /*  socket.emit( 'siguiente-ticket', null, ( ticket ) => { 
        
        lblNuevoTicket.innerText = ticket;
    }); */
});