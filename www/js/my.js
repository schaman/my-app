function myGo(page) {
  $('#my-pages a[href="#my-'+page+'"]').tab('show');
}
function myHasUpdates() {
  if (!doc || !('updates' in doc)) return false;

  if (Object.keys(doc.updates.goals).length > 0) return true;
  if (Object.keys(doc.updates.champs).length > 0) return true;

  return false;
}
function myPull() {
  if (!myHasUpdates()) {
    connect('my/getdata', function(loaded) {
      if (!myHasUpdates()) {
        if (loaded.champs) {
          doc = loaded;
          localStorage.setItem('doc', JSON.stringify(doc));
          myRender();
        } else {
          if (loaded.error) {
            login();
          }
        }
      }
    })
  }
}
function myPush() {
  if (myHasUpdates()) {
    var pushdata = JSON.stringify(doc);
    connect('my/setdata', pushdata, function(acceptedUpdates) {
      for (var i = Object.keys(acceptedUpdates.champs).length - 1; i >= 0; i--) {
        delete doc.updates.champs[Object.keys(acceptedUpdates.champs)[i]];
      }
      for (var i = Object.keys(acceptedUpdates.goals).length - 1; i >= 0; i--) {
        delete doc.updates.goals[Object.keys(acceptedUpdates.goals)[i]];
      }
      myPull();
    });
  } else {
    myPull();
  }
}
function myCommit(kind, id) {
  if (!('updates' in doc)) doc.updates = {'goals': {}, 'champs': {}};
  doc.updates[kind][id] = true;

  // обновляем goalname
  if (kind == 'champs') {
    var champ = doc[kind][id];
    if (champ) {
      if (champ.goal == '') {
        champ.goalname = '';
      } else {
        for (var i = Object.keys(doc.goals).length - 1; i >= 0; i--) {
          var goal = doc.goals[Object.keys(doc.goals)[i]];
          if (champ.goal == goal.id) {
            champ.goalname = goal.name;
            break;
          }
        }
      }
    }
  }

  var data = JSON.stringify(doc);
  localStorage.setItem('doc', data);
  myPush();
  myRender();
  myGo('index');
}
function myChampCommit(id) {
  myCommit('champs', id);
}
function myGoalCommit(id) {
  myCommit('goals', id);
}
var doc;
function myRender() {
  var dates = {};
  var today = moment().format('YYYY-MM-DD');
  var yesterday = moment().subtract('days', 1).format('YYYY-MM-DD');
  var tomorrow = moment().add('days', 1).format('YYYY-MM-DD');
  for (var i = Object.keys(doc.champs).length - 1; i >= 0; i--) {
    var id = Object.keys(doc.champs)[i];
    var champ = doc.champs[id];
    var date = '';

    if (champ.done == '0000-00-00 00:00:00') champ.done = '';
    if (champ.start == '0000-00-00 00:00:00') champ.start = '';

    function myRenderBadge(item) {
      var privacy = '';
      var likes = '';

      if (item.privacy == 'private') {
        privacy = '<i class="glyphicon glyphicon-eye-close private" title="Не видна никому"></i>';
      } else {
        if (item.privacy == 'public') {
          privacy = '<i class="glyphicon glyphicon-globe public" title="Видна всем"></i>';
        }

        if (item.likes > 0) {
          likes = '<span class="likes"><i class="glyphicon glyphicon-heart-empty"></i> <b>'+item.likes+'</b></span>';
        }
      }
      return '\
        <p class="pull-right">' + likes + ' ' + privacy + '</p>';
    }

    function myRenderItem(date, collection, itemclass, item) {
      if (!(date in dates)) {
        dates[date] = {tasks:'', results:'', goals:''};
      }
      var icon;
      if (collection == 'tasks') {
        icon = '<i class="glyphicon glyphicon-flash" style="color:#357ebd;"></i>';
      } else if (collection == 'results') {
        icon = '<i class="glyphicon glyphicon-ok" style="color:#449d44;"></i>';
      } else if (collection == 'goals') {
        icon = '<i class="glyphicon glyphicon-screenshot" style="color:#5f2c8b;"></i>';
      }
      var text;
      if (itemclass == 'goal') {
        text = '<span><b>'+item.name+'</b> '+item.text+'</span>';
      } else if (itemclass == 'champ') {
        text = '<span>'+item.text+'</span>';
      }
      dates[date][collection] += '\
        <a data-id="'+id+'" href="#" class="list-group-item ' + itemclass + '-item ' + collection + '">\
          ' + myRenderBadge(item) + '\
          ' + icon + '\
          <em>\
            ' + (item.teamname?item.teamname:'') + '\
            ' + (item.goal&&item.goal!==''?doc.goals[item.goal].name:'') + '\
          </em>\
          <span>'+text+'</span>\
        </a>';
    }

    if (champ.done == '') {
      if (champ.start == '') {
        date = 'later';
      } else {
        date = moment(champ.start, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
      }
      myRenderItem(date, 'tasks', 'champ', champ);
    } else {
      date = moment(champ.done, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
      myRenderItem(date, 'results', 'champ', champ);
    }
  };
  for (var i = Object.keys(doc.goals).length - 1; i >= 0; i--) {
    var id = Object.keys(doc.goals)[i];
    var goal = doc.goals[id];
    var date = '';

    if (goal.done == '0000-00-00 00:00:00') goal.done = '';

    if (goal.done == '') {
      date = 'later';
      myRenderItem(date, 'goals', 'goal', goal);
    } else {
      date = moment(goal.done, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
      myRenderItem(date, 'results', 'goal', goal);
    }
  };
  s = '';
  var sorteddates = Object.keys(dates).sort();
  for (var i = sorteddates.length - 1; i >= 0; i--) {
    var date = sorteddates[i];
    if (date == 'later') {
      s += '<h4>Очень скоро</h4>';
    } else if (date == tomorrow) {
      s += '<h4>Завтра, ' + moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM, dddd') + '</h4>';
    } else if (date == today) {
      s += '<h4><b>Сегодня, ' + moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM, dddd') + '</b></h4>';
    } else if (date == yesterday) {
      s += '<h4>Вчера, ' + moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM, dddd') + '</h4>';
    } else {
      s += '<h4>' + moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM, dddd') + '</h4>';
    }
    if (dates[date].goals && dates[date].goals !== '') {
      s += 'Цели <div class="list-group" class="my-goals">'+dates[date].goals+'</div>';
    }
    if (dates[date].results !== '') {
      s += 'Результаты <div class="list-group" class="my-results">'+dates[date].results+'</div>';
    }
    if (dates[date].tasks !== '') {
      s += 'Задачи <div class="list-group" class="my-tasks">'+dates[date].tasks+'</div>';
    }
  };
  if (s == '') {
    $('#nochamps').show();
  } else {
    $('#my-data').html(s);
  }
  $('.champ-item').click(function(event){
    event.preventDefault();
    editChamp($(this).data('id'));
  })
  $('.goal-item').click(function(event){
    event.preventDefault();
    editGoal($(this).data('id'));
  })
}

function myLoad() {
  var stored = localStorage.getItem('doc');
  if (stored === null) {
    myPull();
  } else {
    doc = JSON.parse(stored);
    if (!doc['champs']) {
      myPull();
    } else {
      if (!doc['goals']) {
        doc['goals'] = {};
      }
      // если старая база, где на цели ссылались по id, то обновляем её
      for (var i = Object.keys(doc.champs).length - 1; i >= 0; i--) {
        var champ = doc.champs[Object.keys(doc.champs)[i]];
        if (champ.goal == undefined || champ.goal == 'undefined') {
          champ.goal = '';
        } else if (champ.goal !== '' && champ.goal.length < '0000-00-00 00:00:00'.length) {
          for (var k = Object.keys(doc.goals).length - 1; k >= 0; k--) {
            var id = Object.keys(doc.goals)[k];
            var goal = doc.goals[id];
            if (goal.name == champ.goalname) {
              champ.goal = id;
              break;
            }
          }
        }
      }
      myRender();
      myPush();
    }
  }
}

$(function(){
  hashparams = document.location.href.split('#')[1];
  if (!hashparams) {
    myLoad();
  }

  var myscrolltop = -1;

  $('#my-pages a').on('show.bs.tab', function (e) {
    if ($(e.relatedTarget).attr('href') == '#my-index') {
      myscrolltop = $('body').scrollTop();
    }
  })
  $('#my-pages a').on('shown.bs.tab', function (e) {
    if ($(e.target).attr('href') == '#my-index') {
      $('body').scrollTop(myscrolltop);
    }
  })
})
