const puppeteer = require('puppeteer');
const readline = require('readline');
const cheerio = require('cheerio');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var sel;

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://p.eagate.573.jp/gate/p/login.html?path=http%3A%2F%2Fp.eagate.573.jp%2Fgame%2F2dx%2F26%2Fdjdata%2Fstatus.html');
    await page.type('[name="nm_login_id"]', '$inputYourID'); // Input Your ID
    await page.type('[name="nm_paswords"]', '$inputYourPW'); // Input Your Password

    await page.screenshot({path: 'example.png'});

    await rl.on('line', async function(line) {
        var input = line.split(' ').map((el) => parseInt(el));


        await (async function porcarray(input) {
            input.forEach(item => {
            sel = '#id_kcaptcha_c'+ item;
            page.evaluate((sel) => document.querySelector(sel).click(), sel);
            })
        })(input);

        sel = 'button';
        page.evaluate((sel) => document.querySelector(sel).click(), sel);
        
        await sleep(3000);

        // await page.screenshot({path: 'example2.png'});

        //////////////////////////////////////////////////////////////////////////////////////////////////////// �Է� ����
        var dan = 10;
        var start = 0;  //ranking
        var end = 1;   //ũ�Ѹ� �� ������ (50�̸� 49����������)
        var mode = 1;   // 0 : only userlist, 1 : all data
        var level = 12;
        //////////////////////////////////////////////////////////////////////////////////////////////////////// �Է� ��
        var k;
        level--;
        //var count = start * 200; //�����ϴ� ������ * 200�� �� ó������� ����

        var user_array = new Array();

        var player_list = JSON.parse(fs.readFileSync(dan + 'dan.json','utf8')).list;

        dan += 6;
        count = start;

        for (var i = start; i < player_list.length;i++)
        {
            var json_array = new Array();
            var user_obj = new Object();
            await page.goto('https://p.eagate.573.jp/game/2dx/27/djdata/rival/rival_status.html?rival=' + player_list[i].rival);
            //console.log('https://p.eagate.573.jp/game/2dx/27/djdata/rival/rival_status.html?rival=' + player_list[i].rival);
            html = await page.evaluate(() => document.body.innerHTML);

            $ = cheerio.load(html);

            var djdata_private = $('.dj-status').find('p').eq(0).text()
            //console.log(djdata_private);
            if(djdata_private.indexOf("非公開") != -1){
                console.log(djdata_private);
                console.log("private data");
                count++;
                continue;
            }

            user_obj.DJName = $('.dj-profile').find('tr').eq(0).find('td').eq(1).text();
            user_obj.Region = $('.dj-profile').find('tr').eq(1).find('td').eq(1).text();
            user_obj.RivalID = $('.dj-profile').find('tr').eq(2).find('td').eq(1).text().replace("-","");
            user_obj.Arena = $('.rank-cat').eq(4).find('div').eq(1).text();
            user_obj.Dani = dan - 6;
            user_obj.Ranking = k * 200 + i + 1;

            user_array.push(user_obj);
            //console.log(user_obj.DJName + " ranking:" + i + " count:" + count);
            if (mode == 1)
            {
                var offset = 0;
                while(true)
                {
                    await page.goto("https://p.eagate.573.jp/game/2dx/27/djdata/music/difficulty_rival.html?difficult=" + level + "&style=0&disp=1&offset=" + offset + "&rival=" + player_list[i].rival);

                    // console.log("https://p.eagate.573.jp/game/2dx/27/djdata/music/difficulty_rival.html?difficult=" + level + "&style=0&disp=1&offset=" + offset + "&rival=" + player_list[i].rival);
                    html = await page.evaluate(() => document.body.innerHTML);

                    //await page.screenshot({path: offset + '.png', clip: {x:0, y:0, width:1000, height:2000 }});

                    $ = cheerio.load(html);

                    // console.log(html);

                    var tr = $('.series-difficulty').find('tr');
                    
                    // console.log(tr);

                    if(tr.length == 0)   break;

                    

                    tr.each(function () {
                        var json_element = new Object();
                        json_element.DJID = user_obj.RivalID;
                        json_element.DJName = user_obj.DJName;
                        json_element.Level = level + 1;
                        var title = $(this).find('td').eq(0).find('a');
                        if (title.length == 0) return true;
                        json_element.Title = title.text();
                        
                        switch($(this).find('td').eq(1).text())
                        {
                            case "LEGGENDARIA":
                                json_element.Difficulty = 3;
                                json_element.Title = json_element.Title + "[L]";
                                break;
                            case "ANOTHER":
                                json_element.Difficulty = 2;
                                json_element.Title = json_element.Title + "[A]";
                                break;
                            case "HYPER":
                                json_element.Difficulty = 1;
                                json_element.Title = json_element.Title + "[H]";
                                break;
                            case "NORMAL":
                                json_element.Difficulty = 0;
                                json_element.Title = json_element.Title + "[N]";
                                break
                        }

                        var Exp = new RegExp('(score_icon/|.gif)','g');

                        switch($(this).find('td').eq(2).html().split(Exp)[2])
                        {
                            case 'AAA':
                                json_element.Rank = 8;
                                break;
                            case 'AA':
                                json_element.Rank = 7;
                                break;
                            case 'A':
                                json_element.Rank = 6;
                                break;
                            case 'B':
                                json_element.Rank = 5;
                                break;
                            case 'C':
                                json_element.Rank = 4;
                                break;
                            case 'D':
                                json_element.Rank = 3;
                                break;
                            case 'E':
                                json_element.Rank = 2;
                                break;
                            case 'F':
                                json_element.Rank = 1;
                                break;
                            case '---':
                                json_element.Rank = 0;
                                break;
                            default:
                                console.log("fuck!@#$");
                                break;
                        }

                        json_element.Score = parseInt($(this).find('td').eq(3).text().split("(", 1));
                        
                        switch($(this).find('td').eq(4).html().split(Exp)[2])
                        {
                            case 'clflg7':
                                json_element.Lamp = 7;
                                break;
                            case 'clflg6':
                                json_element.Lamp = 6;
                                break;
                            case 'clflg5':
                                json_element.Lamp = 5;
                                break;
                            case 'clflg4':
                                json_element.Lamp = 4;
                                break;
                            case 'clflg3':
                                json_element.Lamp = 3;
                                break;
                            case 'clflg2':
                                json_element.Lamp = 2;
                                break;
                            case 'clflg1':
                                json_element.Lamp = 1;
                                break;
                            case 'clflg0':
                                json_element.Lamp = 0;
                                break;
                        }
                        json_array.push(json_element);
                        //console.log(json_element.DJID, json_element.DJName, json_element.Level, json_element.Title, json_element.Difficulty, json_element.Rank, json_element.Score, json_element.Lamp);
                    });
                    

                    offset = offset + 50;
                }
            }
            var outjson = JSON.stringify(json_array);
            var filename = "" + (dan - 6) + "-" + count;
            fs.writeFileSync('./playdata/'+ filename +'.json', outjson ,'utf-8');     
            count++;
        }

        // console.log(player_list);


        // for (k = start; k < end; k++) {
        //     url = "https://p.eagate.573.jp/game/2dx/26/ranking/dani.html?page=" + k + "&play_style=0&grade_id="+ dan +"&display=1";
        //     await page.goto(url);

        //     var html = await page.evaluate(() => document.body.innerHTML);

        //     var $ = cheerio.load(html);

            
        //     var player_list = [];
            
        //     $('.dani-all').eq(0).find('tr').not('.rank_num').find('a').each(function () {
        //         player_list.push($(this).attr('href').split("rival=")[1]);
        //     });

        //     if (player_list.length == 0)    break;

           
        //     console.log("page " + k + "/" + (end-1));
        // }
        var outjson = JSON.stringify(user_array);
        fs.writeFileSync('./playdata/'+(dan - 6)+'userlist.json', outjson, 'utf-8');
        await rl.close();
        await browser.close();
    });
})();

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}