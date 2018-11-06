var inputFansData;
var inputNewsData;
var inputNewsTitle;
var inputNewsBody;
var useLocalStorage = true;

function getFansStuff() {
    inputFansData = document.getElementById("inputFans").value;
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

function saveFansDataLocaly(fansComment) {
    if (useLocalStorage) {
        if (localStorage.getItem("comment_number") !== null) {
            var news_number = parseInt(localStorage.getItem("comment_number"));
            localStorage.setItem("comment" + news_number, fansComment.getCommentBody());
            localStorage.setItem("comment_number", news_number + 1);
        } else {
            localStorage.setItem("comment_number", 1);
            localStorage.setItem("comment0", fansComment.getCommentBody());
        }
    } else {
        idb.insert("CommentsTable", {
            title: fansComment.getCommentBody()
        })
    }
}

function postFansData(data) {
    document.getElementById("posts").innerHTML += data;
}

function postStuff() {
    var date = currentDate();
    if (inputFansData != null && /\S/.test(inputFansData)) {
        var fansComment = new FansComment(inputFansData, date);
        if (window.navigator.onLine) {
            var res = idb.select("CommentsTable", 1, function (isSelected, responseData) {
                if (isSelected) {
                    console.log(responseData);
                } else {
                    console.log("Error");
                }
            });
        } else {
            saveFansDataLocaly(fansComment);
        }

        document.getElementById("inputFans").value = "";
        inputFansData = "";
        data = "";
    }
}


window.addEventListener('load', function () {

    function updateOnlineStatus(event) {}
    var test = window.navigator.onLine;
    if (window.navigator.onLine) {
        if (useLocalStorage) {
            if (getLocalFansData() !== undefined) {
                postFansData(getLocalFansData());
            }
        } else {
            idb.init({
                database: "ArsenalDB",
                version: 1,
                tables: [{
                    name: "CommentsTable",
                    autoIncrement: true
                }, {
                    name: "NewsTable",
                    autoIncrement: true
                }]
            }, function(){
                     var result = idb.select("CommentsTable", function(isSelected, responseData){
                         if(isSelected){
                             var commentsToPost = "";
                             for  (let o of responseData){
                                 commentsToPost += o.title;
                             }
                             postFansData(commentsToPost);
                         }
                         else{
                             console.log("Error");
                         }

                     });
                     });
        }
    }

});

class FansComment {
    constructor(commentBody, date) {
        this.commmentBody = commentBody;
        this.date = date;
    }

    getCommentBody() {
        return `<p> ${this.commmentBody} </p><p class=\"date\"> ${this.date} </p><p class=\"nickname\"><b>Nickname</b></p> <hr>`;
    }
}

idb = {
    idbObject: null, // windows indexedDB object.
    idbtran: null, // windows transaction object.
    dbRequest: null, // db creation request.
    db: null, //database
    version: 1, // database version
    tables: null, // collection of object store.
    init: function (options, callback) {
        if ('indexedDB' in window) {
            idb.idbObject = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            idb.idbtran = window.IDBTransaction || window.webkitIDBTransaction;
            idb.tables = options.tables;

            var idbRequest = window.indexedDB.open(options.database, options.version); // open/create db with specific version
            idbRequest.onerror = function () {
                console.log("Error opening database.");
            };

            idbRequest.onsuccess = function (e) { // store success db object in order for curd.
                idb.db = this.result;
                idb.version = options.version;
                callback();
            };
            idbRequest.onupgradeneeded = function (event) { // creation of object store first time on version change.
                var resultDb = event.target.result;
                idb.db = resultDb;
                var optionTables = idb.tables;


                //drop unwanted tables
                for (var i = 0; i < resultDb.objectStoreNames.length; i++) {
                    var needToDrop = true;
                    for (var j = 0; j < optionTables.length; j++) {
                        if (resultDb.objectStoreNames[i] == optionTables[j].name) {
                            needToDrop = false;
                            break;
                        }
                    }
                    if (needToDrop) {
                        idb.db.deleteObjectStore(resultDb.objectStoreNames[i]);
                    }
                }


                //create new tables
                for (var i = 0; i < optionTables.length; i++) {
                    if (!resultDb.objectStoreNames.contains(optionTables[i].name)) {
                        var objectStore = resultDb.createObjectStore(optionTables[i].name, {
                            keyPath: optionTables[i].keyPath,
                            autoIncrement: optionTables[i].autoIncrement
                        });
                        console.log(optionTables[i].name + " Created.");
                        if (optionTables[i].index != null && optionTables[i].index != 'undefined') {
                            for (var idx = 0; idx < optionTables[i].index.length; idx++) {
                                objectStore.createIndex(optionTables[i].index[idx].name, optionTables[i].index[idx].name, {
                                    unique: optionTables[i].index[idx].unique
                                });
                            }
                        }
                    }
                }





            }
        } else {
            console.log("This browser doesn't support IndexedDB");
        }
    },
    insert: function (table, data, callback = null) {
        var db = idb.db;

        var isTableExists = false;
        for (var i = 0; i < idb.tables.length; i++) {
            if (idb.tables[i].name == table) {
                isTableExists = true;
                break;
            }
        }

        if (!isTableExists) {
            if (callback && typeof (callback) === "function") {
                callback(false, table + " Table not found.");
            }
        } else {
            var tx = db.transaction(table, "readwrite");
            var store = tx.objectStore(table);


            var dataLength = 1;
            if (data.constructor === Array) {
                dataLength = data.length;
                for (var i = 0; i < dataLength; i++) {
                    store.put(data[i]);
                }
            } else {
                store.put(data);
            }

            tx.oncomplete = function () {
                if (callback && typeof (callback) === "function") {
                    callback(true, "" + dataLength + " records inserted.");
                }
            };

        }
    },
    delete: function (table, key, callback) {
        var db = idb.db;

        var isTableExists = false;
        for (var i = 0; i < idb.tables.length; i++) {
            if (idb.tables[i].name == table) {
                isTableExists = true;
                break;
            }
        }

        if (!isTableExists) {
            if (callback && typeof (callback) === "function") {
                callback(false, table + " Table not found.");
            }
        } else {



            var tx = db.transaction(table, "readwrite");
            var store = tx.objectStore(table);

            var keyLength = -1;
            if (key && typeof (key) === "function") {
                store.clear();
            } else {
                if (key.constructor === Array) {
                    keyLength = key.length
                    for (var i = 0; i < keyLength; i++) {
                        store.delete(key[i]);
                    }
                } else {
                    keyLength = 1;
                    store.delete(key);
                }
            }


            tx.oncomplete = function (event) {
                //if all argument available
                if (callback && typeof (callback) === "function") {
                    callback(true, "" + keyLength == -1 ? "All" : keyLength + " records deleted.");
                }

                //if only two argument available
                if (key && typeof (key) === "function") {
                    key(true, "" + (keyLength == -1 ? "All" : keyLength) + " records deleted.");
                }
            };

            tx.onerror = function () {
                if (callback && typeof (callback) === "function") {
                    callback(false, tx.error);
                }
            };
        }
    },
    select: function (table, key, callback) {
        var db = idb.db;

        var isTableExists = false;
        for (var i = 0; i < idb.tables.length; i++) {
            if (idb.tables[i].name == table) {
                isTableExists = true;
                break;
            }
        }

        if (!isTableExists) {
            if (callback && typeof (callback) === "function") {
                callback(false, table + " Table not found.");
            }
        } else {

            var tx = db.transaction(table, "readonly");
            var store = tx.objectStore(table);
            var request;
            var keyLength = -1;
            var data;
            if (key && typeof (key) === "function") {
                request = store.getAll();
            } else if (key.constructor === Array) {
                keyLength = key.length
                request = store.getAll();
            } else if (key && typeof key === 'object' && key.constructor === Object) {
                keyLength = 1
                var index = store.index(key.key);
                request = index.getAll(key.value);
            } else {
                keyLength = 1;
                request = store.get(key);
            }


            tx.oncomplete = function (event) {
                //if all argument available
                var result = request.result;
                var keypath = request.source.keyPath;
                var filteredResult = [];

                //if need to filter key array
                if (keyLength > 1) {
                    for (var i = 0; i < result.length; i++) {
                        for (var j = 0; j < keyLength; j++) {
                            if (result[i][keypath] == key[j]) {
                                filteredResult.push(result[i]);
                                break;
                            }
                        }
                    }
                    result = filteredResult;
                }


                if (callback && typeof (callback) === "function") {
                    callback(true, result);

                }

                //if only two argument available
                if (key && typeof (key) === "function") {
                    key(true, request.result);
                }
            }

            tx.onerror = function () {
                if (callback && typeof (callback) === "function") {
                    callback(false, request.error);
                }
            };
        }
    },
};
