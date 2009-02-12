var deliciousUsername = 'fabricioferracioli';
var bookmarksShowed = 20;
document.observe('dom:loaded', function(){
    /* user login at delicious */
    var url = 'http://feeds.delicious.com/v2/json/';
    var callback = '?count='+bookmarksShowed+'&callback=processDeliciousUserBookmarks';

    /* requesting the json from user bookmarks and addind them in the html head section */
    scr = new Element('script');
    scr.type = 'text/javascript';
    scr.src = url+deliciousUsername+callback;

    $$('head')[0].insert(scr);

    /* requesting user information from delicious */
    url = 'http://feeds.delicious.com/v2/json/userinfo/';
    callback = '?callback=processDeliciousUserInfo';

    scr = new Element('script');
    scr.type = 'text/javascript';
    scr.src = url+deliciousUsername+callback;

    $$('head')[0].insert(scr);
});

function processDeliciousUserBookmarks(bookmarks){
    bookmarks.each(function(elem){
        console.log(elem);
        a = new Element('a', {href: elem.u}).update(elem.d);
        $('delicious').insert(a);
        $('delicious').insert(' -- saved '+elem.dt);
        $('delicious').insert(new Element('br'));
        $('delicious').insert(new Element('q').update(elem.n));
        $('delicious').insert(new Element('br'));
    });
}

function processDeliciousUserInfo(info){
    var person = opensocial.Person.getField(Person.Field.NAME);
    $('user_data').insert(person+' have '+info[0].n+' bookmaked items');
    $('user_data').insert(new Element('br'));
    $('user_data').insert('showing last '+bookmarksShowed);
    $('user_data').insert(new Element('br'));
    $('user_data').insert(new Element('a', {href: 'Visit '+person+' at delicious'}));
}