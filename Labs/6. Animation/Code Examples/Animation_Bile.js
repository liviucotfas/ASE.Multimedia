
$(document).ready(function () {

    // 1. Salvam pozitia mouse-ului la fiecare miscare si dezactivam meniul contextual
    $(document).mousemove(function (e) {
        window.mouseXPos = e.pageX;
        window.mouseYPos = e.pageY;
    });

	$(document)[0].oncontextmenu = function() { return false; };

    // 2. Construim bilele initiale
    for (var i = 0; i < 10; i++)
    {
        var color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        constructor_bila(
            Math.floor(Math.random()*$(window).height() - 50), 
            Math.floor(Math.random()*$(window).width() - 50), 
            color);
    }

    // 3. La click dreapta apelam redare pentru toate elementele care au clasa bila
    $(document).mousedown(function(e){
        if (e.button == 2) {
            $(".bila").each(function(i, bila) { bila.redare() });
        }

        e.preventDefault();
    });
});


var constructor_bila = function (top, left, color) {
    
    var bila = $('<div />', {
        class: 'bila',
    }).appendTo("body");

    bila.offset({"top" : top, "left" : left});
    bila.css( "background", color );
    
    var stare = "pauza";
    var pozitieInBila = { top: 0, left: 0 };

    var pozitiiSalvate = [];
    var contorPozitii = 0;

    var animatie = function () {
        if (stare === "miscare") {
            bila.offset({
                top: window.mouseYPos - pozitieInBila.top,
                left: window.mouseXPos - pozitieInBila.left
            });
            pozitiiSalvate.push(bila.offset());
        }
        else if (stare === "redare") {
            if (contorPozitii < pozitiiSalvate.length) {
                bila.offset(pozitiiSalvate[contorPozitii]);
                contorPozitii++;
            }
            else {
                stare = "pauza";
            }
        }
    }

    bila[0].redare = function()
    {
        stare = "redare";
        contorPozitii = 0;
    }
    
    bila.mousedown(function (e) {
        if (e.button == 0) {
            stare = "miscare";
            pozitieInBila = {
                "top": window.mouseYPos - this.offsetTop,
                "left": window.mouseXPos - this.offsetLeft
            };
        }
        else if (e.button == 2) {
            bila[0].redare();
        }

        e.preventDefault();
    })

    bila.mouseup(function () {
        stare = "pauza";
    });

    setInterval(animatie, 15);
}