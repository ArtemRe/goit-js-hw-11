import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');

const refs = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  card: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(e => contriesAdd(e.target.value), 300)
);
function contriesAdd() {
  resetHTML();
  const serchInput = refs.input.value.trim();

  if (serchInput !== '') {
    fetchCountries(serchInput)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          createContry(data);
        }
      })
      .catch(error =>
        Notify.failure('Oops, there is no country with that name')
      );
  }
}

function createContry(countries) {
  createContryList(countries);
  if (countries.length === 1) {
    createContryListInfo(countries[0]);
  }
}

function createContryList(countries) {
  const countriesListInput = countries
    .map(({ flags, name }) => {
      return `<li class="country-item">
         <img class="country-flag" src="${flags.svg}" alt="">
         <p class="country-name">${name.official}</p>
      </li>`;
    })
    .join('');

  refs.ul.insertAdjacentHTML('beforeend', countriesListInput);
}

function createContryListInfo(country) {
  const { capital, population, languages } = country;

  const infoInput = `<ul class="list">
  <li class="info-item"><p><span class="info-title">Capital: </span>${capital}</p></li>
  <li class="info-item"><p><span class="info-title">Population: </span>${population}</p></li>
  <li class="info-item"><p><span class="info-title">Languages: </span>${Object.values(
    languages
  )}</p></li>
</ul>`;

  refs.card.insertAdjacentHTML('beforeend', infoInput);
}

function resetHTML() {
  refs.card.innerHTML = '';
  refs.ul.innerHTML = '';
}
