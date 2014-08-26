$(function() {
  var o = $;
  var header = o('#mystu-header');
  var helper = o('#mystu-helper');
  
  var monthsString = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  header.delegate('[data-type]', 'click', clickHandler);
  fillHeaderData();

  helper.delegate('[data-type', 'click', clickHandler);

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
    //var userData = getData('https://uat.stu.edu.cn/v2/services/api/user/validate');
    //header.find('span.avatar.cur').css('background-image', 'url(' + userData.logoUrl + ')');
    //header.find('span.avatar.cur + .menu-user .name').text(userData.fullName);
    // Notification
    //var notificationData = getData('https://uat.stu.edu.cn/v2/services/api/notification/unread');
    //header.find('.notifi.menu .unread').text(notificationData['1'].length);
  }

  function getData(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    if (request.status !== 200) {
      console.error('Error fetching data');
      return false;
    } else {
      return JSON.parse(request.response);
    }
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