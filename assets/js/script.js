let searchFormEl = document.getElementById('search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  // Get the search input value
  let searchInputVal = document.getElementById('search-input').value;
  // Get the format input value
  let formatInputVal = document.getElementById('format-input').value;

  // Perform validation on the search input
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  // Construct the query string with search and format input values
  let querystring = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  // Redirect the user to the search results page with the query string
  location.assign(querystring);
}

// Add an event listener to listen for form submission
searchFormEl.addEventListener('submit', handleSearchFormSubmit);