var table;
var DJName_table;

$(document).ready(function () {
    var url = new URL(window.location.href);
    var username = url.searchParams.get('username');

    $('h3').text(decodeURIComponent(username));
    $('#djdata').attr('href', 'https://p.eagate.573.jp/game/2dx/26/rival/rival_search.html?iidxid=' + username + '&mode=1');

    $("#DJName_search").keypress(function (e) {
        if (e.which == 13) {
            searchplayer();
        }
    });

    $("#DJID").keypress(function (e) {
        if (e.which == 13) {
            GotoUserpage();
        }
    });

});

function search() {
    var input = document.getElementById('searchinput');
    var filter = input.value.toUpperCase();
    var board = document.getElementById('rankboard');
    var tr = board.getElementsByTagName('tr');
    var td;


    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[0].innerText;
        if (td.toUpperCase().indexOf(filter) > -1) {
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
    location.href = '../userinfo/index.html?username=' + encodeURIComponent(DJID);
}

function searchplayer() {
    var html = [];

    html.push('<tr><td class="text-center" colspan="5" style="padding:12px"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></td></tr>');

    $("#playerboard").html(html.join(''));

    html = [];


    var djname = $('#DJName_search').val();
    console.log(djname);
    
    if (djname == "") {
        alert("Insert DJName");
    } else {
        //console.log(djname.toUpperCase());
        $.getJSON('https://tck4ffl9ze.execute-api.us-east-2.amazonaws.com/MainPage/playersearch/' + encodeURIComponent(djname), function (data) {
            console.log(data);
            $.each(data, function (i, item) {
                console.log(item.N);
                if (item.N.toUpperCase().indexOf(djname.toUpperCase()) !== -1) {
                    //console.log(djname);
                    // console.log(item.N);
                    var dani;
                    switch (item.Da) {
                        case 10:
                            dani = "十段";
                            break;
                        case 11:
                            dani = "中伝";
                            break;
                        case 12:
                            dani = "皆伝";
                            break;
                    }
                    html.push("<tr style = 'cursor:pointer' href = '../userinfo/index.html?username=" + encodeURIComponent(item.I) + "' height='20'>");
                    html.push("<td><a href = '../userinfo/index.html?username=" + encodeURIComponent(item.I) + "'>" + item.N + "</a></td>");
                    html.push("<td><a href = '../userinfo/index.html?username=" + encodeURIComponent(item.I) + "'>" + item.I + "</a></td>");
                    html.push("<td><a href = '../userinfo/index.html?username=" + encodeURIComponent(item.I) + "'>" + dani + "</a></td>");
                    html.push("<td><a href = '../userinfo/index.html?username=" + encodeURIComponent(item.I) + "'>" + item.R + "</a></td>");
                    html.push("<td><a href = '../userinfo/index.html?username=" + encodeURIComponent(item.I) + "'>" + item.A + "</a></td>");
                    html.push("</tr>");
                }
            });

            if (table !== undefined) {
                    table.destroy();
            }

            $("#playerboard").html(html.join(''));

            table = $('#maintable').DataTable({
                "searching": false,
                "paging": false,
                "bInfo": false,
                "bDestroy": true,
            });
        });
    }
}