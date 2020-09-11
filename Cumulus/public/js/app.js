let cityName = document.querySelector('#name');
let button = document.querySelector('.btn');
let iconElement = document.querySelector(".weather-icon");
let notificationElement = document.querySelector('.notification');
let city = document.querySelector('.city');
let date = document.querySelector('.date');
let temp = document.querySelector('.current .temp');
let desc = document.querySelector('.current .desc');
let hilow = document.querySelector('.hi-low');
let now = new Date();
const api = {
  key: "dad07bea9b046fdedb71b7eb117e5cce",
  base: "https://api.openweathermap.org/data/2.5/"
}


cityName.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(cityName.value);
  }
}

button.addEventListener('click', function findResults(){
  return getResults(cityName.value);
});
function getResults (query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(weather => {
        return weather.json();
      }).then(displayResults);
}

function displayResults (weather) {
    if (weather.cod === '404') {
        notificationElement.style.display = 'block'
        notificationElement.innerHTML = `<p>${cityName.value} not found, please check the spelling or the location name</p>`;
        // return notifi
    } else {
        notificationElement.style.display = 'none'
      
        iconElement.innerHTML = `<img src="icons/${weather.weather[0].icon}.png"/>`;
        city.innerText = `${weather.name}, ${weather.sys.country}`;
        date.innerText = dateBuilder(now);
        temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;    
        desc.innerText = weather.weather[0].main;
        hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

        if (desc.textContent === 'Rain') {
              document.body.style.backgroundImage = "url('img/rain.jpg')";
            } else if (desc.textContent == 'Clouds') {
              document.body.style.backgroundImage = "url('img/cloudy.jpg')";
            } else if (desc.textContent == 'Haze' || desc.textContent == 'Mist') {
              document.body.style.backgroundImage = "url('img/haze.jpg')";
            } else if (desc.textContent === 'Thunderstorm') {
              document.body.style.backgroundImage = "url('img/thunderstorm.jpg')";
            } else if (desc.textContent == 'Snow' || desc.textContent == 'Snowy') {
              document.body.style.backgroundImage = "url('img/clear2.jpg')";
            } else {
              document.body.style.backgroundImage = "url('img/clear.jpg')";
            }


            let localArray = [city.innerText, date.innerText, temp.innerHTML, desc.innerText, hilow.innerHTML, iconElement.innerHTML]
            console.log(localArray);
            localStorage.setItem(cityName.value, localArray)

            // lastkey = key;
            localStorage.setItem('lastkey', cityName.value);
      }
  }

onload = () => {
    notificationElement.style.display = 'none'
    let key = localStorage.getItem('lastkey')
    if (key) {
        let getLocalKey = localStorage.getItem(key).split(',');
               
        city.innerText = getLocalKey[0] + ',' + getLocalKey[1];
    
        // let date = document.querySelector('.location .date');
        date.innerText = getLocalKey[2];

        // let temp = document.querySelector('.current .temp');
        temp.innerHTML = getLocalKey[3];

        iconElement.innerHTML = getLocalKey[6]

        // let desc = document.querySelector('.current .weather');
        desc.innerText = getLocalKey[4];

        // let hilow = document.querySelector('.hi-low');
        hilow.innerHTML = getLocalKey[5];

        if (desc.textContent === 'Rain') {
          document.body.style.backgroundImage = "url('img/rain.jpg')";
        } else if (desc.textContent == 'Clouds') {
          document.body.style.backgroundImage = "url('img/cloudy.jpg')";
        } else if (desc.textContent == 'Haze' || desc.textContent == 'Mist') {
          document.body.style.backgroundImage = "url('img/haze.jpg')";
        } else if (desc.textContent === 'Thunderstorm') {
          document.body.style.backgroundImage = "url('img/thunderstorm.jpg')";
        } else if (desc.textContent == 'Snow' || desc.textContent == 'Snowy') {
          document.body.style.backgroundImage = "url('img/clear2.jpg')";
        } else {
          document.body.style.backgroundImage = "url('img/clear.jpg')";
        }
    }


    
}

function dateBuilder (d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`;
}




if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
