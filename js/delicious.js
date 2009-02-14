var deliciousUsername = 'fabricioferracioli';
var bookmarksShowed = 20;

function makeJSONRequest(url, response, params)
{
    console.log(url);
    var params = {};
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
    gadgets.io.makeRequest(url, response, params);
};

// function response(obj) {
//     var jsondata = obj.data;
//     var html = "<strong>Values: </strong><br /><br />";
//     // Returned JS object can be processed as an associative array
//     for (var key in jsondata) {
//         var item = jsondata[key];
//         html += key + ": ";
//         html += item + "<br />";
//     }
//     document.getElementById('content_div').innerHTML = html;
// };
// makeJSONRequest();
// gadgets.json.parse(str);

document.observe('dom:loaded', function(){
    /* user login at delicious */
    var url = 'http://feeds.delicious.com/v2/json/';
    var params = {};
    params['count'] = bookmarksShowed;
    var callback = processDeliciousUserBookmarks;
    /* requesting the json from user bookmarks */
    makeJSONRequest(url+deliciousUsername, callback, params);


    url = 'http://feeds.delicious.com/v2/json/userinfo/';
    callback = processDeliciousUserInfo;
    params = {};
    /* requesting user information from delicious */
    makeJSONRequest(url+deliciousUsername, callback, params);
});

function processDeliciousUserBookmarks(bookmarks){
    console.log(bookmarks);
    var jsondata = bookmarks.data;
    jsondata.each(function(jsdata){
        console.log(jsdata);
        a = new Element('a', {href: jsdata[u]}).update(jsdata[d]);
        $('delicious').insert(a);
        $('delicious').insert(' -- saved '+jsdata[dt]);
        $('delicious').insert(new Element('br'));
        $('delicious').insert(new Element('q').update(jsdata[n]));
        $('delicious').insert(new Element('br'));
    });
}

function processDeliciousUserInfo(info){
    console.log(info);
    var jsondata = info.data;
    console.log(jsondata);
    var person = opensocial.Person.getField(Person.Field.NAME);
    $('user_data').insert(person+' have '+jsondata[0][n]+' bookmaked items');
    $('user_data').insert(new Element('br'));
    $('user_data').insert('showing last '+bookmarksShowed);
    $('user_data').insert(new Element('br'));
    $('user_data').insert(new Element('a', {href: 'Visit '+person+' at delicious'}));
}



