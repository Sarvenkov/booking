(function () {
    var hotels;
    eventBus.subscribe('loadHotels', getHotels);
    function getHotels(data) {
        hotels = data;
        initRender(data);
    }
    eventBus.subscribe('loadError', getError);
    function getError(error) {
        if (error.status === 500) {
            container.textContent = "Internal Server Error, please try to reload. Error code: "
                + error.status;
        } else {
            container.textContent = "Error code " + error.status;
        }
    }
    eventBus.subscribe('getHotelsAfterAdded', getHotelsAfterAdded);
    function getHotelsAfterAdded(data) {
        hotels = data;
        console.log(hotels + "after add");
        filteredRender();
    }

    let template = document.querySelector("#offer");
    let pic = template.content.querySelector(".hotel-picture");
    let name = template.content.querySelector(".card-title");
    let rating = template.content.querySelector(".stars");
    let desc = template.content.querySelector(".description");
    let mealType = template.content.querySelector(".meal-type");
    let features = template.content.querySelector(".features-list");
    let region = template.content.querySelector(".region");
    let container = document.querySelector(".catalog");

    let fragment = document.createDocumentFragment();

    function initRender(hotels) {
        hotels.forEach(function (item, i) {
            insertTemplate(item, i);
        });
        container.textContent = '';
        container.appendChild(fragment);
    }

    function insertTemplate(item, i) {
        pic.src = getPicture(i);
        name.firstChild.textContent = item.name;
        rating.textContent = getStarsFromNumber(item);
        desc.textContent = item.description;
        mealType.textContent = getMealType(item);
        region.textContent = item.region;
        features.textContent = getFeaturesEmoji(item);
        fragment.appendChild(template.content.cloneNode(true));
    }

    let filter = document.querySelector(".filter");
    let filterStar = document.querySelector(".stars");
    let filterMeal = document.querySelector(".meal");
    let filterWifi = document.querySelector(".wifi");
    let filterBeach = document.querySelector(".beach");
    let filterGym = document.querySelector(".gym");
    let filterConference = document.querySelector(".conference");
    let filterKemer = document.querySelector(".kemer");
    let filterAntalia = document.querySelector(".antalya");
    let filterIstanbul = document.querySelector(".istanbul");

    let mapRegion = {
        "Kemer": filterKemer,
        "Antalya": filterAntalia,
        "Istanbul": filterIstanbul
    };
    var mapFeatures = {
        'wifi': [filterWifi, '💻'],
        'beach': [filterBeach, '🏖️'],
        'gym': [filterGym, '🏋️'],
        'conference': [filterConference, '👨‍💼']
    };
    let mapMealType = {
        "AI": ['All Inclusive', '1'],
        "OB": ['Breakfast only', '2'],
        "BB": ['Breakfast and bed', '3']
    };

    filter.addEventListener("change", filteredRender);

    function mainFilter() {
        container.textContent = '';

        return hotels.filter(function (item) {
            return filterMealType(item) && filterRating(item) && filterFeatures(item) && filterRegion(item)
        });
    }

    eventBus.subscribe('hotel-created', onHotelCreated);

    function onHotelCreated() {
        console.log(4);
        filteredRender();
    }

    function filteredRender() {

        container.classList.remove('empty');
        let count = 0;
        mainFilter().forEach(function (item, i) {
            count++;
            insertTemplate(item, i);
        });
        if (count === 0) {
            container.classList.add('empty');
            container.textContent = 'no matches...';
        }
        container.appendChild(fragment);
    }

    function filterMealType(item) {
        for (let keyMealType in mapMealType) {
            if (filterMeal.value === mapMealType[keyMealType][1]) return item.mealType === keyMealType
        }
        if (filterMeal.value === '') return true;
    }

    function filterRating(item) {
        if (item.rating >= filterStar.value) return true
    }

    function filterFeatures(item) {
        let array = [];
        for (let keyFeatures in mapFeatures) {
            if (mapFeatures[keyFeatures][0].checked) array.push(keyFeatures);
        }
        let count = 0;
        array.forEach(function (feature) {
            if (item.features.indexOf(feature) !== -1) count++;
        });
        if (count === array.length) return true;
    }


    function filterRegion(item) {
        for (let keyRegion in mapRegion) {
            if (mapRegion[keyRegion].children[0].checked) return item.region === keyRegion;
        }
        return true;
    }

    function getMealType (item) {
        for (let keyMealType in mapMealType) {
            if (item.mealType === keyMealType) return mapMealType[keyMealType][0]
        }
    }

    function getPicture (i) {
        i = i % 6;
        return "../img/" + (i + 1) + ".jpg";
    }

    function getStarsFromNumber(item) {
        let stars = "";
        for (let i = 0; i < item.rating; i++) {
            stars += "⭐";
        }
        return stars;
    }

    function getFeaturesEmoji(item) {
        let mas = [];
        for (let j = 0; j < item.features.length; j++) {
            for (let keyFeatures in mapFeatures) {
                if (item.features[j] === keyFeatures) mas.push(mapFeatures[keyFeatures][1]);
            }
        }
        return mas.join('');
    }
})();