function getGoalPrivacy() {
  return $('#goal-privacy .active input').attr('value');
}
function setGoalPrivacy(privacy) {
  $('#goal-privacy input').prop('checked', false).parent().removeClass('btn-violet active').addClass('btn-default');
  $('#goal-input-privacy-'+privacy).prop('checked', true).parent().addClass('btn-violet active').removeClass('btn-default');
}
function addGoal() {
  $('#goal-input-id').val('');
  $('#goal-input-name').val('');
  $('#goal-input-text').val('');
  $('#goal-input-team').val('');
  $('#delgoal-btn').hide();
  $('#goaldone-btn').hide();
  setGoalPrivacy('friends');
  myGo('goal');
}
function editGoal(id) {
  $('#delgoal-btn').show();
  $('#goaldone-btn').hide();

  goal = doc.goals[id];

  $('#goal-input-id').val(id);
  $('#goal-input-name').val(goal.name);
  $('#goal-input-text').val(goal.text);
  $('#goal-input-team').val(goal.team);
  setGoalPrivacy(goal.privacy);
  myGo('goal');
}
$(function(){
  $('#goal-input-team').change(function(){
    if ($(this).val() == '') {
      $('#goal-privacy').show();
    } else {
      $('#goal-privacy').hide();
    }
  });
  $('#goal-privacy label').click(function(){
    $('#goal-privacy label').removeClass('btn-violet active').addClass('btn-default');
    $(this).addClass('btn-violet active').removeClass('btn-default');
  });

  $('#goal-form').submit(function(event){
    event.preventDefault();
    id = $('#goal-input-id').val();
    if (id == '') {
      id = moment().format('YYYY-MM-DD HH:mm:ss');
      goal = {'done': ''};
      doc.goals[id] = goal;
    }
    goal = doc.goals[id];
    goal.name = $('#goal-input-name').val();
    goal.text = $('#goal-input-text').val();
    goal.privacy = getGoalPrivacy();
    myGoalCommit(id);
  })
  $('#delgoal-btn').click(function(event){
    event.preventDefault();
    id = $('#goal-input-id').val();
    delete doc.goals[id];
    myGoalCommit(id);
  })
  $('#goaldone-btn').click(function(event){
    event.preventDefault();
    id = $('#goal-input-id').val();
    goal = doc.goals[id];
    if (goal.done == '') {
      goal.done = moment().format('YYYY-MM-DD HH:mm:ss');
    } else {
      goal.done = '';
    }
    myGoalCommit(id);
  })
  $('#cancelgoal-btn').click(function(event){
    event.preventDefault();
    myGo('index');
  })
})
