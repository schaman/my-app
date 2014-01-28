function feedRender(data) {
  var results = '';
  items = Object.keys(data.items);
  items.sort();
  for (var i = items.length - 1; i >= 0; i--) {
    id = items[i];
    item = data.items[id];
    results += '\
      <div data-id="'+item.id+'" href="#" class="feed-item">\
        <div class="feed-header">\
          <img class="img-circle" src="'+item.photo50+'"/>\
            <span class="feed-name">';
        if (item.online) {
          results += '• ';
        }
        results += item.name;
        if (item.teamname !== '') {
          results += ' @ ' + item.teamname;
        }
        results += '</span>\
          <span class="feed-date">'+moment(id, 'YYYY-MM-DD HH:mm:ss').fromNow()+'</span>\
        </div>';
      if (item.done == '') {
        if (item.itemclass == 'champ') {
          results += '<span class="feed-icon"><i class="glyphicon glyphicon-flash" style="color:#357ebd;"></i></span>';
        } else if (item.itemclass == 'goal') {
          results += '<span class="feed-icon"><i class="glyphicon glyphicon-screenshot" style="color:#5f2c8b;"></i></span>';
        }
      } else {
        results += '<span class="feed-icon"><i class="glyphicon glyphicon-ok" style="color:#449d44;"></i></span>';
      }
      results += '<span>';
      if (item.itemclass == 'champ') {
        results += '<em>'+item.goalname+'</em> ';
      } else if (item.itemclass == 'goal') {
        results += '<b>'+item.goalname+'</b> ';
      };
      results += item.text+'</span><p class="feed-likes';

      if (data.ilike.indexOf(item.id) >= 0) {
        results += ' ilike';
      }

      results += '"><a href="#"><i class="glyphicon glyphicon-heart"></i> <b>'+(item.likes == 0 ? '' : item.likes)+'</b></a></p>\
      </div>';
  };
  if (results == '') {
    $('#nofriends').show();
  } else {
    $('#feed-data').html(results);
  }
  $('.editfeed-btn').click(function(event){
    event.preventDefault();
    //editResult($(this).data('id'));
  })
  $('.feed-likes a').click(function(event){
    event.preventDefault();
    if ($(this).parent().hasClass('ilike')) {
      $(this).parent().removeClass('ilike');
      var i = ($(this).find('b').text());
      i--;
      $(this).find('b').hide().text(i).fadeIn();
    } else {
      $(this).parent().addClass('ilike');
      var i = ($(this).find('b').text());
      i++;
      $(this).find('b').hide().text(i).fadeIn();
    }
    var id = $(this).parents('.feed-item').attr('data-id');
    $.get("{{ path('feed_like') }}", {id: id});
  })
}
function feedLoad() {
  connect('feed', feedRender);
}
$(function(){
  $('a[href="#feed"]').on('click', function (e) {
    feedLoad();
  })
})
