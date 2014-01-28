function friendsRender(data) {
  if (data.error) {
    return;
  }
  var results = '';
  for (var i = Object.keys(data.users).length - 1; i >= 0; i--) {
    id = Object.keys(data.users)[i];
    friend = data.users[id];
    var icon = '';
    var label = '';
    var online = '';
    var score = '';
    if (data.sharewithme[id]) {
      if (data.ishareto[id]) {
        // взаимные
        icon = '<img src="/my/friends/arrow-mutual.gif"/>';
        label = 'Удалить';
      } else {
        // я его друг
        icon = '<img src="/my/friends/arrow-friendof.gif"/>';
        label = 'Добавить';
      }
    } else if (data.ishareto[id]) {
      // он мой друг
      icon = '<img src="/my/friends/arrow-friend.gif"/>';
      label = 'Удалить';
    } else {
      // не друзья
      icon = '<i class="glyphicon glyphicon-minus"></i>';
      label = 'Добавить';
    }
    if (friend.online) {
      online = ' <span class="online">online</span>';
    }
    if (friend.score) {
      score = '<span class="badge pull-right">' + friend.score + '</span>';
    }

    results += '\
      <div class="friend">\
        <img class="img-circle" src="'+friend.photo50+'"/>\
        <p>\
          ' + score + friend.name + online + '\
        </p>\
        <p>\
          ' + icon + '\
          <a data-id="'+id+'" href="#" class="btn btn-default btn-xs editfriend-btn">'+label+'</a>\
        </p>\
      </div>';
  };
  $('#friends-data').html(results);
  $('.editfriend-btn').click(function(event){
    event.preventDefault();
    connect('friends/switch', $(this).data('id'), friendsRender);
  })
}

$(function(){
  //connect('friends/getdata', friendsRender);
})