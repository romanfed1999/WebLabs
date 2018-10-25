var inputFansData;
var inputNewsData;
var inputNewsTitle;
var inputNewsBody;


function getFansStuff() {
    inputFansData = document.getElementById("inputFans").value;
}

function getNewsTitle() {
    inputNewsTitle = document.getElementById("inputTitle").value;
}

function getNewsBody() {
    inputNewsBody = document.getElementById("inputArticle").value;
}

function currentDate() {
    var d = new Date();
    var dformat = [(d.getMonth() + 1),
               d.getDate(),
               d.getFullYear()].join('/') + ' ' + [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
    console.log(dformat);
    return dformat;

}

function getLocalFansData() {
    if (localStorage.getItem("comment_number") !== null) {
        var newsNumber = parseInt(localStorage.getItem("comment_number"));
        var data = "";
        for (var i = 0; i < newsNumber; i++) {
            data += localStorage.getItem("comment" + i);
        }
    }
    return data;
}

function saveFansDataLocaly(data) {
    if (localStorage.getItem("comment_number") !== null) {
        var news_number = parseInt(localStorage.getItem("comment_number"));
        localStorage.setItem("comment" + news_number, data);
        localStorage.setItem("comment_number", news_number + 1);
    } else {
        localStorage.setItem("comment_number", 1);
        localStorage.setItem("comment0", data);
    }
}

function postFansData(data) {
    document.getElementById("posts").innerHTML += data;
}

function postStuff() {
    var date = currentDate();
    if (inputFansData != null && /\S/.test(inputFansData)) {
        var data = "<p>" + inputFansData + "</p><p class=\"date\">" + date + "</p><p class=\"nickname\"><b>Nickname</b></p> <hr>";
        if (window.navigator.onLine) {
            //do smth(server emulation)
        } else {
            saveFansDataLocaly(data);
        }
        document.getElementById("posts").innerHTML += data;
        document.getElementById("inputFans").value = "";
        inputFansData = "";
        data = "";
    }
}

function publish() {
    if (inputNewsTitle !== null && inputNewsBody !== null && /\S/.test(inputNewsBody) && /\S/.test(inputNewsTitle)) {
        var data = "<div class=\"col-lg-3 col-md-3 col-sm-6 col-xs-12\"> <div class = \"thumbnail\"> <img src = \"637298374-612x612.jpg\" alt=\"Generic placeholder thumbnail\"> </div><div class = \"caption\"> <h3>" + inputNewsTitle + "</h3><p>" + inputNewsBody + "</p><a href = \"#\" class=\"btn btn-default\" role=\"button\">Read</a></div> </div>";
        if (window.navigator.onLine) {
            //do smth(server emulation)
        } else {
            saveNewsLocaly(data);
        }
        document.getElementById("inputTitle").value = "";
        document.getElementById("inputArticle").value = "";
    }
}

function getLocalNewsData() {
    if (localStorage.getItem("news_number") !== null) {
        var news_number = parseInt(localStorage.getItem("news_number"));
        var data = "";
        for (var i = 0; i < news_number; i++) {
            data += localStorage.getItem("news" + i);
        }
    }
    return data;
}

function postNews(data) {
    if (data !== undefined) {
        document.getElementById("news").innerHTML += data;
    }
}

function saveNewsLocaly(data) {
    if (localStorage.getItem("news_number") !== null) {
        var news_number = parseInt(localStorage.getItem("news_number"));
        localStorage.setItem("news" + news_number, data);
        localStorage.setItem("news_number", news_number + 1);
    } else {
        localStorage.setItem("news_number", 1);
        localStorage.setItem("news0", data);
    }
}

function isOnline() {
    return window.navigator.onLine;
}

window.addEventListener('load', function () {

    function updateOnlineStatus(event) {}

    if (window.navigator.onLine) {
        if (getLocalNewsData() !== undefined) {
        postNews(getLocalNewsData());
        }
    } else {
        

    }
});
