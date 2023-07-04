window.onload = function () {
	const loadingSection = document.querySelector('.loading');
	loadingSection.classList.add('_active');
	setTimeout(() => {
		loadingSection.classList.remove('_active');
	}, 700);
};

// state
const stateFetch = {
	isError: false,
	data: [],
	days: [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	],
	month: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	],
	icons: {
		sunny: 'img/Sunny.png',
		clear: 'img/Sunny.png',
		rain: 'img/Rain.png',
		snow: 'img/Snow.png',
		wind: 'img/Wind.png',
		cloudy: 'img/cloudy.png',
		mist: 'img/mist.png',
		overcast: 'img/Overcast.png'
	}
};

// sections
const formSection = document.querySelector('form');
const inputSection = formSection.querySelector('input');
const errorSection = document.querySelector('.header__error');

const api = {
	url: 'http://api.weatherstack.com/',
	key: 'e7ba23cb65a5fecfe9826d6a1af89d99',
	city: localStorage.getItem('city') || 'Москва'
};

// Functions
const fetchData = async () => {
	const { city, key, url } = api;
	const link = url + 'current?' + 'access_key=' + key + '&query=' + city;
	const res = await fetch(link);
	const data = await res.json();
	stateFetch.isError = false;

	if (data.error) {
		messageError();
		return;
	}

	stateFetch.data = data;
	stateFetch.isError = false;
	if (!stateFetch.isError) {
		errorSection.classList.remove('_active');
	}
	updateContent();
};

const messageError = () => {
	stateFetch.isError = true;
	if (stateFetch.isError) {
		errorSection.classList.add('_active');
	} else {
		errorSection.classList.remove('_active');
	}
};

const onChengeDate = () => {
	const date = new Date();
	const day = date.getDate();
	const dayN = date.getDay();
	const month = date.getMonth();
	return stateFetch.days[dayN] + ', ' + stateFetch.month[month] + ' ' + day;
};

const searchIcons = str => {
	const keys = Object.keys(stateFetch.icons);
	const a = keys.filter(key => {
		return str.toLowerCase().indexOf(key) > -1;
	});
	if (a.length) {
		return stateFetch.icons[a];
	}
	return str;
};

const updateContent = () => {
	const siteBarImgSection = document.querySelector('.site-bar__img > img');
	const siteBarDegreesSection = document.querySelector(
		'.site-bar__degrees > span'
	);
	const feelsNameSetcion = document.querySelector('.feels__name > span');
	const siteBarCitySection = document.querySelector('.site-bar__city');
	const siteBarDateSection = document.querySelector('.site-bar__date');
	const siteBarDescrSection = document.querySelector('.site-bar__descr > span');
	const siteBarTimeSection = document.querySelector('.site-bar__time > span');
	const windSection = document.querySelector('.wind');
	const pressureSection = document.querySelector('.pressure');
	const precipSection = document.querySelector('.precip');
	const visibilitySection = document.querySelector('.visibility');
	const humiditySection = document.querySelector('.humidity');
	const cloudcoverSection = document.querySelector('.cloudcover');

	const { location, current } = stateFetch.data;
	const { name, localtime } = location;
	const {
		feelslike,
		weather_icons: weatherIcons,
		temperature,
		weather_descriptions: weatherDescriptions,
		visibility,
		cloudcover,
		humidity,
		precip,
		pressure,
		wind_speed: windSpeed
	} = current;
	siteBarImgSection.src = searchIcons(weatherDescriptions[0]);
	siteBarDegreesSection.textContent = temperature;
	feelsNameSetcion.textContent = feelslike;
	siteBarCitySection.textContent = name;
	siteBarDateSection.textContent = onChengeDate();
	siteBarDescrSection.textContent = weatherDescriptions;
	siteBarTimeSection.textContent = localtime.slice(11);

	windSection.textContent = windSpeed;
	pressureSection.textContent = pressure;
	precipSection.textContent = precip;
	visibilitySection.textContent = visibility;
	humiditySection.textContent = humidity;
	cloudcoverSection.textContent = cloudcover;
};

const onSubmitForm = e => {
	e.preventDefault();

	const value = inputSection.value;
	if (value.length) {
		api.city = value;
		fetchData().catch(err => {
			messageError();
		});
		if (!stateFetch.isError) {
			errorSection.classList.remove('_active');
		}
		inputSection.value = '';
		localStorage.setItem('city', api.city);
	}
};

// Calls
formSection.addEventListener('submit', onSubmitForm);
fetchData().catch(err => {
	messageError();
});
