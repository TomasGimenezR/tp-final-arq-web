function deleteMails() {
    $('#deleteMessages').click(() => {
        var selected = []
        $('#mailsTable tr').each(function(index, element){
            if($(this).find('.chkBox').is( ":checked" ))
                selected.push($(this).attr('data-id'))
        })

        var data = { selected }

        if(selected.length){
            try{
                $.ajax({
                    url: "/mail",
                    type: "DELETE",
                    data
                }).done(function(){
                    alert('Mensaje eliminado con exito.')
                    location.reload()
                })
            } catch (e) {
                alert(e)
            }
        }
    })
}

function createNewFolder() {
    $('#newFolder').click(() => {
        try{
            folderName = prompt('Inserte nombre para nueva carpeta','Nueva Carpeta')

            var data = { folderName }

            $.ajax({
                url: "/users/newFolder",
                type: "POST",
                data
            }).done(function(){
                alert(`Carpeta ${folderName} creata con exito.`)
                location.reload()
            })
        }catch(e){
            alert(e)
        }
    })
}

$( document ).ready(function() {
    console.log( "ready!" );

    deleteMails()
    createNewFolder()

})