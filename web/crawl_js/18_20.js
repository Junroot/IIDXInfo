(function(){
    var request = new XMLHttpRequest();
    //////////////////////////////////////////////////////////////////////////////////////////////////////// �Է� ����
    var dan = 12;
    var start = 18;  //ũ�Ѹ� ���� ������ 0�� ù������
    var end = 21;   //ũ�Ѹ� �� ������ (50�̸� 49����������)
    var mode = 1;   // 0 : ������ ����, 1 : �÷��� ������ ���� ����
    var level = 12;
    //////////////////////////////////////////////////////////////////////////////////////////////////////// �Է� ��
    var k;
    level--;
    dan += 6;
    var count = start * 200; //�����ϴ� ������ * 200�� �� ó������� ����
    var user_array = new Array();
    for (k = start; k < end; k++) {
        url = "https://p.eagate.573.jp/game/2dx/26/ranking/dani.html?page=" + k + "&play_style=0&grade_id="+ dan +"&display=1";
        request.open('GET', url, false);
        
        request.send();

        var el = document.createElement('html');
        el.innerHTML = request.responseText;

        var table = el.getElementsByClassName('dani-all')[0];           //table�±� �˻�
        var player_list = table.getElementsByTagName("tr");             //table����� tr�� �˻�

        var i;

        for (i = 0; i < player_list.length; i++) {

            var json_array = new Array();
            var info = player_list[i].getElementsByTagName('td');       //�Ѹ��� �÷��̾� ������ td�� �˻��Ͽ� info�� ����

            if (info[0] != undefined) {                                 //info[0]�� undefined�� �÷��̾������� ��� ���� �ƴ� (ù ���� �з� ��)
                var djID = info[0].getElementsByClassName("dj-id")[0];

                if (djID != undefined) {                                //djID�� undefined�� �÷��̾������� ��� ���� �ƴ� (���� ������ ��Ÿ���� �� 1~10, 11~20 ��)
                    djID = djID.innerHTML.replace("-", "");             //djID���� - �� ����

                    /*
                    if (count <= 3215) {                            //�߰��� �������� �̹� �Ѱ͵� ��ŵ
                         count++;
                         continue;
                    }
                    */

                    var rival = info[0].innerHTML.split('"')[1].split("rival=")[1]; //url�� ���̴� ���̹�ID�� ����


                    var url = "";
                    var offset = 0;                                         //���� offset

                    //var output = "[";                                        //����� �ؽ�Ʈ, json����

                    var user_obj = new Object();
                    user_obj.RivalID = djID;
                    user_obj.Dani = dan - 6;
                    user_obj.Ranking = count;
                    
                    user_array.push(user_obj);

                    if (mode == 1)
                    {
                        while (true) {          //������ level, ���̹��ڵ�, offset�� ������ Ž��
                            url = "https://p.eagate.573.jp/game/2dx/26/djdata/music/difficulty_rival.html?difficult=" + level + "&style=0&disp=1&offset=" + offset + "&rival=" + rival;
                            request.open('GET', url, false);

                            request.send();

                            var el = document.createElement('html');
                            el.innerHTML = request.responseText;

                            var table = el.getElementsByTagName('table');           //table�±� �˻�

                            if (table[0] == undefined) {        //table[0]�� undefined�� ������ ����. �� ���̻� ����
                                //alert(table[0]);
                                break;                          //Ż��
                            }

                            var songlist = table[1].getElementsByTagName('tr');     //table[1]�� �� ����Ʈ

                            var song, difficulty, title, convertLevel, score, lamp, rank;  //�ʿ��� ���� ����
                            var j;
                            for (j = 2; j < songlist.length; j++) {                 //songlist[0], songlist[1]�� �ʿ���� �κ��̶� ����
                                if (!(j == 2 && offset == 0)) {
                                    //    output += ",";
                                }
                                song = songlist[j].getElementsByTagName('td');
                                //difficulty = song[1].innerHTML;
                                title = song[0].innerText;                          //���

                                switch (song[1].innerHTML) {                        //���̵�, ��� == 2, ������ == 1, �븻 == 0
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
                                switch (song[4].innerHTML) {                                        //lamp 7:Ǯ��, 6:����, 5:�ϵ�, 4:�븻Ŭ, 3:����Ŭ, 2:���Ŭ, 1:����, 0:���÷���
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

                                switch (icon) {                                                           //rank 8:AAA, 7:AA, 6:A, 5:B, 4:C, 3:D, 2:E, 1:F, 0:����
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

                                
                                var json_element = new Object();                            //�� �ϳ��� ������Ʈ�� ����
                                json_element.DJID = djID;
                                json_element.Title = title;
                                json_element.Difficulty = difficulty;
                                json_element.Level = convertLevel;
                                json_element.Rank = rank;
                                json_element.Score = parseInt(score);
                                json_element.Lamp = lamp;
                                json_array.push(json_element);                              //�迭�� �� ������Ʈ ����
                            }
                            //�� �������� ��
                            offset += 50;       //�״��� ������
                        }
                        //�ѻ�� ��

                        var outjson = JSON.stringify(json_array);                           //json���� ���� ����(1�����)
                        var link = document.createElement('a');
                        var filename = "" + (dan - 6) + "-" + count;
                        link.setAttribute('download', filename + '.json');                      //���ϸ��� count
                        link.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(outjson));
                        link.click();
                    }
                    count++;
                }   //if��

            }   //if��
            else {
            }
        }
        var page_end = end - 1;
        console.log("page " + k + "/" + page_end);
    //�������� ��
    }
    var outjson = JSON.stringify(user_array);
    var link = document.createElement('a');
    dan -= 6;
    link.setAttribute('download', dan + 'userlist.json');
    link.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(outjson));
    link.click();
}());