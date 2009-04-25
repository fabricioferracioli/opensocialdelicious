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

function handlePopulateMyAppData(data)
{
    message = 'Your Delicious data was updated sucessfully!';
    if (data.hadError())
        message = 'An error occurred saving the data. Try again later.';
    $('delicious').update(new Element('p').update(message));

}

function firstUsage()
{
    console.log('firstUsage');
    delicious_form = new Element('form', {name: 'deliciousInfo'});
    label_username = new Element('label', {for: 'username'}).update('Delicious Username: ');
    username = new Element('input', {type: 'text', name: 'deliciousUsername', id: 'username'});
    label_qtd = new Element('label', {for: 'qtd'}).update('Showed Delicious Bookmarks: ');
    num_bookmarks = new Element('input', {type: 'text', name: 'bookmarksShowed', id: 'qtd', value: 20});
    send = new Element('input', {type: 'button', name: 'send', value: 'Send', id: ('sendbutton')});

    delicious_form.insert(label_username);
    delicious_form.insert(username);
    delicious_form.insert(new Element('br'));
    delicious_form.insert(label_qtd);
    delicious_form.insert(num_bookmarks);
    delicious_form.insert(new Element('br'));
    delicious_form.insert(send);

    $('delicious').insert(delicious_form);
    $('sendbutton').observe('click', function(evt) {
        req.add(req.newUpdatePersonAppDataRequest("VIEWER", "deliciousUsername", $F('username')));
        req.add(req.newUpdatePersonAppDataRequest("VIEWER", "bookmarksShowed", $F('qtd')));
        req.send(handlePopulateMyAppData, "update_appdata");
    });
}

function setInitialDeliciousInfo(data)
{
    if (data['deliciousUsername'] != '')
        deliciousUsername = data['deliciousUsername'];

    if (data['bookmarksShowed'] != '')
        bookmarksShowed = data['bookmarksShowed'];

    if (deliciousUsername == '' &&  bookmarksShowed == '')
        firstUsage();
    else
        getDeliciousData();
}

function handleRequestMyData(data)
{
    var viewer_data =  data.get('viewer_data');
    var viewer = data.get('viewer');
    var me = viewer.getData();
    var deliciousData = viewer_data.getData();
    setInitialDeliciousInfo(deliciousData[me.getId()]);
}

function getDeliciousData()
{
    console.log('getDeliciousData');
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
}

document.observe('dom:loaded', function(){

    var req = opensocial.newDataRequest();
    var fields = ['deliciousUsername', 'bookmarksShowed'];
    req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.VIEWER), "viewer");
    req.add(req.newFetchPersonAppDataRequest("VIEWER", fields), "viewer_data");
    req.send(handleRequestMyData);
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
        $('delicious').update(container);
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
