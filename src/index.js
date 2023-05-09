import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const input = document.querySelector(`#search-box`);
const listElem = document.querySelector(`.country-list`);
const infoElem = document.querySelector(`.country-info`);

input.addEventListener(`input`, debounce(onInput, DEBOUNCE_DELAY));

  function onInput() {
      const name = input.value.trim();

      if (name === '') {
          listElem.innerHTML = '';
          infoElem.innerHTML = '';
          return  ;
      }

      fetchCountries(name)
          .then(countries => {
              listElem.innerHTML = '';
              infoElem.innerHTML = '';
              if (countries.length > 10) {
                  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
              }
              else if (countries.length >= 2 && countries.length <= 10) {
                  listElem.insertAdjacentHTML('beforeend', countriesListMarkup(countries))
              }
              else if (countries.length === 1) {
                  listElem.insertAdjacentHTML('beforeend', countriesInfoMarkup(countries))
              }
          })
          .catch(error => {
              Notiflix.Notify.failure('Oops, there is no country with that name')
          });
  }
  function countriesListMarkup(countries) {
  const markup = countries.map(({ name, flags }) => {
    return `
      <li class = "countryList">
        <img class ="countryFlag" src="${flags.svg}" alt="Flag of ${name.official}" width="45px" height="30px">
        <h2 class = "countryName">${name.official}</h2>
      </li>`;
  }).join('');
  return markup;
}

function countriesInfoMarkup(countries) {
  const markup = countries.map(({ name, capital, population, flags, languages }) => {
    return `
      <ul>
        <li>
          <img src="${flags.svg}" alt="Flag of ${name.official}" width="45px" height="30px">
          <h2>${name.official}</h2>
        </li>
        <li><p><b>Capital: </b>${capital}</p></li>
        <li><p><b>Population: </b>${population}</p></li>
        <li><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
      </ul>`;
  }).join('');
  return markup;
  }
