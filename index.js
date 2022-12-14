// Function used to fetch data from JSON server (db.json file)
function fetchMoviesList(){
    fetch("https://api.jsonbin.io/v3/b/63999b2adfc68e59d567c4c2")
    .then(response => response.json())
    .then(data => generateMovieList(data.record.films))
}

/*
This function takes the data fetched and uses it to render the list of movies
*/
function generateMovieList(movies){

    // grabs unordered list film
    const films = document.getElementById('films')
    const deleteMovie = document.getElementById('delete_movie')

    movies.forEach(movie => {

        // create a link that also serves as list element
        const list = document.createElement('a')
        list.href ="#"
        list.innerText = movie.title
        list.classList.add('film-item','list-group-item' )

        //append list element to the ul element
        films.appendChild(list)

        // eventLister for the list element if clicked to display movie details
        list.addEventListener('click', (e) => {
            e.preventDefault()
            generateMovieDetails(movie)
        })
    }); 
}

// function used to generate movie details to the right side of the webpage
function generateMovieDetails(movie){

    // selects divs for displaying image and movie details
    const movieImage = document.getElementById('movie_image')
    const movieDescription= document.getElementById('movie_description')

    const remainingSeats = movie.capacity - movie.tickets_sold

    // image and book ticket form is rendered in the image div if the movie is selected
    movieImage.innerHTML =
    `<img src="${movie.poster}" alt="movie poster" height="200px" width="150px"></img>
    <form id="form_book">
        <label class="form-label" >Number of tickets: </label>
        <input id="tickets" type="number" placeholder="Input Number of tickets" class="form-control" style="width:400px" min="0" step="1" max="${remainingSeats}" required>
        <button type="submit" class="btn btn-primary mt-2" id="book_ticket">Book Ticket</button>
        
    </form>
    `
    
    // html element rendered in the decription div if the movie is selected
    movieDescription.innerHTML = 
        `
         <h4>${movie.title}</h4>
         <p>${movie.description}</p>
         <p>Show Time: ${movie.showtime}</p>
         <p id="seats">Remaining Seats: ${remainingSeats}</p>
        `
    const tickets = document.getElementById('tickets').value
    
    // if condition that makes changes to button and input field when the seats are sold out
    if(remainingSeats === 0){
            document.getElementById('tickets').disabled = true
            const button = document.getElementById('book_ticket')
            button.innerText = 'Sold Out'
            button.disabled = true
        }

    // get the form for booking movie tickets
    const form = document.getElementById('form_book')

        // eventListener for form submit used to book
        form.addEventListener('submit', (e) => {
            patchMovieDetails(movie) 
            form.reset()
        }) 
    
}

// function for patching data to server
function patchMovieDetails(movie){

    const remainingSeats = movie.capacity - movie.tickets_sold
    const tickets = document.getElementById('tickets').value
    movie.tickets_sold += parseInt(tickets,10)

    // function used to patch new information to the server
    fetch(`http://localhost:3000/films/${movie.id}`,{
        method: 'PATCH',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(movie)
    })
    .then(response => response.json())
    .then(data => data)

    // alert the user on the number of tickets bought
    alert(`Thank you!\n You have bought ${tickets} tickets\n for ${movie.title}`)

}

document.addEventListener('DOMContentLoaded', () => {
    fetchMoviesList()
})
