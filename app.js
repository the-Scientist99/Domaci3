$(document).ready(function () {
    $("#sel_result").hide();
    $("#src_gallery").hide();
});

const searchOMDB = () => {
    $("#error_msg").hide();
    $("#sel_result").hide();
    $("#src_gallery").hide();

    let inp_naziv = $("#src_name").val();
    let inp_tip = $("#type_of_src").val();
    let inp_godina = $("#rel_date").val();
    var url_t = "";

    // Validacija da li je korisnik unio naziv filma/serije u input polje
    if(inp_naziv.length === 0) {
        $("#src_name").addClass("is-invalid");
        $("#src_result").hide();
        return;
    }
    else {
        $("#src_name").removeClass("is-invalid");
    }

    // Ako je korisnik unio godinu i nju ukljuciti u pretragu, ako nije iskljuciti je iz pretrage
    if(inp_godina.length !== 0) {
        url_t = `http://www.omdbapi.com/?apikey=314d1133&s=${inp_naziv}&type=${inp_tip}&y=${inp_godina}`;
    }
    else {
        url_t = `http://www.omdbapi.com/?apikey=314d1133&s=${inp_naziv}&type=${inp_tip}`;
    }

    $.ajax({
        type: "GET",
        url: url_t,
        success: (response) => {
            // Ako dati film/serija ne postoje obavijestiti korisnika
            if(response.Response === "False") {
                $("#error_msg").html(response.Error);
                $("#error_msg").show();
                return;
            }

            let rezultatiPretrage = response.Search;
            let naslovi = [];
            let slike = [];
            let id = []

            let div_slike = document.querySelectorAll(".src_img");
            let div_naslovi = document.querySelectorAll(".src_title");
            let div_id = document.querySelectorAll(".src_id");
            
            // Smjestamo naslove, slike, id-eve u nizove radi lakse manipulacije
            rezultatiPretrage.forEach(rezultat => {
                naslovi.push(rezultat.Title);
                slike.push(rezultat.Poster);
                id.push(rezultat.imdbID);
            });
            
            // Prolazimo kroz rezultat pretrage i postavljamo poster, naziv i id za svaki film/seriju zasebno
            for(let i = 0; i < div_slike.length; i++) {
                if(i >= naslovi.length) {
                    div_id[i].style.visibility = "hidden";
                }
                else {
                    // Ako film/serija ne posjeduje poster onda stavljamo fotografiju "Image not Available"
                    if(slike[i] === "N/A") {
                        div_slike[i].setAttribute("src", "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-illustration-no-image-available-icon-photo-camera-icon-flat-vector-illustration-132483392.jpg");
                    } 
                    else {
                        div_slike[i].setAttribute("src", slike[i]);                    
                    }
                    div_naslovi[i].innerHTML = naslovi[i];
                    div_id[i].setAttribute("id", id[i]);
                    div_id[i].style.visibility = "visible";
                }
            }
            $("#src_gallery").show();
        }
    });
}

const showSelected = (id) => {
    $("#src_gallery").hide();
    $("#tr_seasons").hide();
    $.ajax({
        type: "GET",
        url: `http://www.omdbapi.com/?apikey=314d1133&i=${id}`,
        success: (response) => {
            // Ako ne postoji trazeni film/serija korisnika obavjestavamo o tome
            if (response.Response === "False"){
                $("#sel_result").hide();
                $("#error_msg").html(response.Error);
                $("#error_msg").show();
                return;
            }

            // Dodajemo podatke o filmu/seriji u celije tabele
            $("#error_msg").hide();
            $("#sel_img").attr("src", response.Poster);
            $("#sel_title").html(response.Title);
            $("#sel_year").html(response.Year);
            $("#sel_rel_date").html(response.Released);
            $("#sel_len").html(response.Runtime);
            $("#sel_director").html(response.Director);
            $("#sel_actors").html(response.Actors);
            $("#sel_plot").html(response.Plot);
            
            // Pitamo da li je tip pretrage serija, ako jeste dodajemo Broj Sezona
            if(response.Type === "series") {
                $("#sel_num_seasons").html(response.totalSeasons);
                $("#tr_seasons").show();
            }
            
            // Prolazimo kroz niz ocjena i dodajemo ih u listu, jednu po jednu
            response.Ratings.forEach(ocjena => {
                $("#sel_grade").append(`
                <li>${ocjena.Source} : <span class="ml-4">${ocjena.Value}</span></li>
                `);
            });
            $("#sel_result").show();
        }
    });
}

// Funkcija za "BACK" dugme, vraca nas na tabelu ponudjenih filmova/serija
const goBack = () => {
    $("#sel_result").hide();
    $("#src_gallery").show();
}