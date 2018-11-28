window.modules = {};
(function () {
    var hotels;
    // var hotels = [
    //     {
    //         name: 'Ritz Carlton',
    //         rating: 5,
    //         description: 'The most luxurious place in the world',
    //         mealType: 'AI',
    //         features: ['wifi', 'conference', 'beach'],
    //         region: 'Kemer'
    //     },
    //     {
    //         name: 'Royal Plaza',
    //         rating: 4,
    //         description: 'The most luxurious place in the world',
    //         mealType: 'BB',
    //         features: ['gym'],
    //         region: 'Istanbul'
    //     },
    //     {
    //         name: 'Sultan Palace',
    //         rating: 3,
    //         description: 'The most luxurious place in the world',
    //         mealType: 'AI',
    //         features: ['beach', 'gym'],
    //         region: 'Antalya'
    //     },
    //     {
    //         name: 'Ozkayamag Falez',
    //         rating: 5,
    //         description: 'This property is 4 minutes walk from the beach.',
    //         mealType: 'OB',
    //         features: ['beach', 'gym', 'wifi', 'conference'],
    //         region: 'Antalya'
    //     },
    //     {
    //         name: 'Hotel SU And Aqualand',
    //         rating: 3,
    //         description: 'All rooms and suites at Hotel SU & Aqualand feature trendy interiors and mood lighting.',
    //         mealType: 'OB',
    //         features: ['beach', 'wifi'],
    //         region: 'Istanbul'
    //     },
    //     {
    //         name: 'Sealife Family',
    //         rating: 4,
    //         description: 'This property is 3 minutes walk from the beach.',
    //         mealType: 'BB',
    //         features: ['beach', 'wifi', 'conference'],
    //         region: 'Istanbul'
    //     },
    //     {
    //         name: 'Crowne Plaza',
    //         rating: 2,
    //         description: 'This property is 4 minutes walk from the beach.',
    //         mealType: 'AI',
    //         features: ['wifi'],
    //         region: 'Antalya'
    //     }
    // ];
    var myInit = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
    };

    // fetch('https://hotels-backend.now.sh/api/hotels/1', myInit)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         // console.log(data);
    //         getDataFromServer(data);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    //
    //
    // function getDataFromServer(data) {
    //     // hotels = data;
    //     // console.log(hotels);
    // }



    function queryToServer() {
        fetch('https://hotels-backend.now.sh/api/hotels/17', myInit)
            .then(function (response) {
                if(!response.ok) getError(response);
                if(response.status === 200) return response.json();
            })
            .then(function (data) {
                getDataFromServer(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    queryToServer();

    function getError(response) {
        console.log(response.status);
        eventBus.publish('loadError', response);
    }

    function getDataFromServer(data) {
        hotels = data;
        console.log(hotels);
        eventBus.publish('loadHotels', hotels);
    }

    function getDataFromServerAfterAddedHotel(data) {
        hotels = data;
        console.log(hotels);
        eventBus.publish('getHotelsAfterAdded', hotels);
        console.log('get data');
        eventBus.publish('closeModal');
    }

    eventBus.subscribe('hotelWannaToCreate', addNewHotel);
    function addNewHotel(hotel) {
        if (hotels.some(function (item) { return item.name === hotel.name })) {
            eventBus.publish('nameIsSame');
            return false;
        } else {
            var toPost = {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(hotel)
            };
            // hotels.push(hotel);
            fetch('https://hotels-backend.now.sh/api/hotels/17', toPost)
                .then(function (response) {
                    console.log(1);
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (error) {
                    console.log(error)
                });
            setTimeout (function() {
                fetch('https://hotels-backend.now.sh/api/hotels/17', myInit)
                    .then(function (response) {
                        console.log(2);
                        if(!response.ok) {
                            getError(response);
                            console.log('error');
                            eventBus.publish('closeModal');
                            return false;
                        }
                        if(response.status === 200) return response.json();
                    })
                    .then(function (data) {
                        if (data !== false) {
                            console.log('success');
                            getDataFromServerAfterAddedHotel(data);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                // eventBus.publish('closeModal');
            }, 500);
        }
    }
})();


