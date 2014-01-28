var editingchampid;
var editingchamp;
var champbuttonstyle;
function setAddingChamp(){
  editingchampid = '';
  editingchamp = {};
  $('#champ-header span').text('Добавить');  
  $('#delchamp-btn').hide();
  $('#champdone-btn').hide();
  $('#champ-done input').prop('checked', false).parent().removeClass('btn-success active').addClass('btn-default');
  $('#champ-done-input-today').prop('checked', true).parent().addClass('btn-success active').removeClass('btn-default');
  $('#champ-start input').prop('checked', false).parent().removeClass('btn-primary active').addClass('btn-default');
  $('#champ-start-input-today').prop('checked', true).parent().addClass('btn-primary active').removeClass('btn-default');
  $('#champ-done-input-earlier').parent().hide();
  $('#champ-input-text').val('');
}
function setEditingChamp(){
  $('#champ-header span').text('Редактировать');
  $('#delchamp-btn').show();
  $('#champdone-btn').show();
}
function setTaskStyle(){
  champbuttonstyle = 'btn-primary';
  $('#champ-header').html('<i class="glyphicon glyphicon-flash" style="color:#357ebd;"></i> <span>Редактировать</span> задачу');
  $('#champdone-btn').show().removeClass('btn-primary').addClass('btn-success').text('Я сделал это!');
  $('#champ-privacy label.active').removeClass('btn-success').addClass('btn-primary');
  $('#champ-input-text').attr('placeholder', 'Вот что я сделаю...');
  $('#champ-input-submit').val('Я сделаю это!').removeClass('btn-success').addClass('btn-primary');
  $('#champ-start').show();
  $('#champ-start-input-missed').parent().hide();
  $('#champ-done').hide();
}
function setResultStyle(){
  champbuttonstyle = 'btn-success';
  $('#champ-header').html('<i class="glyphicon glyphicon-ok" style="color:#449d44;"></i> <span>Редактировать</span> результат');
  $('#champdone-btn').show().removeClass('btn-success').addClass('btn-primary').text('Ещё не сделал');
  $('#champ-privacy label.active').removeClass('btn-primary').addClass('btn-success');
  $('#champ-input-text').attr('placeholder', 'Вот как я отжёг...');
  $('#champ-input-submit').val('Я молодец!').removeClass('btn-primary').addClass('btn-success');
  $('#champ-start').hide();
  $('#champ-done').show();
  $('#champ-done-input-earlier').parent().hide();
}
function getChampPrivacy() {
  return $('#champ-privacy .active input').attr('value');
}
function activateRadioButton(radio, active, style){
  $(radio+' input').prop('checked', false).parent().removeClass(style+' active').addClass('btn-default');
  $(active).prop('checked', true).parent().addClass(style+' active').removeClass('btn-default');
}
function radioButtons(id) {
  $(id+' label').click(function(){
    $(id+' label').removeClass(champbuttonstyle).removeClass('active').addClass('btn-default');
    $(this).addClass(champbuttonstyle).addClass('active').removeClass('btn-default');
  });
}
function setChampPrivacy(privacy) {
  if (!privacy) privacy = 'friends';
  activateRadioButton('#champ-privacy', '#champ-input-privacy-'+privacy, champbuttonstyle);
}
function addResult() {
  constructChampForm();
  setResultStyle();
  setAddingChamp();
  setChampPrivacy('friends');
  myGo('champ');
}
function addTask() {
  constructChampForm();
  setTaskStyle();
  setAddingChamp();
  setChampPrivacy('friends');
  myGo('champ');
}
function doEditChamp() {
  var id = editingchampid;
  var champ = editingchamp;
  setEditingChamp();

  // видимость и цвета элементов
  if (champ.done == '') {
    setTaskStyle();
  } else {
    setResultStyle();
  }

  // константы
  today = moment().format('YYYY-MM-DD');
  tomorrow = moment().add('days', 1).format('YYYY-MM-DD');
  yesterday = moment().subtract('days', 1).format('YYYY-MM-DD');

  // поля start и done
  if (champ.done == '') {
    if (champ.start == '') {
      start = 'later';
    } else {
      start = moment(champ.start, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
      if (start == today) {
        start = 'today';
      } else if (start == tomorrow) {
        start = 'tomorrow';
      } else {
        start = 'missed';
        $('#champ-start-input-missed').parent().find('span').text(moment(champ.start, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY'));
        $('#champ-start-input-missed').parent().show();
      }
    }
    activateRadioButton('#champ-start', '#champ-start-input-'+start, champbuttonstyle);
  } else {
    done = moment(champ.done, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    if (done == today) {
      done = 'today';
    } else if (done == yesterday) {
      done = 'yesterday';
    } else {
      done = 'earlier';
      $('#champ-done-input-earlier').parent().find('span').text(moment(champ.done, 'YYYY-MM-DD HH:mm:ss').format('DD.MM.YYYY'));
      $('#champ-done-input-earlier').parent().show();
    }
    activateRadioButton('#champ-done', '#champ-done-input-'+done, champbuttonstyle);
  }

  $('#champ-input-text').val($("<div/>").html(champ.text).text());

  var teamgoal;
  if (champ.team > 0 && champ.goal !== '') {
    teamgoal = 'team.' + champ.team + '.goal.' + champ.goal;
  } else if (champ.team > 0) {
    teamgoal = 'team.' + champ.team;
  } else if (champ.goal !== '') {
    teamgoal = 'goal.' + champ.goal;
  } else {
    teamgoal = '';    
  }

  $('#champ-input-teamgoal').val(teamgoal);
  $('#champ-input-teamgoal').change();
  setChampPrivacy(champ.privacy);
  myGo('champ');
}
function constructChampForm() {
  $('#champ-input-teamgoal option[value^="goal."]').remove();
  for (var i = Object.keys(doc.goals).length - 1; i >= 0; i--) {
    var id = Object.keys(doc.goals)[i];
    var goal = doc.goals[id];
    var s = ''
    if (goal.done == '') {
      s += '<option value="goal.'+id+'"># '+goal.name+'</option>';
    }
    $('#champ-input-teamgoal').append(s);
  };
}
function editChamp(id) {
  constructChampForm();
  editingchampid = id;
  editingchamp = jQuery.extend({}, doc.champs[id]);
  doEditChamp();
  myGo('champ');
}
function persistChampForm() {
  var champ = editingchamp;
  champ.text = $('#champ-input-text').val();

  champ.team = '';
  champ.goal = '';
  teamgoal = $('#champ-input-teamgoal').val().split('.');
  if (teamgoal.length == 4) {
    champ.team = teamgoal[1];
    champ.goal = teamgoal[2];
  } else if (teamgoal.length == 2) {
    if (teamgoal[0] == 'team') {
      champ.team = teamgoal[1];
    } else if (teamgoal[0] == 'goal') {
      champ.goal = teamgoal[1];
    }
  }

  if ($('#champ-start').is(":visible")) {
    if ($('#champ-start-input-today').parent().hasClass('active')) {
      champ.start = moment().format('YYYY-MM-DD');
    } else if ($('#champ-start-input-tomorrow').parent().hasClass('active')) {
      champ.start = moment().add('days', 1).format('YYYY-MM-DD');
    } else if (!$('#champ-start-input-missed').parent().hasClass('active')) {
      champ.start = '';
    }
  } else {
    champ.start = '';
  }
  if ($('#champ-done').is(":visible")) {
    if ($('#champ-done-input-today').parent().hasClass('active')) {
      champ.done = moment().format('YYYY-MM-DD HH:mm:ss');
    } else if ($('#champ-done-input-yesterday').parent().hasClass('active')) {
      champ.done = moment().subtract('days', 1).format('YYYY-MM-DD');
    }
  } else {
    champ.done = '';
  }
  champ.privacy = getChampPrivacy();
}
$(function(){
  $('#champ-input-teamgoal').change(function(){
    if ($(this).val() == '') {
      $('#champ-privacy').show();
    } else {
      $('#champ-privacy').hide();
    }
  });
  radioButtons('#champ-privacy', champbuttonstyle);
  radioButtons('#champ-done', champbuttonstyle);
  radioButtons('#champ-start', champbuttonstyle);
  $('#champ-form').submit(function(event){
    event.preventDefault();
    if (editingchampid == '') {
      editingchampid = moment().format('YYYY-MM-DD HH:mm:ss');
      editingchamp = {};
    }
    persistChampForm();
    doc.champs[editingchampid] = editingchamp;
    myChampCommit(editingchampid);
  })
  $('#delchamp-btn').click(function(event){
    event.preventDefault();
    delete doc.champs[editingchampid];
    myChampCommit(editingchampid);
  })
  $('#champdone-btn').click(function(event){
    event.preventDefault();
    persistChampForm();
    if (editingchamp.done == '') {
      editingchamp.done = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      editingchamp.done = '';
    }
    $('#champ-form').hide().fadeIn();
    doEditChamp();
  })
  $('#cancelchamp-btn').click(function(event){
    event.preventDefault();
    myGo('index');
  })
})
