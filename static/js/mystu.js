$(function() {
  var o = $;
  var header = o('#mystu-header');
  var helper = o('#mystu-helper');
  
  var monthsString = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  header.delegate('[data-type]', 'click', clickHandler);
  fillHeaderData();

  helper.delegate('[data-type]', 'click', clickHandler);

  function clickHandler (evt) {
    var type = o(evt.currentTarget).data('type')
    switch (type) {
      case 'topmenu':
        topmenu(evt.currentTarget);
        break;
      case 'help':
        addHelper();
        break;
    }
  }



  // START OF HEADER FUNCTIONS *************************************************
  function fillHeaderData () {
    // Calendar
    var calendar = header.find('.quicklink .calendar');
    header.find('.mo').text(monthsString[new Date().getMonth()].slice(0, 3));
    header.find('.day').text(new Date().getDate());
    // User Data
    getData('https://my.stu.edu.cn/v2/services/api/user/validate', fillUserData);
    // Notification
    getData('https://my.stu.edu.cn/v2/services/api/notification/unread', fillNotificationData);
  }

  function fillUserData(data) {
    header.find('span.avatar.cur').css('background-image', 'url(' + data.logoUrl + ')');
    header.find('span.avatar.cur + .menu-user .name').text(data.fullName);
  }

  function fillNotificationData(data) {
    var notificationUnread = {
      all: 0,
      notification: 0,
      school: 0,
      department: 0
    };
    for (var k in data) {
      if (k === '1') {
        notificationUnread.school += data[k].urNum;
        notificationUnread.all += data[k].urNum;
      } else if (k === '2') {
        notificationUnread.department += data[k].urNum;
        notificationUnread.all += data[k].urNum;
      } else {
        notificationUnread.notification += data[k].urNum;
        notificationUnread.all += data[k].urNum;
      }
    }
    if (notificationUnread.all) {
      header.find('.notifi.menu .unread').text(notificationUnread.all);
      for (var item in notificationUnread) {
        var query = '.notifi.menu [data-title="' + item + '"] span';
        header.find(query).text(notificationUnread[item]);
      }
      header.find('.notifi.menu a i').css('color', '#fba026');
    } else {
      header.find('.notifi.menu .unread').text('0');
      header.find('.notifi.menu ul.menu-notifi').remove();
    }
  }

  function getData(url, callback) {
    var request = new XMLHttpRequest();
    request.onload = function(evt) {
      var res = null;
      try {
        res = JSON.parse(request.responseText);
      } catch(e) {
        console.log(e);
      }
      if (~~(request.status/100) === 2) {
        callback(res);
      } else if (request.status === 401) {
        location.href = 'https://sso.stu.edu.cn/login?service=' +
            encodeURIComponent(location.href);
      } else {
        console.error(request.status, res);
      }
    };
    request.open('GET', url, true);
    request.withCredentials = true;
    request.send(null);
  }

  function topmenu(menuContainer) {
    var menu = o(menuContainer).children('[class|="menu"]');
    if (menu.length === 0) {
      menu = o(menuContainer).nextAll('[class|="menu"]');
    }
    if (!menu.hasClass('HIDE'))
      return false;
    menu.removeClass('HIDE');
    function blurHandler(evt) {
      var target = evt.target;
      for (var node = target; node; node = node.parentNode)
        if (menu[0] === node || menuContainer === node) return;
      document.removeEventListener('mousedown', blurHandler);
      menu.addClass('HIDE');
    }
    document.addEventListener('mousedown', blurHandler, false);
  }
  // END OF HEADER FUNCTIONS ***************************************************



  // START OF HELPER FUNCTIONS *************************************************
  function addHelper () {
    o('body').addClass('HELP');
    var frame = helper.find('.frame')[0];
    var button = helper.find('.help-button')[0];
    function blurHandler(evt) {
      var target = evt.target;
      for (var node = target; node; node = node.parentNode)
        if (frame === node || button === node) return;
      document.removeEventListener('mousedown', blurHandler);
      o('body').removeClass('HELP');
    }
    document.addEventListener('mousedown', blurHandler, false);
  }
  // END OF HELPER FUNCTIONS ***************************************************
});
