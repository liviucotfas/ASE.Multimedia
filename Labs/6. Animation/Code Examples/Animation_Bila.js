
$(document).ready(function () {

    var bila = $("#bila");
    var stare = "pauza";
    var pozitieInBila = { top: 0, left: 0 };

    var pozitiiSalvate = [];
    var contorPozitii = 0;

    $(document).mousemove(function (e) {
        window.mouseXPos = e.pageX;
        window.mouseYPos = e.pageY;
    });

	$(document)[0].oncontextmenu = function() { return false; };

    function animatie() {
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

	bila.mousedown(function(e) {
		if (e.button == 0) {
			stare = "miscare";
			pozitieInBila = {
				"top": window.mouseYPos - this.offsetTop,
				"left": window.mouseXPos - this.offsetLeft
			};
		} else if (e.button == 2) {
			stare = "redare";
			contorPozitii = 0;
		}

		e.preventDefault();
	});
    

    bila.mouseup(function () {
        stare = "pauza";
    });

    setInterval(animatie, 15);
});