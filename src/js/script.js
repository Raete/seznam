let finished = false;
// animate counter on scroll
$(window).scroll( () => {

    let oTop = $('.speed_box').offset().top - window.innerHeight;
   
    if ( !finished && $(window).scrollTop() > oTop) {
       
        $('.speed_counter').each( function()  {
            let $this = $(this),
                countTo = $this.attr('data-count');

            $({ countNum: 0 })
            .animate(
                {
                    countNum: countTo
                },

                {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.floor(this.countNum));
                    },

                    complete: function() {
                        $this.text(this.countNum);          
                    }
                }
            );
        });
        finished = true;
    }

});