
// Get array of all buttons
var likeBtns = $('.likeBtn');

/*
loop through each button, prevent its default action (which
contains a method that reloads the page), and check if the
post has been liked. If not, send a jquery post with an obj
containing the post id, increment the like datapoint, else
decriment like datapoint. Then use jquery to replicate change
on the front end.
*/

if ( $('#profileBtn').length ) {
console.log('logged in');

likeBtns.each(function(){
  $(this).click(event=>{
    // prevent default click action
    event.preventDefault();
    // if the button has class clicked, fire unclick, if not fire click
    if (!$(this).hasClass('clicked')){
      // jquery post shortcut for ajax
      $.post('/like',{postid:$(this).data('postid')});
      $(this).addClass('clicked');

      // Change number on front end, ++
      // regexp gets number in string, parses int and returns
      let count = $(this).text().match(/(\d)+/)[0];
      count = parseInt(count)+1;
      newCount = count + ' likes'
      $(this).text(newCount);

    } else {
      $.post('/unlike',{postid:$(this).data('postid')});
      $(this).removeClass('clicked');

      // Change number on front end, --
      // same as before
      let count = $(this).text().match(/(\d)+/)[0];
      count = parseInt(count)-1;
      newCount = count + ' likes'
      $(this).text(newCount);

    }

    // return false specifically prevets page reload
    return false;
  })
});

} else {
  // hide text area and submit button

  // hide disable like click event

  // hide like button

  // enable reroute if user is not logged

  // disable /enable event.prevention
}
