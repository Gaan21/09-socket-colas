//Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket'); //#Para referencias por id
const btnCrear = document.querySelector('button');


const socket = io();


socket.on('connect', () => {
    
    btnCrear.disabled = false;
});
//Si esta caido el servidor el boton no estara disponible
socket.on('disconnect', () => {
  
    btnCrear.disabled = true;
});

//Para que aparezca el ultimo ticket sacado en la pantalla de carga
socket.on('ultimo-ticket', (ultimo) => {

    lblNuevoTicket.innerText = 'Ticket ' + ultimo;
})


btnCrear.addEventListener( 'click', () => {
    
    socket.emit( 'siguiente-ticket', null, ( ticket ) => { 
        
        lblNuevoTicket.innerText = ticket;
    });
});