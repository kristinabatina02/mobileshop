var meni = [];
var sviProizvodi = [];
var brend = [];
var memorija = [];
var url = document.location.pathname;

function ajaxCallBack(imeFajla, ispis){
 $.ajax({
     url:"assets/json/" + imeFajla,
     method: "get",
     dataType: "json",
     success: ispis,
     error: function(jqXHR, exception){
      var por = '';
      if (jqXHR.status === 0) {
      por = 'Nije konektovan.\n Proverite konekciju.';
      } else if (jqXHR.status == 404) {
      por = 'Tražena stranica nije dostupna.';
      } else if (jqXHR.status == 500) {
      por = 'Interna greška servera.';
      } else if (exception === 'parsererror') {
      por = 'Zahtevan JSON nije pronađen.';
      } else if (exception === 'timeout') {
      por = 'Greška pri isteku vremena.';
      } else if (exception === 'abort') {
      por = 'Ajax zahtev je prekinut.';
      } else {
      por = 'Neuhvaćena greška.\n' + jqXHR.responseText;
      }
      
  }
 })
}
function dohvatiSveProizvode(sviProizvodi) {
  sviProizvodi.forEach(el => {
   sviProizvodi.push(el);
 });

 postaviULS("sviProizvodi", sviProizvodi);
}

//funkcije za ls 

function postaviULS(name, sviProizvodi) {
 localStorage.setItem(name, JSON.stringify(sviProizvodi));
}

function dohvatiIzLS(name) {
 return JSON.parse(localStorage.getItem(name));
}

function ukloniIzLS(name) {
 return localStorage.removeItem(name);
}
function imaUKorpi() {
  return dohvatiIzLS("proizvodi");
 }

function prikaziNavigaciju(sviProizvodi) {
 let html = "";
 sviProizvodi.forEach(el => {
   html += `<li class="nav-item">
     <a class="nav-link" href="${el.href}">${el.naziv}</a>
   </li>`;
   meni.push(el);
 });
 $("#meni").html(html);
}

function validacija(reg, el, greska, poruka) {
 if (!$(el).val().match(reg)) {
   $(el).addClass("gre");
   $(greska).html(poruka);
   return false;
 }
 else {
   $(el).removeClass("gre");
   $(el).addClass("uspesno");
   $(greska).html("");
   return true;
 }
}

var regIme = /^[A-ZČĆŠĐŽ][a-zčćšđž]{2,14}(\s[A-ZČĆŠĐŽ][a-zčćšđž]{2,14})*$/;
var regEmail = /^[\w\.\-]+\@([a-z0-9]+\.)+[a-z]{2,3}$/;
var regNaslov = /^([1-zćčžđšA-ZČĆŠĐŽ0-1@.\s]{2,5})$/;
var regAdresa = /^([A-ZČĆŠĐŽ]|[1-9]{1,5})[A-ZČĆŠĐŽa-zčćšđž\d\-\.\s]+$/;
var regPoruka = /^([1-zćčžđšA-ZČĆŠĐŽ0-1@.\s]{19,100})$/;
var regKreditnaKartica = /^[0-9]{16}$/;
var porukaIme = "Neispravno ime. Primer: Pera";
var porukaEmail = "Neispravan email. Primer: pera.peric@gmail.com";
var porukaNaslov = "Naslov mora sadržati bar 5 karaktera";
var porukaPoruka = "Poruka može sadržati bar 20 karaktera";
var porukaAdresa = "Please eneter your address";
var porukaKreditnaKartica = "Credit card contains 16 digits";

window.onload = function(){
 ajaxCallBack("navigation.json", prikaziNavigaciju);
 ajaxCallBack("products.json", dohvatiSveProizvode);
 
//  if (url == "/" || url == "/index.html" || url == "/korpa.html" || url == "/contact.html" || url == "/autor.html"){
//   ajaxCallBack("navigation.json", prikaziNavigaciju);
//  }
 
 if (url == "/" || url == "/index.html") {
  ajaxCallBack("products.json", prikaziTopProizvode);
  function prikaziTopProizvode(sviProizvodi) {
   let html = "";
   let sortirano = [];
   sortirano = sviProizvodi.sort(function(a,b){
    return b.stars - a.stars
   })
   let top = sortirano.slice(0,4)
   for(let el of top){
       html += `<div class="card d-flex align-items-center col-md-3">
         <img class="card-img-top" src="assets/img/${el.image.src}" alt="${el.image.alt}">
         <div class="card-body">
             <h6 class="card-title fw-bold">
               ${el.name}
             </h6>
           <p class="card-text text-center">${ispisiCenu(el.price)}</p>
         </div>
         <a href="shop.html"><button type="button" class="btn btn-primary btn-sm mb-3">Idi na shop</button></a>
       </div>`;
      
    }
   $("#topProizvodi").html(html);
 }
 }


 if (url == "/shop.html") {
  ajaxCallBack("products.json", prikaziProizvode);
  ajaxCallBack("memory.json", prikaziMemorije);
  ajaxCallBack("brend.json", prikaziBrendove);
  

  $("#sort").change(filterChange);
  $("#search").keyup(filterChange);

  function filterChange() {
    ajaxCallBack("products.json", prikaziProizvode);
  }

    function prikaziBrendove(sviProizvodi) {
      let html = "";
      sviProizvodi.forEach(el => {
        html += `<li class="list-group-item">
                      <input type="checkbox" value="${el.id}" class="brend" name="brend"/> ${el.name}
                    </li>`;
        brend.push(el);
      });
      $("#brendovi").html(html);
      $('.brend').change(filterChange);
    }

    function prikaziMemorije(sviProizvodi) {
      let html = "";
      sviProizvodi.forEach(el => {
        html += `<li class="list-group-item">
                      <input type="checkbox" value="${el.id}" class="memorija" name="memorija"/> ${el.name}
                    </li>`;
        memorija.push(el);
      });
      $("#memorije").html(html);
      $('.memorija').change(filterChange);
    }
    
   }
  }

  function prikaziProizvode(sviProizvodi) {
   sviProizvodi = filterByBrend(sviProizvodi);
   sviProizvodi = filterByRamMemory(sviProizvodi);
   sviProizvodi = sortiranje(sviProizvodi);
   sviProizvodi = search(sviProizvodi);
   let html = "";
   if (sviProizvodi.length == 0) {
     html += `<p class="alert alert-danger">Nažalost nema proizvoda</p>`;
   }
   else {
    sviProizvodi.forEach(el => {
       html += `<div class="col-lg-4 col-md-6 mb-5">
           <div class="card shadow-lg">
             <a href="#"><img class="card-img-top" src="assets/img/${el.image.src}" alt="${el.image.alt}"></a>
             <div class="card-body d-flex align-items-center flex-column">
               <h6 class="card-title fw-bold">
               ${el.name}
               </h6>
               <h5 class="card-text">${ispisiCenu(el.price)}</h5>
               <p class="card-text">${ispisiZvezdice(el.stars)}</p>
               <button type="button" class="btn btn-primary dugmeKorpa" data-id="${el.id}" data-bs-toggle="modal" data-bs-target="#cartModal">Dodaj u korpu</button>
             </div>
           </div>
         </div>`;
     });
   }
   $("#proizvodi").html(html);
   $(".dugmeKorpa").on("click", dodajUKorpu);
 }

 function ispisiCenu(obj){
  let html = "";

    if(obj.old != null){
        html += `<del>${obj.old}&euro;</del>`;
    }

    html += `<strong> &nbsp;${obj.new}&euro;</strong>`;

    return html;
 }

function ispisiZvezdice(sviProizvodi) {
  let html = "";
  for(let i = 1 ; i <= 5; i++){
    if(i <= sviProizvodi){
        html +=`<span class="fa-solid fa-star"></span>`
    }
    else if(i > sviProizvodi && parseInt(sviProizvodi) == i - 1 && sviProizvodi % (i - 1)!=0){
        html+=`<span class="fa-regular fa-star-half-stroke"></span>`
    }
    else{
        html+=`<span class="fa-regular fa-star"></span>`
    }     
  }
  return html;
}
function filterByBrend(sviProizvodi){
  let selektovanBrend = [];
  $('.brend:checked').each(function(el){
    selektovanBrend.push(parseInt($(this).val()));
  });
  if(selektovanBrend.length != 0){
    return sviProizvodi.filter(x => selektovanBrend.includes(x.brend));	
  }
  return sviProizvodi;
}

function filterByRamMemory(sviProizvodi){
  let selektovaneMemorije = [];
      $('.memorija:checked').each(function (el) {
        selektovaneMemorije.push(parseInt($(this).val()));
      });
      if (selektovaneMemorije.length != 0) {
        return sviProizvodi.filter(x => selektovaneMemorije.includes(x.memorija));	
      }
      return sviProizvodi;
}

function sortiranje(sviProizvodi) {
  let tipSortiranja = $("#sort").val();
  if (tipSortiranja == 'nazivRastuce') {
    return sviProizvodi.sort((a, b) => a.name > b.name ? 1 : -1);
  }
  else if (tipSortiranja == 'nazivOpadajuce') {
    return sviProizvodi.sort((a, b) => a.name < b.name ? 1 : -1);
  }
  else if (tipSortiranja == 'cenaRastuce') {
    return sviProizvodi.sort((a, b) => a.price.new > b.price.new ? 1 : -1);
  }
  else if (tipSortiranja == 'cenaOpadajuce') {
    return sviProizvodi.sort((a, b) => a.price.new < b.price.new ? 1 : -1);
  }
  else if (tipSortiranja == 'zvezdicaRastuce') {
    return sviProizvodi.sort((a, b) => a.stars > b.stars ? 1 : -1);
  }
  else if (tipSortiranja == 'zvezdicaOpadajuce') {
    return sviProizvodi.sort((a, b) => a.stars < b.stars ? 1 : -1);
  }
}

function search(sviProizvodi) {
  let searchValue = $("#search").val().toLowerCase();
  if (searchValue) {
    return sviProizvodi.filter(function (el) {
      return el.name.toLowerCase().indexOf(searchValue) !== -1;
    })
  }
  return sviProizvodi;
}


function dodajUKorpu() {
  var id = $(this).sviProizvodi('id');
  var proizvodiLS = imaUKorpi();
  if (!proizvodiLS) {
    let proizvodiLS = [];
    proizvodiLS[0] = { 
      id: id,
      kolicina: 1
    };
    postaviULS("proizvodi", proizvodiLS);
  }
  else {
    if (!pronadjiULS(proizvodiLS, id)) {
      dodajULS(id)
    }
    else {
      azurirajKolicinu(id); 
    }
  }
}

function pronadjiULS(proizvodi, id) {
  return proizvodi.find(p => p.id == id);
}


function dodajULS(id) {
  let proizvodiLS = imaUKorpi();
  proizvodiLS.push({
    id: id,
    kolicina: 1
  });
  postaviULS("proizvodi", proizvodiLS);
}


function azurirajKolicinu(id) {
  let proizvodiLS = imaUKorpi();
  proizvodiLS.forEach(el => {
    if (el.id == id)
      el.kolicina++;
  });
  postaviULS("proizvodi", proizvodiLS );
}

if (url == "/cart.html"){
function prikaziKorpu() {
  let html = `
    <div id="orderTable">
      <table class="table table-responsive">
      <thead>
      <tr>
        <td>Naziv proizvoda</td>
        <td>Slika</td>
        <td>Cena</td>
        <td>Količina</td>
        <td>Ukupno</td>
      </tr>
    </thead>`;

  let proizvodiLS = dohvatiIzLS("proizvodi");
  var proizvodi = dohvatiIzLS("sviProizvodi");
  

  proizvodi = proizvodi.filter(el => {
    for (let p of proizvodiLS) {
      if (el.id == p.id) {
        el.kolicina = p.kolicina;
        return true;
      }
    }
  });
  proizvodi.forEach(el => {
    html += `<tbody>
      <tr>
        <td><p>${el.name}</h5></p>
        <td>
          <img src="assets/img/${el.image.src}" alt="${el.image.alt}" class="img-thumbnail" width="100"/>
        </td>
        <td class="cena">$${el.price.new}</td>
        <td class="kolicina">
          <input class="formcontrol kolicinaInput" type="number" value="${el.kolicina}">
        </td>
        <td class="proizvodUkupno">${parseFloat(el.price.new * el.kolicina)} $</td>
      </tr>
    </tbody>`;
  });

  html += `<table>
          </div>
            <div class="container">
            <div class="row d-flex justify-content-end" id="control">
              <p id="totalSum" class="m-2">Ukupno: ${ukupno(proizvodi)}$</p>
              <button id="kupi" class="btn btn-primary m2">Kupi</button>
              <button id="ukloni" class="btn btn-danger m-2">Ukloni</button>
            </div>
       </div>`;

  $("#korpa").html(html);
  $("#kupi").click(validirajKarticu);
  $("#ukloni").click(ukloniSve);

}
function ukupno(sviProizvodi) {
  let zbir = 0;
  sviProizvodi.forEach(el => {
    zbir += parseFloat(el.price.new * el.kolicina);
  });
  return zbir;
}

cekiraj(dohvatiIzLS("proizvodi"));

function cekiraj(proizvodiUKorpi) {
  if (proizvodiUKorpi) {
    if (proizvodiUKorpi.length) {
      prikaziKorpu();
      $(".kolicinaInput").change(promeniKolicinu);
    }
    else
      prikaziPraznuKorpu();

  }
  else
    prikaziPraznuKorpu();
}

function prikaziPraznuKorpu() {
  $("#korpa").html("<p class='text-center p-5 alert-danger'>Nema nijedan proizvod u korpi</p>");
}

function ukloniSve() {
  ukloniIzLS("proizvodi");
  location.reload();
}

function azuriraj() {
  var proizvodiSuma = document.querySelectorAll(".proizvodiSuma");
  var cena = document.querySelectorAll(".price");
  var kolicinaSum = document.querySelectorAll(".kolicinaInput");
  var ukupnaSuma = document.querySelector("#ukupno");
  var ukupnaKolicinaZaJedan = 0;
  for (let i = 0; i < cena.length; i++) {
    var jednaCena = cena[i].innerHTML.replace('$', '');
    proizvodiSuma[i].innerHTML = (Number(jednaCena) * Number(kolicinaSum[i].value)).toFixed(2) + "$";

    ukupnaKolicinaZaJedan += Number(jednaCena) * Number(kolicinaSum[i].value);
  }
  ukupnaSuma.innerHTML = "Ukupna suma:" + parseFloat(ukupnaKolicinaZaJedan).toFixed(2) + "$";
}

function promeniKolicinu() {
  if (this.value > 0) {
    azuriraj();
  }
  else {
    this.value = 1;
  }
}

$("#ime").blur(function () {
  validateInput(regIme, "#ime", "#greskaIme", porukaIme);
});

$("#adresa").blur(function () {
  validateInput(regAdresa, "#adresa", "#greskaAdresa", porukaAdresa);
});

$("#kreditnaKartica").blur(function () {
  validateInput(regKreditnaKartica, "#kreditnaKartica", "#greskaKreditnaKartica", porukaKreditnaKartica);
});

function validacija(){
  var greske = 0;
  if(!validateInput(regName, "#ime", "#greskaIme", porukaIme)){
    greske++;
  }
  if(!validateInput(regAdresa, "#adresa", "#greskaAdresa", porukaAdresa)){
    greske++;
  }
  if(!validateInput(regKreditnaKartica, "#kreditnaKartica", "#greskaKreditnaKartica", porukaKreditnaKartica)){
    greske++;
  }
  else {
    if(greske == 0){
      return kupi();
    }
  }
  

}

function kupi(){
    localStorage.removeItem("proizvodi");
    prikaziPraznuKorpu();
    $("#korpa").html("<p class='alert-success p-5'>Vaša porudžbina je kreirana</p>");
 }
 
}

