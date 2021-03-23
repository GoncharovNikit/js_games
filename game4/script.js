let count_Opened = 0;
let data = "";
let arrP = document.querySelectorAll(".pazz");
let arr_Found = [];
let self;

function setDefault() {
    console.log("Default setting!");
    arrP.forEach(function (pazz) {
        let is = true;

        arr_Found.forEach(function (data) {
            if ($(pazz.firstChild).attr('data-type') == data) is = false;
        });

        if (is) { $(pazz.firstChild).fadeOut(200); }
    });
    count_Opened = 0;
}

function check_in_found(pazz) {
    let is_in = false;

    arr_Found.forEach(function (data) {
        if ($(pazz.firstChild).attr("data-type") == data) is_in = true;
    });

    return is_in;
}

$(function () {
    
    $(".pazz").on('click', function () {
        if (count_Opened == 0) self = this;
        else if (check_in_found(this) || self == this) return;

        if (this.firstChild.hidden && count_Opened < 2) {
            count_Opened++;
            $(this.firstChild).fadeIn(100);    
            if(data === "")data = $(this.firstChild).attr("data-type");
            console.log('Data ' + data);
        }
        if (count_Opened == 2) {
            if (data == $(this.firstChild).attr("data-type")) {
                console.log("Successsss!");

                arr_Found.push(data);

                arrP.forEach(function (elem) {

                    if ($(elem.firstChild).attr("data-type") == data) {
                        $(elem).fadeTo(200, 0.4);
                    }
                });

                data = "";
                count_Opened = 0;
            }
            else {
                data = "";
                setTimeout(setDefault, 1000);
            }

        }

        console.log("count opened: " + count_Opened);

        if (arr_Found.length == 5) {

            document.querySelector("#win").hidden = false;

        }

    });




    
});












