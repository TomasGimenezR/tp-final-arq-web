function deleteMails() {
    $('#deleteMessages').click(function(){
        var selected = []
        $('#mailsTable tr').each(function(index, element){
            if($(this).find('.chkBox').is( ":checked" ))
                selected.push($(this).attr('data-id'))
        })
        var data = {
            selected
        }
        if(selected.length){
            $.ajax({
                url: "/mail",
                type: "DELETE",
                data
            })
        }
    })
}

$( document ).ready(function() {
    console.log( "ready!" );

    deleteMails()

})