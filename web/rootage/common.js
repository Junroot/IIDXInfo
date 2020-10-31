$(document).ready(function () {
    document.title = 'IIDX Info';

    $("#DJID").keyup(function (event) {
        if (event.keyCode == 13) {
            GotoUserpage();
        }
    });

    $.getJSON('./top1.json', function(data) {
        var html = [];

        function jsonsort(a, b) {
            if (a.Title > b.Title) {
                return 1;
            }
            else {
                return -1;
            }
        }

        data.sort(jsonsort);

        $.each(data, function(i, item) {
            html.push('<tr height = "20">');
            html.push('<td href ="./songinfo/?title='+ encodeURIComponent(item.Title) +'"><a class="Title" href = "./songinfo/?title='+ encodeURIComponent(item.Title) +'">'+ item.Title +'</a></td>')
            html.push('<td class="row"><a class="DJ" href = "./userinfo/?username=' + encodeURIComponent(item.DJID) + '">'+ '<div class="col DJName">' + item.DJName + '</div>'+ '<div class="col DJID">' + item.DJID + '</div></a></td>');
            html.push('<td><a class="Score">' + item.Score + '</a></td>');
            html.push('</tr>');
        });

        $("#rankboard").html(html.join(''));

        
        
        $('#maintable').DataTable({
            "searching": false,
            "paging": false,
            "bInfo": false
        });

        // $('tbody tr').click(function(){
        //     window.location = $(this).attr('href');
        //     return false;
        // });
        // $('.dataTables_length').addClass('bs-select');
    });
});

function search() {
    var input = document.getElementById('searchinput');
    var filter = input.value.toUpperCase();
    var board = document.getElementById('rankboard');
    var tr = board.getElementsByTagName('tr');
    var ss = Number(document.getElementById('searchselect').value);
    var td;


    for (var i = 0; i < tr.length; i++)
    {
        td = tr[i].getElementsByTagName('td')[ss].innerText;
        if (td.toUpperCase().indexOf(filter) > -1){
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = "none";
        }
    }
}

function GotoUserpage() {
    var DJID = $("#DJID").val();
    DJID = DJID.replace("-", "");
    location.href = './userinfo/index.html?username=' + encodeURIComponent(DJID);
}