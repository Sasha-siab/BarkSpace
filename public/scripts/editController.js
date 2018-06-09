$('document').ready(function(){

  if ($('#profileBtn')) {
    let user = $('#profileBtn').text();
    $('.post').each(function(){
      let postUser = $(this).children('.postHead').children('.info').children('.username').text();
      if (user !== postUser) {
        $(this).children('.postHead').children('form').remove();
      }
    })
  }

})
