$(document).ready(function(){
    // the js code to flip the sign in to register
    $("#flipToSignUp").click(function(){
        $("#main").css("-webkit-animation-name","showSignUp");
        $("#main").css("transform","translate(-50%,-50%) rotateY(180deg)");

        $("#signUpForm").css("-webkit-animation-name","hideSignIn");
        $("#signUpForm").css("transform","translate(-50%,-50%) rotateY(0deg)");
    });


    $("#flipToSignIn").click(function(){
        $("#main").css("-webkit-animation-name","hideSignUp");
        $("#main").css("transform","translate(-50%,-50%) rotateY(0deg)");

        $("#signUpForm").css("-webkit-animation-name","showSignIn");
        $("#signUpForm").css("transform","translate(-50%,-50%) rotateY(180deg)");

//  ------  end of flip code-----

//----- resizing the screen not neccerly-----
    });
    $(window).resize(function(){
        // your code
        var windowWidth=$(window).width();
        var mainContainerWidth=windowWidth-100; // For example
        $("#yourMainContainer").css({"width":mainContainerWidth+"px"});
//  ------  end of resizing-----


    });
});
