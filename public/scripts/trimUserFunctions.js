$('document').ready(function(){

  if ( $('#profileBtn').length ) {
    let user = $('#profileBtn').text();
    $('.post').each(function(){
      let postUser = $(this).children('.postHead').children('.info').children('.username').text();

      if (user !== postUser) {
        $(this).children('.postHead').children('form').remove();
      }

    })
  } else {
    console.log('not logged in');
    $('.post').each(function(){

      var footerButtons = $(this).children('.postFooter').children('.userDisable').hide();

      var numberLikes = $(this).children('.postFooter').children('.userDisable').children('div').data('likes');

      if (numberLikes) {
        $(this).children('.postFooter').prepend(`<h6 class="numberLikes">${numberLikes}</h6>`);
      }

      $(this).children('.postFooter').children('.userDisable').children('div');

    });
    // hide text area and submit button

    // hide disable like click event

    // hide like button

    // enable reroute if user is not logged

    // disable /enable event.prevention


  }

});
