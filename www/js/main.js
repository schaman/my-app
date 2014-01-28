function connect(url, data, success) {
  if (arguments.length == 2) { // if only two arguments were supplied
    if (Object.prototype.toString.call(data) == "[object Function]") {
      success = data;
      data = false;
    }
  }

  var requestdata = logindata();
  if (data) {
    requestdata.data = data;
  }

  $.ajax({
    type: 'POST',
//    url: 'http://localhost:8999/'+url,
    url: 'http://api.ichamp.io/'+url,
    crossDomain: true,
    dataType:'json',
    data: requestdata,
    success: function(data) {
      success(data);
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log(responseData);
      console.log(textStatus);
      console.log(errorThrown);
      debugger;
    }
  });
}
function logindata() {
  return {
    'vk_user_id':$.cookie('vk_user_id'),
    'vk_access_token':$.cookie('vk_access_token')
  }
}
function login() {
  $('a[href="#login"]').click();
}
$(function() {
  if (document.location.host == 'ichamp.io') {
    vk_app_id = '4090226';
  } else if (document.location.host == 'localhost:8080') {
    vk_app_id = '2383340';
  } else {
    // standalone
  }

  hashparams = document.location.href.split('#')[1];
  if (hashparams) {
    $('#loading').show();
    vk_token = {};
    params = hashparams.split('&');
    for (var i = params.length - 1; i >= 0; i--) {
      kv = params[i].split('=');
      vk_token[kv[0]] = kv[1];
    };

    if (vk_token['access_token']) {
      $.cookie('vk_user_id', vk_token['user_id'], { expires: 365 });
      $.cookie('vk_access_token', vk_token['access_token'], { expires: 365 });
    }

    document.location.href = document.location.href.split('/')[0];
  }

  if (!$.cookie('vk_user_id')) {
    login();
  }
  $('#login-vk').click(function(event){
    event.preventDefault();
    vk_app_permissions = 'notify,friends,photos,notifications,offline';
    var permissionUrl = 'https://oauth.vk.com/authorize?client_id='+vk_app_id+'&redirect_uri=' + window.location + '&scope=' + vk_app_permissions + '&display=mobile&response_type=token';
    window.location = permissionUrl;
  })
})
$(function(){
  $('#addresult-btn').click(function(event){
    event.preventDefault();
    addResult();
  })
  $('#addtask-btn').click(function(event){
    event.preventDefault();
    addTask();
  })
  $('#addgoal-btn').click(function(event){
    event.preventDefault();
    addGoal();
  })
})
