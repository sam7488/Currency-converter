import { countryList } from './country-flags.js'
const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies';

const selectElement = document.querySelectorAll('.dropdown select');
const btnElement = document.querySelector('button');
const fromSelectElement = document.querySelector('.from select');
const toSelectElement = document.querySelector('.to select');

let timeoutId = null;

selectElement.forEach((select) => {
  for(let currCode in countryList) {
    let newOption = document.createElement('option');
    if(select.name === 'from' && currCode === 'USD') {
      newOption.selected = 'selected';
    }

    if(select.name === 'to' && currCode === 'NPR') {
      newOption.selected = 'selected';
    }
    newOption.innerText = currCode;
    newOption.value = currCode;
    select.append(newOption);
  }

  select.addEventListener(
    'change',
    (evt) => {
      updateFlag(evt.target)
    }
  )
})

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode]
  const newImageSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector('img');
  img.src = newImageSrc;
}

btnElement.addEventListener(
  'click',
  (evt) => {
    evt.preventDefault();
    updateExchangeRate();
  }
)

function displayInvalid() {
  clearTimeout(timeoutId);
  document.querySelector('.invalid').style.opacity = 1;
  timeoutId = setTimeout(() => {
    document.querySelector('.invalid').style.opacity = 0;
    displaying = false;
  },
  2000
  )
}

const updateExchangeRate = async () => {
  let amount = document.querySelector('.amount input').value;
  if(amount === '' || amount < 0 || isNaN(amount)) {
    displayInvalid();
    return;
  }

  const fromCurr = fromSelectElement.value.toLowerCase();
  const toCurr = toSelectElement.value.toLowerCase();
  const URL = `${BASE_URL}/${fromCurr}/${toCurr}.json`;
  const response = await fetch(URL);
  const data = await response.json();
  const exchangeRate = data[toCurr];
  const exchangeAmount = amount * exchangeRate;
  document.querySelector('.converted-amount').innerText = `${amount} ${fromCurr.toUpperCase()} = ${exchangeAmount} ${toCurr.toUpperCase()}`;
}

window.addEventListener(
  'load',
  updateExchangeRate
)