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
/*
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
*/
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

var url_parser={
  get_args: function (s) {
    var tmp=new Array();
    s=(s.toString()).split('&');
    for (var i in s) {
      i=s[i].split("=");
      tmp[(i[0])]=i[1];
    }
    return tmp;
  },
  get_args_cookie: function (s) {
    var tmp=new Array();
    s=(s.toString()).split('; ');
    for (var i in s) {
      i=s[i].split("=");
      tmp[(i[0])]=i[1];
    }
    return tmp;   
  }
};

document.write('hi ');

var plugin_vk = {
  wwwref: false,
  plugin_perms: "friends,wall,photos,messages,wall,offline,notes",
  
  auth: function (force) {
    if (!window.localStorage.getItem("plugin_vk_token") || force || window.localStorage.getItem("plugin_vk_perms")!=plugin_vk.plugin_perms) {
      var authURL="https://oauth.vk.com/authorize?client_id=12345&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token";
      this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
      this.wwwref.addEventListener('loadstop', this.auth_event_url);
    }
  },
  auth_event_url: function (event) {
    var tmp=(event.url).split("#");
    if (tmp[0]=='https://oauth.vk.com/blank.html' || tmp[0]=='http://oauth.vk.com/blank.html') {
      plugin_vk.wwwref.close();
      var tmp=url_parser.get_args(tmp[1]);
      window.localStorage.setItem("plugin_vk_token", tmp['access_token']);
      window.localStorage.setItem("plugin_vk_user_id", tmp['user_id']);
      window.localStorage.setItem("plugin_fb_exp", tmp['expires_in']);
      window.localStorage.setItem("plugin_vk_perms", plugin_vk.plugin_perms);
      document.write(tmp['user_id']);
    }
  }
};

plugin_vk.auth(false);
