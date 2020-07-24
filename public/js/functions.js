function eliminarMensajes() {
    $('#eliminarMensajes').click(function(){
        var checkeado = []
        $('#mailsTable tr').each(function(index, element){
            if($(this).find('.chkBox').is( ":checked" ))
                checkeado.push($(this).attr('data-id'))
        })
        var data = {
            lista: checkeado
        }
        if(checkeado.length){
            $.ajax({
                url: "/deleteMails",
                type: "POST",
                data: data,
                success: function(res) {            
                    console.log('OK')               
                }
            })
        }
    })
}

$( document ).ready(function() {
    console.log( "ready!" );

    eliminarMensajes()

})