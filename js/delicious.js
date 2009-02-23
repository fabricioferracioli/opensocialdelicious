var deliciousUsername = '';
var bookmarksShowed = '';

function makeCachedRequest(url, callback, params, refreshInterval) {
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
    var ts = new Date().getTime();
    var sep = "?";
    if (refreshInterval && refreshInterval > 0) {
        ts = Math.floor(ts / (refreshInterval * 1000));
    }
    if (url.indexOf("?") > -1) {
        sep = "&";
    }
    url = [ url, sep, "nocache=", ts ].join("");
    gadgets.io.makeRequest(url, callback, params);
}

function makeJSONRequest(url, response, params)
{
    var params = {};
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
    gadgets.io.makeRequest(url, response, params);
};

function setInitialDeliciousInfo(data)
{
    deliciousUsername = 'fabricioferracioli';
    if (data['deliciousUsername'] != '')
        deliciousUsername = data['deliciousUsername'];

    bookmarksShowed = 20;
    if (data['bookmarksShowed'] != '')
        bookmarksShowed = data['bookmarksShowed'];
}

function handleRequestMyData(data)
{
    var viewer_data =  data.get('viewer_data');
    var viewer = data.get('viewer');
    var me = viewer.getData();
    var deliciousData = viewer_data.getData();
    setInitialDeliciousInfo(deliciousData[me.getId()]);
}

document.observe('dom:loaded', function(){

    var req = opensocial.newDataRequest();
    var fields = ['deliciousUsername', 'bookmarksShowed'];
    req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.VIEWER), "viewer");
    req.add(req.newFetchPersonAppDataRequest("VIEWER", fields), "viewer_data");
    req.send(handleRequestMyData);

    /* user login at delicious */
    var url = 'http://feeds.delicious.com/v2/json/';
    var params = {};
    params['count'] = bookmarksShowed;
    var callback = processDeliciousUserBookmarks;
    /* requesting the json from user bookmarks */
    makeCachedRequest(url+deliciousUsername, callback, params, 0);

    url = 'http://feeds.delicious.com/v2/json/userinfo/';
    callback = processDeliciousUserInfo;
    params = {};
    /* requesting user information from delicious */
    makeCachedRequest(url+deliciousUsername, callback, params, 0);
});

function processDeliciousUserBookmarks(bookmarks){
    var jsondata = bookmarks.data;
    jsondata.each(function(jsdata){
        container = new Element('div', {class: 'bookmark_box'});
        url_box = new Element('div', {class: 'url'});
        descript = new Element('div', {class: 'description'});
        foot = new Element('div', {class: 'foot'});
        a = new Element('a', {href: jsdata.u}).update(jsdata.d);
        container.insert(url_box.insert(a));
        container.insert(descript.insert(new Element('q').update(jsdata.n)));
        container.insert(foot.insert('Saved: '+jsdata.dt));
        $('delicious').insert(container);
//         $('delicious').insert(' -- saved '+jsdata.dt);
//         $('delicious').insert(new Element('br'));
//         $('delicious').insert(new Element('q').update(jsdata.n));
//         $('delicious').insert(new Element('br'));
    });
}

function processDeliciousUserInfo(info){
    var jsondata = info.data;

    var person = deliciousUsername;
    $('user_data').insert(person+' have '+jsondata[0].n+' bookmaked items');
    $('user_data').insert(new Element('br'));
    $('user_data').insert('showing last '+bookmarksShowed);
    $('user_data').insert(new Element('br'));
    $('user_data').insert(new Element('a', {href: 'Visit '+person+' at delicious'}));
}



