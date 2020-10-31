$(document).ready(function () {
    var url = new URL(window.location.href);
    var username = url.searchParams.get('username');


    $('h3').text(decodeURIComponent(username));
    $('#djdata').attr('href', 'https://p.eagate.573.jp/game/2dx/26/rival/rival_search.html?iidxid='+ username + '&mode=1');
    $('#gotocompare').attr('href', '../compare/?p1='+ username);

    // var html = '<a>'+ username +'</a><a href="https://p.eagate.573.jp/game/2dx/26/rival/rival_search.html?iidxid='+ username + '&amp;mode=1" target="_blank">Userpage</a>'
    // $("#username").append(html);
    $.getJSON('./userinfo_json/PlayCount.json', function (data2) {
        $.getJSON('./userinfo_json/' + username + '.json', function (data) {
            var DJName = data[0].DJName;

            document.title = DJName + ' - IIDX Info';


            $('h1').text(DJName);
            //console.log(data);
            var html = [];

            function jsonsort(a, b) {
                if (a.Title > b.Title) {
                    return 1;
                }
                else {
                    return -1;
                }
            }

            //data.sort(jsonsort);

            $.each(data, function (i, item) {
                html.push('<tr height="43" style = "cursor:pointer" onClick="location.href = \'../songinfo/index.html?title=' + encodeURIComponent(item.Title) + '\'">');
                html.push('<td><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + item.Title + '</a></td>');
                html.push('<td  class="Score"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + item.Score + '</a></td>');

                switch (item.Lamp) {
                    case 7:
                        html.push('<td  class="Lamp" style="color:cyan" value=7><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">7</div>' + "FC" + '</a></td>');
                        break;
                    case 6:
                        html.push('<td  class="Lamp" style="color:gold" value=6><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">6</div>' + "EX" + '</a></td>');
                        break;
                    case 5:
                        html.push('<td  class="Lamp" style="color:red" value=5><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">5</div>' + "HC" + '</a></td>');
                        break;
                    case 4:
                        html.push('<td  class="Lamp" style="color:blue" value=4><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">4</div>' + "CL" + '</a></td>');
                        break;
                    case 3:
                        html.push('<td  class="Lamp" style="color:limegreen" value=3><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">3</div>' + "EC" + '</a></td>');
                        break;
                    case 2:
                        html.push('<td  class="Lamp" style="color:blueviolet" value=2><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">2</div>' + "AC" + '</a></td>');
                        break;
                    case 1:
                        html.push('<td  class="Lamp" style="color:gray" value=1><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">1</div>' + "FL" + '</a></td>');
                        break;
                    case 0:
                        html.push('<td  class="Lamp" style="color:black" value=0><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'"><div class="LampSort" style="display: none">0</div>' + "NP" + '</a></td>');
                        break;
                }
                switch (item.Rank) {
                    case 8:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "AAA" + '</a></td>');
                        break;
                    case 7:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "AA" + '</a></td>');
                        break;
                    case 6:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "A" + '</a></td>');
                        break;
                    case 5:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "B" + '</a></td>');
                        break;
                    case 4:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "C" + '</a></td>');
                        break;
                    case 3:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "D" + '</a></td>');
                        break;
                    case 2:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "E" + '</a></td>');
                        break;
                    case 1:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "F" + '</a></td>');
                        break;
                    case 0:
                        html.push('<td  class="Rank"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + "---" + '</a></td>');
                        break;
                }


                html.push('<td  class="Ranking"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + item.Ranking + '</a></td>');
                var PlayCount = 0;
                var Percentage = "";
                $.each(data2, function (j, item2) {
                    if (item2.Title == item.Title) {
                        PlayCount = item2.PlayCount;
                        if (item.Ranking > PlayCount) {
                            Percentage = "100%";
                        }
                        else {
                            Percentage = (item.Ranking / PlayCount * 100).toFixed(2) + "%";

                        }
                        
                    }
                });
                html.push('<td  class="Percentage"><a href = "../songinfo/index.html?title=' + encodeURIComponent(item.Title) +'">' + Percentage + '</a></td>');
                //console.log(html)

                html.push('</tr>');
            });

            $("#rankboard").html(html.join(''));



            (function ($) {


                var unique = 0;
                var types = $.fn.dataTable.ext.type;

                // Using form $.fn.dataTable.enum breaks at least YuiCompressor since enum is
                // a reserved word in JavaScript
                $.fn.dataTable['enum'] = function (arr) {
                    var name = 'enum-' + (unique++);
                    var lookup = window.Map ? new Map() : {};

                    for (var i = 0, ien = arr.length ; i < ien ; i++) {
                        lookup[arr[i]] = i;
                    }

                    // Add type detection
                    types.detect.unshift(function (d) {
                        return lookup[d] !== undefined ?
                            name :
                            null;
                    });

                    // Add sorting method
                    types.order[name + '-pre'] = function (d) {
                        return lookup[d];
                    };
                };


            })(jQuery);
            $.fn.dataTable.enum(['FC', 'EX', 'HC', 'CL', 'EC', 'AC', 'FL', 'NP']);
            $.fn.dataTable.enum(['AAA', 'AA', 'A', 'B', 'C', 'D', 'E', 'F', '---']);

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