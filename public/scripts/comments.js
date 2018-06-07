// Get array of all comment buttons

var commentBtns = $('.commentBtn');

/*
loop through each button and prevent its default action (which
contains a method that reloads the page). 
Then use jquery to replicate change
on the front end.
*/

commentBtns.each(function(){
	$(this).click(event=>{
	// prevent default click action
		event.preventDefault();
		let content = $(this).parent().children("textarea").val()
		$.post('/comment',{
			postid:$(this).data('postid'),
			content: content
		}
		);



		return false
	})
})