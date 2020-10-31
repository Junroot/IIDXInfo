(function(){
    var request = new XMLHttpRequest();
    //////////////////////////////////////////////////////////////////////////////////////////////////////// 입력 시작
    var dan = 12;
    var start = 18;  //크롤링 시작 페이지 0이 첫페이지
    var end = 21;   //크롤링 끝 페이지 (50이면 49페이지까지)
    var mode = 1;   // 0 : 단위만 갱신, 1 : 플레이 데이터 까지 갱신
    var level = 12;
    //////////////////////////////////////////////////////////////////////////////////////////////////////// 입력 끝
    var k;
    level--;
    dan += 6;
    var count = start * 200; //시작하는 페이지 * 200이 맨 처음사람의 순위
    var user_array = new Array();
    for (k = start; k < end; k++) {
        url = "https://p.eagate.573.jp/game/2dx/26/ranking/dani.html?page=" + k + "&play_style=0&grade_id="+ dan +"&display=1";
        request.open('GET', url, false);
        
        request.send();

        var el = document.createElement('html');
        el.innerHTML = request.responseText;

        var table = el.getElementsByClassName('dani-all')[0];           //table태그 검색
        var player_list = table.getElementsByTagName("tr");             //table요소인 tr로 검색

        var i;

        for (i = 0; i < player_list.length; i++) {

            var json_array = new Array();
            var info = player_list[i].getElementsByTagName('td');       //한명의 플레이어 정보를 td로 검색하여 info에 저장

            if (info[0] != undefined) {                                 //info[0]가 undefined면 플레이어정보가 담긴 행이 아님 (첫 행의 분류 행)
                var djID = info[0].getElementsByClassName("dj-id")[0];

                if (djID != undefined) {                                //djID가 undefined면 플레이어정보가 담긴 행이 아님 (순위 범위를 나타내는 행 1~10, 11~20 등)
                    djID = djID.innerHTML.replace("-", "");             //djID에서 - 를 빼줌

                    /*
                    if (count <= 3215) {                            //중간에 끊겼을떄 이미 한것들 스킵
                         count++;
                         continue;
                    }
                    */

                    var rival = info[0].innerHTML.split('"')[1].split("rival=")[1]; //url에 쓰이는 라이벌ID를 추출


                    var url = "";
                    var offset = 0;                                         //시작 offset

                    //var output = "[";                                        //출력할 텍스트, json시작

                    var user_obj = new Object();
                    user_obj.RivalID = djID;
                    user_obj.Dani = dan - 6;
                    user_obj.Ranking = count;
                    
                    user_array.push(user_obj);

                    if (mode == 1)
                    {
                        while (true) {          //지정된 level, 라이벌코드, offset로 페이지 탐색
                            url = "https://p.eagate.573.jp/game/2dx/26/djdata/music/difficulty_rival.html?difficult=" + level + "&style=0&disp=1&offset=" + offset + "&rival=" + rival;
                            request.open('GET', url, false);

                            request.send();

                            var el = document.createElement('html');
                            el.innerHTML = request.responseText;

                            var table = el.getElementsByTagName('table');           //table태그 검색

                            if (table[0] == undefined) {        //table[0]이 undefined면 페이지 끝남. 곡 더이상 없음
                                //alert(table[0]);
                                break;                          //탈출
                            }

                            var songlist = table[1].getElementsByTagName('tr');     //table[1]이 곡 리스트

                            var song, difficulty, title, convertLevel, score, lamp, rank;  //필요한 변수 선언
                            var j;
                            for (j = 2; j < songlist.length; j++) {                 //songlist[0], songlist[1]은 필요없는 부분이라 생략
                                if (!(j == 2 && offset == 0)) {
                                    //    output += ",";
                                }
                                song = songlist[j].getElementsByTagName('td');
                                //difficulty = song[1].innerHTML;
                                title = song[0].innerText;                          //곡명

                                switch (song[1].innerHTML) {                        //난이도, 어나더 == 2, 하이퍼 == 1, 노말 == 0
                                    case "ANOTHER":
                                        difficulty = 2;
                                        break;
                                    case "HYPER":
                                        difficulty = 1;
                                        break;
                                    case "NORMAL":
                                        difficulty = 0;
                                        break;
                                }
                                switch (song[4].innerHTML) {                                        //lamp 7:풀콤, 6:익하, 5:하드, 4:노말클, 3:이지클, 2:어시클, 1:페일, 0:노플레이
                                    case '<img src="/game/2dx/26/images/score_icon/clflg7.gif">':
                                        lamp = 7;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg6.gif">':
                                        lamp = 6;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg5.gif">':
                                        lamp = 5;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg4.gif">':
                                        lamp = 4;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg3.gif">':
                                        lamp = 3;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg2.gif">':
                                        lamp = 2;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg1.gif">':
                                        lamp = 1;
                                        break;
                                    case '<img src="/game/2dx/26/images/score_icon/clflg1.gif">':
                                        lamp = 0;
                                        break;
                                }
                                var Exp = new RegExp('(score_icon/|.gif)','g');
                                var icon = song[2].innerHTML.split(Exp)[2];

                                switch (icon) {                                                           //rank 8:AAA, 7:AA, 6:A, 5:B, 4:C, 3:D, 2:E, 1:F, 0:없음
                                    case 'AAA':
                                        rank = 8;
                                        break;
                                    case 'AA':
                                        rank = 7;
                                        break;
                                    case 'A':
                                        rank = 6;
                                        break;
                                    case 'B':
                                        rank = 5;
                                        break;
                                    case 'C':
                                        rank = 4;
                                        break;
                                    case 'D':
                                        rank = 3;
                                        break;
                                    case 'E':
                                        rank = 2;
                                        break;
                                    case 'F':
                                        rank = 1;
                                        break;
                                    case '---':
                                        rank = 0;
                                        break;
                                    default:
                                        console.log("fuck!@#$");
                                        break;
                                }
                                score = song[3].innerText;
                                score = score.split("(", 1);
                                convertLevel = level + 1;

                                
                                var json_element = new Object();                            //곡 하나를 오브젝트로 저장
                                json_element.DJID = djID;
                                json_element.Title = title;
                                json_element.Difficulty = difficulty;
                                json_element.Level = convertLevel;
                                json_element.Rank = rank;
                                json_element.Score = parseInt(score);
                                json_element.Lamp = lamp;
                                json_array.push(json_element);                              //배열에 곡 오브젝트 저장
                            }
                            //곡 한페이지 끝
                            offset += 50;       //그다음 페이지
                        }
                        //한사람 끝

                        var outjson = JSON.stringify(json_array);                           //json으로 만들어서 저장(1사람분)
                        var link = document.createElement('a');
                        var filename = "" + (dan - 6) + "-" + count;
                        link.setAttribute('download', filename + '.json');                      //파일명은 count
                        link.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(outjson));
                        link.click();
                    }
                    count++;
                }   //if문

            }   //if문
            else {
            }
        }
        var page_end = end - 1;
        console.log("page " + k + "/" + page_end);
    //한페이지 끝
    }
    var outjson = JSON.stringify(user_array);
    var link = document.createElement('a');
    dan -= 6;
    link.setAttribute('download', dan + 'userlist.json');
    link.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(outjson));
    link.click();
}());