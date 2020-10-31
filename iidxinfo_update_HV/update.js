var fs = require('fs');
var readline = require('readline');

var r = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})
/////////////////////global variable///////////////////////
var song_num = -1;//total number of song

var num_12dan = 3703;           //total number of each dan
var num_11dan = 5222;
var num_10dan = 5598;

//////////////////////function/////////////////////////////

count_song_num();
make_song_list();
make_song_ranking();
merge_and_split_data();
play_count();
songinfo_json();
top1();
top_ranker();

///////////////////////////////////////////////////////

function count_song_num() {             //count number of song (song_num)
    var count = 0;
    var song_array = [];
    var i;

    console.log("count number of song");

    for (i = 0; i < 3000; i++) {
        try{
            var allSongs = JSON.parse(fs.readFileSync("./12playdata/12-" + i + ".json", "utf-8"));

            allSongs.forEach(function (song) {
                if (song_array.indexOf(song.Title) === -1) {
                    song_array.push(song.Title);
                    count++;
                }
            })
        } catch (e) {

        }
        
    }
    console.log("number of song: "+ count);
    song_num = count;
}

function play_count() {
    console.log("play count start");
    var Title = "";
    var json_array = [];
    var element = {};
    var count
    var fc;
    var ex;
    var hd;
    var cl;
    var ec;
    var ac;
    var fl;
    var np;

    if (song_num == -1) {
        count_song_num();
    }

    for (i = 0; i < song_num; i++) {
        count = 0;
        fc = 0;
        ex = 0;
        hc = 0;
        cl = 0;
        ec = 0;
        ac = 0;
        fl = 0;
        np = 0;
        element = {};

        var PlayList = JSON.parse(fs.readFileSync('./playdata_ranking/' + i + '.json', 'utf8'));
        PlayList.forEach(function (play) {
            if (count == 0) {
                Title = play.Title;
            }
            if (play.Score !== 0) {
                count++;
                switch (play.Lamp) {
                    case 7:
                        fc++;
                        break;
                    case 6:
                        ex++;
                        break;
                    case 5:
                        hc++;
                        break;
                    case 4:
                        cl++;
                        break;
                    case 3:
                        ec++;
                        break;
                    case 2:
                        ac++;
                        break;
                    case 1:
                        fl++;
                        break;
                    case 0:
                        np++;
                        break;
                }
            }
        });

        element = {
            "Title": Title,
            "PlayCount": count,
            "FC": fc,
            "EX": ex,
            "HC": hc,
            "CL": cl,
            "EC": ec,
            "AC": ac,
            "FL": fl,
            "NP": np
        }
        json_array.push(element);
    }


    fs.writeFileSync("./userinfo_json/PlayCount.json", JSON.stringify(json_array), 'utf8');
    console.log("play count done");
}

function make_song_list() {
    console.log("make songlist.json");
    var json_array = [];
    var Title_array = [];
    var element = {};
    var i;

    for (i = 0; i < 3000; i++) {
        try{
            var allSongs = JSON.parse(fs.readFileSync("./12playdata/12-" + i + ".json", "utf-8"));
            allSongs.forEach(function (song) {
                DJID = parseInt(song.DJID);
                Title = song.Title;
                Difficulty = song.Difficulty;

                if (Title_array.indexOf(Title) === -1) {
                    console.log(Title);
                    Title_array.push(Title);
                    element = {
                        "Title": Title
                    }
                    json_array.push(element);
                }
            });
        }
        catch (e) {

        }
    }

    fs.writeFileSync("./songlist.json", JSON.stringify(json_array), 'utf8');
}

function make_song_ranking() {
    console.log("make song ranking");

    //make_song_list();

    if (song_num == -1) {
        count_song_num();
    }
    

    count = 0;
    var SongList = JSON.parse(fs.readFileSync('./songlist.json', 'utf8'));

    SongList.forEach(function (title) {
        console.log(title.Title);
        var json_array = [];
        var temp_title = title.Title;

        for (i = 0; i < num_12dan; i++) {
            try{
                var allSongs = JSON.parse(fs.readFileSync("./12playdata/" + 12 + '-' + i + '.json', 'utf8'));
                allSongs.forEach(function (song) {
                    if (temp_title === song.Title) {
                        json_array.push(song);
                    }
                });
            }
            catch (e) {

            }
        }

        for (i = 0; i < num_11dan; i++) {
            try{
                var allSongs = JSON.parse(fs.readFileSync("./11playdata/" + 11 + '-' + i + '.json', 'utf8'));

                allSongs.forEach(function (song) {
                    if (temp_title === song.Title) {
                        json_array.push(song);
                    }
                });
            }
            catch (e) {

            }
        }

        for (i = 0; i < num_10dan; i++) {
            try{
                var allSongs = JSON.parse(fs.readFileSync("./10playdata/" + 10 + '-' + i + '.json', 'utf8'));

                allSongs.forEach(function (song) {
                    if (temp_title === song.Title) {
                        json_array.push(song);
                    }
                });
            }
            catch (e) {

            }
        }

        json_array.sort(function (a, b) {
            return parseFloat(b.Score) - parseFloat(a.Score);
        });
        var last_ranking = 1;
        for (i = 0 ; i < json_array.length; i++) {
            if (i !== 0) {
                if (json_array[i].Score === json_array[i - 1].Score) {
                    json_array[i].Ranking = last_ranking;
                }
                else {
                    json_array[i].Ranking = i + 1;
                    last_ranking = i + 1;
                }
            }
            else {
                json_array[i].Ranking = i + 1;
            }
        }
        console.log(json_array);
        fs.writeFileSync("./playdata_ranking/" + count + ".json", JSON.stringify(json_array), 'utf8');
        count++;
    });
}

function merge_and_split_data() {
    if (song_num == -1) {
        count_song_num();
    }

    var i;
    var Title = "";
    var json_array = [];
    var data = [];
    var top1 = 0;
    var top3 = 0;
    var top5 = 0;
    var top10 = 0;
    var fc = 0;
    var exh = 0;
    var hd = 0;
    var cl = 0;
    var ec = 0;
    var ac = 0;
    var fd = 0;
    
    for (i = 0; i < song_num; i++) {
        var RankingList = JSON.parse(fs.readFileSync('./playdata_ranking/' + i + '.json', 'utf8'));
        RankingList.forEach(function (Ranking) {
            json_array.push(Ranking);
        });
    }

    json_array.sort(function (a, b) {
        return parseInt(a.DJID) - parseInt(b.DJID);
    });

    fs.writeFileSync("./playdata_merge.json", JSON.stringify(json_array), 'utf8');
    
    console.log("merge done");

    var PlayList = JSON.parse(fs.readFileSync('./playdata_merge.json', 'utf8'));
    var DJID = "";
    json_array = {};
    json_array.data = data;
    json_array.top1 = top1;
    json_array.top3 = top3;
    json_array.top5 = top5;
    json_array.top10 = top10;
    json_array.fc = fc;
    json_array.exh = exh;
    json_array.hd = hd;
    json_array.cl = cl;
    json_array.ec = ec;
    json_array.ac = ac;
    json_array.fd = fd;
    console.log(json_array);
    console.log("split start");
    PlayList.forEach(function (play) {
        if (DJID == play.DJID) {
            DJID = play.DJID;
            data.push(play);
        }
        else {
            data.forEach(function (song_ranking) {
                if (song_ranking.Ranking == 1) {
                    top1++;
                }
                if (song_ranking.Ranking <= 3) {
                    top3++;
                }
                if (song_ranking.Ranking <= 5) {
                    top5++;
                }
                if (song_ranking.Ranking <= 10) {
                    top10++;
                }
                if (song_ranking.Lamp == 7) {
                    fc++;
                }
                if (song_ranking.Lamp >= 6) {
                    exh++;
                }
                if (song_ranking.Lamp >= 5) {
                    hd++;
                }
                if (song_ranking.Lamp >= 4) {
                    cl++;
                }
                if (song_ranking.Lamp >= 3) {
                    ec++;
                }
                if (song_ranking.Lamp >= 2) {
                    ac++;
                }
                if (song_ranking.Lamp >= 1) {
                    fd++;
                }
            })
            console.log(top1);
            console.log(top3);
            console.log(top5);
            console.log(top10);
            
            json_array.top1 = top1;
            json_array.top3 = top3;
            json_array.top5 = top5;
            json_array.top10 = top10;
            json_array.fc = fc;
            json_array.exh = exh;
            json_array.hd = hd;
            json_array.cl = cl;
            json_array.ec = ec;
            json_array.ac = ac;
            json_array.fd = fd;
            json_array.data = data;

            fs.writeFileSync("./userinfo_json/" + DJID + ".json", JSON.stringify(json_array), 'utf8');
            json_array = {};
            data = [];
            top1 = 0;
            top3 = 0;
            top5 = 0;
            top10 = 0;
            fc = 0;
            exh = 0;
            hd = 0;
            cl = 0;
            ec = 0;
            ac = 0;
            fd = 0;

            data.push(play);
            DJID = play.DJID;
        }
    });

    fs.writeFileSync("./userinfo_json/" + DJID + ".json", JSON.stringify(json_array), 'utf8');
    console.log("split done");
}

function songinfo_json() {
    if (song_num == -1) {
        count_song_num();
    }
    var pagecount = new Array();

    for (var i = 0; i < song_num; i++) {
        var contents = fs.readFileSync("./playdata_ranking/" + i + ".json");
        var json = JSON.parse(contents);
        var page = new Object;
        var s = json[0].Title;

        var title = '';
        for (var j = 0; j < s.length; j++) {
            title += s.charCodeAt(j).toString(16);
        }



        page.Title = title;
        page.Count = 0;

        fs.mkdirSync('./songinfo_json/' + title);

        console.log(title);
        var max_ind = Math.floor(json.length / 100) + 1;

        for (var ind = 1; ind <= max_ind; ind++) {
            page.Count++;
            var res = new Array();
            var con = true;
            for (var row = (ind - 1) * 100; row < ind * 100; row++) {
                var data = json[row];
                if (!data || data.Score == 0) {
                    con = false;
                    break;
                }
                res.push(data);
            }
            fs.writeFileSync('./songinfo_json/' + title + '/' + ind + '.json', JSON.stringify(res));
            if (!con) break;

        }
        pagecount.push(page);
    }
    fs.writeFileSync('./songinfo_json/count.json', JSON.stringify(pagecount));
}

function top1() {
    if (song_num == -1) {
        count_song_num();
    }
    var i;
    var json_array = [];


    for (i = 0; i < song_num; i++) {
        var PlayList = JSON.parse(fs.readFileSync('./playdata_ranking/' + i + '.json', 'utf8'));
        PlayList.forEach(function (Play) {
            if (Play.Ranking == 1) {
                json_array.push(Play);
            }
        });
        console.log(i);
    }

    fs.writeFileSync("./top1.json", JSON.stringify(json_array), 'utf8');
}

function top_ranker() {
    ////variables
    console.log("top_ranker start");
    var top1_array = [];
    var top3_array = [];
    var top5_array = [];
    var top10_array = [];
    var fc_array = [];
    var exh_array = [];
    var top1_array_temp = [];
    var top3_array_temp = [];
    var top5_array_temp = [];
    var top10_array_temp = [];
    var fc_array_temp = [];
    var exh_array_temp = [];
    var UserList = JSON.parse(fs.readFileSync('./userlist.json', 'utf8'));

    ////make array
    UserList.forEach(function (user) {
        var DJID = user.I;
        var DJName = user.N;
        try{
            var Userdata = JSON.parse(fs.readFileSync('./userinfo_json/' + DJID + '.json', 'utf8'));

            var top1_info = { "DJID": DJID, "DJName": DJName, "top1": Userdata.top1 };
            var top3_info = { "DJID": DJID, "DJName": DJName, "top3": Userdata.top3 };
            var top5_info = { "DJID": DJID, "DJName": DJName, "top5": Userdata.top5 };
            var top10_info = { "DJID": DJID, "DJName": DJName, "top10": Userdata.top10 };
            var fc_info = { "DJID": DJID, "DJName": DJName, "fc": Userdata.fc };
            var exh_info = { "DJID": DJID, "DJName": DJName, "exh": Userdata.exh };

            top1_array_temp.push(top1_info);
            top3_array_temp.push(top3_info);
            top5_array_temp.push(top5_info);
            top10_array_temp.push(top10_info);
            fc_array_temp.push(fc_info);
            exh_array_temp.push(exh_info);
        } catch (e) {

        }
        
        
    })

    ////sort
    top1_array_temp.sort(function (a, b) {
        return parseFloat(b.top1) - parseFloat(a.top1);
    });

    top3_array_temp.sort(function (a, b) {
        return parseFloat(b.top3) - parseFloat(a.top3);
    });

    top5_array_temp.sort(function (a, b) {
        return parseFloat(b.top5) - parseFloat(a.top5);
    });

    top10_array_temp.sort(function (a, b) {
        return parseFloat(b.top10) - parseFloat(a.top10);
    });

    fc_array_temp.sort(function (a, b) {
        return parseFloat(b.fc) - parseFloat(a.fc);
    });

    exh_array_temp.sort(function (a, b) {
        return parseFloat(b.exh) - parseFloat(a.exh);
    });

    ////rank
    count = 1;
    count_temp = 1;
    temp = -1;
    top1_array_temp.forEach(function (top1) {
        if (top1.top1 > 0) {
            if (top1.top1 == temp) {
                top1.Ranking = count_temp;
            }
            else {
                top1.Ranking = count;
                count_temp = count;
            }
            temp = top1.top1;
            count++;

            top1_array.push(top1);
        }
    })

    count = 1;
    count_temp = 1;
    temp = -1;
    top3_array_temp.forEach(function (top3) {
        if (top3.top3 > 0) {
            if (top3.top3 == temp) {
                top3.Ranking = count_temp;
            }
            else {
                top3.Ranking = count;
                count_temp = count;
            }
            temp = top3.top3;
            count++;

            top3_array.push(top3);
        }
    })

    count = 1;
    count_temp = 1;
    temp = -1;
    top5_array_temp.forEach(function (top5) {
        if (top5.top5 > 0) {
            if (top5.top5 == temp) {
                top5.Ranking = count_temp;
            }
            else {
                top5.Ranking = count;
                count_temp = count;
            }
            temp = top5.top5;
            count++;

            top5_array.push(top5);
        }
    })

    count = 1;
    count_temp = 1;
    temp = -1;
    top10_array_temp.forEach(function (top10) {
        if (top10.top10 > 0) {
            if (top10.top10 == temp) {
                top10.Ranking = count_temp;
            }
            else {
                top10.Ranking = count;
                count_temp = count;
            }
            temp = top10.top10;
            count++;

            top10_array.push(top10);
        }
    })

    count = 1;
    count_temp = 1;
    temp = -1;
    fc_array_temp.forEach(function (fc) {
        if (fc.fc == temp) {
            fc.Ranking = count_temp;
        }
        else {
            fc.Ranking = count;
            count_temp = count;
        }
        temp = fc.fc;
        count++;
        if (count_temp <= 100) {
            fc_array.push(fc);
        }
    })

    count = 1;
    count_temp = 1;
    temp = -1;
    exh_array_temp.forEach(function (exh) {
        if (exh.exh == temp) {
            exh.Ranking = count_temp;
        }
        else {
            exh.Ranking = count;
            count_temp = count;
        }
        temp = exh.exh;
        count++;
        if (count_temp <= 100){
            exh_array.push(exh);
        }
    })

    fs.writeFileSync("./top1_ranker.json", JSON.stringify(top1_array), 'utf8');
    fs.writeFileSync("./top3_ranker.json", JSON.stringify(top3_array), 'utf8');
    fs.writeFileSync("./top5_ranker.json", JSON.stringify(top5_array), 'utf8');
    fs.writeFileSync("./top10_ranker.json", JSON.stringify(top10_array), 'utf8');
    fs.writeFileSync("./fc_ranker.json", JSON.stringify(fc_array), 'utf8');
    fs.writeFileSync("./exh_ranker.json", JSON.stringify(exh_array), 'utf8');
}