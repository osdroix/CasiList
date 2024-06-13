
function openPopup(collectionName) {
    document.getElementById('oldName').value = collectionName;
    document.querySelector('.overlay').style.display = 'flex'; // Show the overlay with the popup
}

function closePopup() {
    document.querySelector('.overlay').style.display = 'none';
}

function toggleView() {
    var container = document.querySelector('.form-data');
    container.classList.toggle('flip'); // Alternar la clase que activa el giro
}
function filterCasilleros() {
    var input, filter, casilleros, casillero, name, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    casilleros = document.getElementsByClassName("casilleros");

    for (i = 0; i < casilleros.length; i++) {
        casillero = casilleros[i];
        name = casillero.getElementsByTagName("h3")[0];
        txtValue = name.textContent || name.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            casilleros[i].style.display = "";
        } else {
            casilleros[i].style.display = "none";
        }
    }
}