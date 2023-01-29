import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
function searchCountry() {
  let name = searchBox.value;
  if (name === '') {
    Notiflix.Notify.info('Please type a country name');
    resetList();
  } else {
    fetchCountries(name.trim())
      .then(countries => renderCountryList(countries))
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        resetList();
      });
  }
}

function renderCountryList(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    resetList();
  } else if (countries.length <= 10 && countries.length >= 2) {
    resetList();

    const markup = countries
      .map(({ name, flags }) => {
        return `<li class= "country-item"><img class= "flag_img" src= "${flags.svg}">
            <h2 class="country-name">${name}</h2>
            </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  } else if (countries.length === 1) {
    resetList();
    const markup = countries
      .map(({ name, flags, capital, population, languages }) => {
        return `<div class= "main">
            <img class= "flag_img" src= "${flags.svg}">
            <h2>${name}</h2>
            </div>            
            <p><b>Capital:</b><span>${capital}</span></p>            
            <p><b>Population:</b><span>${population}</span></p>            
            <p><b>Languages:</b><span>${languages.map(
              ({ name }) => ' ' + name
            )}</span></p>`;
      })
      .join('');
    countryInfo.innerHTML = markup;
  }
}
const resetList = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};
