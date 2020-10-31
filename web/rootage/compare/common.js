var table;
var DJName_table;

$(document).ready(function () {
    var url = new URL(window.location.href);
    var p1 = url.searchParams.get('p1');
    var p2 = url.searchParams.get('p2');
    var p3 = url.searchParams.get('p3');
    var p4 = url.searchParams.get('p4');

    if(!p1) p1 = "";
    if(!p2) p2 = "";
    if(!p3) p3 = "";
    if(!p4) p4 = "";

    $('#player1').val(decodeURIComponent(p1));
    $('#player2').val(decodeURIComponent(p2));
    $('#player3').val(decodeURIComponent(p3));
    $('#player4').val(decodeURIComponent(p4));

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

function select_player(val) {
    if ($('#player1').val() == "") {
        $('#player1').val(String(val));
    } else if ($('#player2').val() == "") {
        $('#player2').val(String(val));
    } else if ($('#player3').val() == "") {
        $('#player3').val(String(val));
    } else {
        $('#player4').val(String(val));
    }
}

function GotoUserpage() {
    var DJID = $("#DJID").val();
    DJID = DJID.replace("-", "");
    location.href = '../userinfo/index.html?username=' + encodeURIComponent(DJID);
}

function searchplayer() {
    var html = [];

    html.push('<tr><td class="text-center" colspan="5"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></td></tr>');

    $("#playerboard").html(html.join(''));

    html = [];

    var djname = $('#DJName_search').val();

    if (djname == "") {
        alert("Insert DJName");
    } else {
        //console.log(djname.toUpperCase());
        $.getJSON('https://tck4ffl9ze.execute-api.us-east-2.amazonaws.com/MainPage/playersearch/' + encodeURIComponent(djname), function (data) {
            $.each(data, function (i, item) {
                //console.log(item.N);
                if (item.N.toUpperCase().indexOf(djname.toUpperCase()) !== -1) {
                    //console.log(djname);
                    //console.log(item.N);
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
                    html.push("<tr style = 'cursor:pointer' onclick=\"select_player('"+ item.I +"')\" height'20'>");
                    html.push("<td class='searchname'>" + item.N + "</td>");
                    html.push("<td class='searchid'>" + item.I + "</td>");
                    html.push("<td class='searchid'>" + dani + "</td>");
                    html.push("<td class='searchid'>" + item.R + "</td>");
                    html.push("<td class='searchid'>" + item.A + "</td>");
                    html.push("</tr>");
                }
            });
            // console.log(html);
            if (DJName_table !== undefined) {
                DJName_table.destroy();
            }

            $("#playerboard").html(html.join(''));

            DJName_table = $('#search_player_table').DataTable({
                "searching": false,
                "paging": false,
                "bInfo": false,
                "bDestroy": true,
            });
        });
    }
}

function comp() {
    //console.log("test");
    var html = [];

    html.push('<tr><td class="text-center" colspan="6"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></td></tr>');

    $("#rankboard").html(html.join(''));

    html = [];

    var P1 = $('#player1').val().replace("-", "");
    var P2 = $('#player2').val().replace("-", "");
    var P3 = $('#player3').val();
    var P4 = $('#player4').val();

    var P3_exist = 0;
    var P4_exist = 0;

    if (P1 == "" || P2 == "") {
        alert("Insert DJID in Player1 and Player2");
    }

    if (P3 !== "") {
        P3 = P3.replace("-", "");
        P3_exist = 1;
    }
    if (P4 !== "") {
        P4 = P4.replace("-", "");
        P4_exist = 1;
    }

    //alert(P1 + " " + P2 + " " + P3 + " " + P4);
    

    var p1_json = [];
    var p2_json = [];
    var p3_json = [];
    var p4_json = [];

    //console.log(P1);
    //console.log(P2);
    //console.log(P3);
    //console.log(P4);

    $.getJSON('../userinfo/userinfo_json/' + P1 + '.json', function (p1_data) {
        p1_json = p1_data;

        $.getJSON('../userinfo/userinfo_json/' + P2 + '.json', function (p2_data){
            p2_json = p2_data;

            if(P3_exist == 1){
                $.getJSON('../userinfo/userinfo_json/' + P3 + '.json', function (p3_data) {
                    p3_json = p3_data;

                    if (P4_exist == 1) {
                        $.getJSON('../userinfo/userinfo_json/' + P4 + '.json', function (p4_data) {
                            p4_json = p4_data;

                            compare_json(p1_json, p2_json, p3_json, p4_json);
                        });
                    } else {
                        compare_json(p1_json, p2_json, p3_json, p4_json);
                    }
                });
            }else{
                compare_json(p1_json, p2_json, p3_json, p4_json);
            }
            
        });
    });

    function compare_json(p1, p2, p3, p4){
        //console.log(p1);
        //console.log(p2);
        //console.log(p3);
        //console.log(p4);

        var Score1=0;
        var Score2=0;
        var Score3=0;
        var Score4 = 0;

        var djname1;
        var djname2;
        var djname3;
        var djname4;

        var leng = 1;
        if(p3.length > 0) leng++;
        if(p4.length > 0) leng++;


        
        //console.log(leng);

        var html = [];

        $.each(p1, function (i, item1) {
            var Title = item1.Title;
            var Score1 = item1.Score;
            Score2 = 0;
            Score3 = 0;
            Score4 = 0;

            if (djname1 == undefined) djname1 = item1.DJName;

            $.each(p2, function (j, item2) {
                if (djname2 == undefined) djname2 = item2.DJName;
                if (item1.Title == item2.Title) {
                    Score2 = item2.Score;
                }
            });
            $.each(p3, function (k, item3) {
                if (djname3 == undefined) djname3 = item3.DJName;
                if (item1.Title == item3.Title) {
                    Score3 = item3.Score;
                }
            });
            $.each(p4, function (m, item4) {
                if (djname4 == undefined) djname4 = item4.DJName;
                if (item1.Title == item4.Title) {
                    Score4 = item4.Score;
                }
            });

            //console.log(Score1);
            //console.log(Score2);
            //console.log(Score3);
            //console.log(Score4);
            //console.log("------");

            var p2_diff = Score2 - Score1;
            var p3_diff = Score3 - Score1;
            var p4_diff = Score4 - Score1;

            var wincount = 0;
            var wincolor = 0;

            if (p2_diff > 0) {
                wincolor--;
            }
            else if (p2_diff < 0) {
                if (p2_diff !== (-1 * Score1)) {
                    wincount++;
                    wincolor++;
                }
            }
            if (leng > 1){
                if (p3_diff > 0) {
                    wincolor--;
                }
                else if (p3_diff < 0) {
                    if (p3_diff !== (-1 * Score1)) {
                        wincount++;
                        wincolor++;
                    }
                }
                if(leng > 2){
                    if (p4_diff > 0) {
                        wincolor--;
                    }
                    else if (p4_diff < 0) {
                        if (p4_diff !== (-1 * Score1)) {
                            wincount++;
                            wincolor++;
                        }
                    }
                }
            }
            

            var p2_diff_sort;
            var p3_diff_sort;
            var p4_diff_sort;

            var p2_diff_text;
            var p3_diff_text;
            var p4_diff_text;
            var plus;

            if (Score2 == 0) {
                Score2 = "";
                p2_diff = 99999;
                p2_diff_text = "";
            } else {
                if(p2_diff > 0) plus = "+";
                else plus = "";
                p2_diff_text = plus + p2_diff;
                p2_diff_sort = p2_diff + 20000;
            }

            if (Score3 == 0) {
                Score3 = "";
                p3_diff = 99999;
                p3_diff_text = "";
            } else {
                if (p3_diff > 0) plus = "+";
                else plus = "";
                p3_diff_text = plus + p3_diff;
                p3_diff_sort = p3_diff + 20000;
            }

            if (Score4 == 0) {
                Score4 = "";
                p4_diff = 99999;
                p4_diff_text = "";
            } else {
                if (p4_diff > 0) plus = "+";
                else plus = "";
                p4_diff_text = plus + p4_diff;
                p4_diff_sort = p4_diff + 20000;
            }

            if (wincolor == -leng) {
                wincount = -1;
            }

            var color="red";

            //console.log(p2_diff_text);
            if (Score1 !== 0) {
                //console.log(encodeURIComponent(Title)+": "+wincount);
                if (wincolor == -leng)  html.push("<tr href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "' style='background-color:#ffcdd2' height = '20'>");
                else if(wincolor == leng)  html.push("<tr href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "' style='background-color:#baddf9' height = '20'>");
                else html.push("<tr href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "' height = '20'>");
                html.push("<td><a class='Title' href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "'>" + Title +"</a></td>");
                html.push("<td><a class='Score1p' href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "'>" + Score1 + "</a></td>");
                if (p2_diff > 0) color = "blue";
                else if(p2_diff < 0) color = "red";
                else color = "black";
                html.push("<td><a class='Score' href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "' style = 'color:" + color + "'><div class='diff_sort' style='display:none'>" + p2_diff_sort + "</div><div ='rival_score'>" + Score2 + "<div><div class='diff'>" + p2_diff_text + "</div></a></td>");
                if (p3_diff > 0) color = "blue";
                else if (p3_diff < 0) color = "red";
                else color = "black";
                html.push("<td><a class='Score' href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "' style = 'color:" + color + "'><div class='diff_sort' style='display:none'>" + p3_diff_sort + "</div><div ='rival_score'>" + Score3 + "<div><div class='diff'>" + p3_diff_text + "</div></a></td>");
                if (p4_diff > 0) color = "blue";
                else if (p4_diff < 0) color = "red";
                else color = "black";
                html.push("<td><a class='Score' href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "' style = 'color:" + color + "'><div class='diff_sort' style='display:none'>" + p4_diff_sort + "</div><div ='rival_score'>" + Score4 + "<div><div class='diff'>" + p4_diff_text + "</div></a></td>");
                html.push("<td><a class='Win' href = '../songinfo/index.html?title=" + encodeURIComponent(Title) + "'><div'>" + wincount + "</a></td>");
                html.push("</tr>");
            }
        });
        //console.log(html);
        if (table !== undefined) {
            table.destroy();
        }
        // console.log(html);
        
        $("#rankboard").html(html.join(''));
        
        table = $('#maintable').DataTable({
            "searching": false,
            "paging": false,
            "bInfo": false,
            "bDestroy":true,
        });

        if ($('#player3').val() == "") {
            table.columns([3]).visible(false);
        } else {
            table.columns([3]).visible(true);
        }
        if ($('#player4').val() == "") {
            table.columns([4]).visible(false);
        } else {
            table.columns([4]).visible(true);
        }

        $('.Player1_col').text(djname1);
        $('.Player2_col').text(djname2);
        $('.Player3_col').text(djname3);
        $('.Player4_col').text(djname4);
    }   
}

var player_table_toggle = 0;
function toggle_player_table() {
    if (player_table_toggle == 0) {
        player_table_toggle = 1;
        $('#player_search_toggle').val("Close Player Search");
    } else {
        player_table_toggle = 0;
        $('#player_search_toggle').val("Open Player Search");
    }
}