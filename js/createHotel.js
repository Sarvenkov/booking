(function () {
    var instance;

    document.addEventListener('DOMContentLoaded', function () {
        var elem = document.querySelector('.modal');
        M.Modal.init(elem, {opacity: 0.7, endingTop: '10%', startingTop: '0%', onOpenStart});
        instance = M.Modal.getInstance(elem);
    });

    function onOpenStart() {
        eventBus.subscribe('nameIsSame', sameName);

        eventBus.subscribe('closeModal', closeModal);
        let mContent = document.querySelector('.modal-content');
        let nameModal = document.querySelector('.name-modal');
        let helperTextName = document.querySelector('.helper-name');
        let ratingModal = document.querySelector('.rating-modal');
        let helperTextRating = document.querySelector('.helper-rating');
        let mealModal = document.querySelector('.meal-modal');
        let regionModal = document.querySelector('.region-modal');
        let beachModal = document.querySelector('.beach-modal');
        let wifiModal = document.querySelector('.wifi-modal');
        let gymModal = document.querySelector('.gym-modal');
        let conferenceModal = document.querySelector('.conference-modal');
        let submitModal = document.querySelector('.form-modal');
        let warning = document.querySelector('.warning');
        let descModal = document.querySelector('.desc-modal');

        mContent.addEventListener("input", validateName);
        mContent.addEventListener("input", validateRating);
        regionModal.addEventListener("change", validateRegion);
        beachModal.addEventListener("change", validateFeatures);
        submitModal.addEventListener("submit", validateSubmit);

        var flagRating = false;
        var flagName = false;

        function validMessage(obj, message, helper) {
            if (message === false) {
                obj.setCustomValidity("");
                helperTextName.textContent = "right";
            } else {
                obj.setCustomValidity(message);
                helper.textContent = obj.validationMessage;
            }
            return helper.textContent;
        }

        function validateName() {
            flagName = false;
            if (nameModal.value.trim().length === 0) {
                validMessage(nameModal, "name is empty", helperTextName);
            } else if (nameModal.value.replace(/\s+/g, " ").length < 10) {
                validMessage(nameModal, "too short name", helperTextName);
            } else {
                validMessage(nameModal, false, helperTextName);
                flagName = true;
            }
        }

        function validateRating() {
            flagRating = false;
            if (mealModal.value !== '3') {
                if (!ratingModal.value) {
                    validMessage(ratingModal, "from 1 to 5", helperTextRating);
                } else if (ratingModal.value < 1) {
                    validMessage(ratingModal, "not less than 1", helperTextRating);
                } else if (ratingModal.value > 5) {
                    validMessage(ratingModal, "not more than 5", helperTextRating);
                } else if (ratingModal.value >= 1 && ratingModal.value <= 5) {
                    validMessage(ratingModal, false, helperTextRating);
                    flagRating = true;
                    if (ratingModal.value < 4) {
                        mealModal[3].disabled = true;
                        M.FormSelect.init(mealModal, {});
                    } else {
                        mealModal[3].disabled = false;
                        M.FormSelect.init(mealModal, {});
                    }
                }
            } else {
                if (!ratingModal.value) {
                    validMessage(ratingModal, "from 4 to 5", helperTextRating);
                } else if (ratingModal.value < 4) {
                    validMessage(ratingModal, "for All Inclusive meal type 4 or 5 stars", helperTextRating);
                    mealModal[3].disabled = true;
                    M.FormSelect.init(mealModal, {});
                } else if (ratingModal.value > 5) {
                    validMessage(ratingModal, "not more than 5", helperTextRating);
                } else if (ratingModal.value >= 4 && ratingModal.value <= 5) {
                    validMessage(ratingModal, false, helperTextRating);
                    flagRating = true;
                    mealModal[3].disabled = false;
                    M.FormSelect.init(mealModal, {});
                }
            }
        }

        function validateRegion() {
            beachModal.disabled = false;
            wifiModal.disabled = false;
            if (this[3].selected) {
                beachModal.checked = false;
                beachModal.disabled = true;
                // M.FormSelect.init(beachModal, {});
                warning.textContent = '';
            } else if (this[1].selected || this[2].selected) {
                wifiModal.checked = true;
                wifiModal.disabled = true;
                warning.textContent = '';
            }
        }

        function validateFeatures() {
            regionModal[3].disabled = false;
            M.FormSelect.init(regionModal, {});
            if (beachModal.checked) {
                regionModal[3].disabled = true;
                M.FormSelect.init(regionModal, {});
            }
        }

        function validateSubmit(event) {

            event.preventDefault();
            if (regionModal[0].selected || mealModal[0].selected) {
                warning.textContent = "Select the Region and the Meal type";
            } else if (!flagRating || !flagName) {
                warning.textContent = "Select unique Name and Rating";
            } else {
                flagRating = true;
                flagName = true;
                prepareHotel();
            }
        }

        function getMealType() {
            if (mealModal[1].selected) return "OB";
            if (mealModal[2].selected) return "BB";
            if (mealModal[3].selected) return "AI";
        }

        function getRegion() {
            if (regionModal[1].selected) return "Kemer";
            if (regionModal[2].selected) return "Antalya";
            if (regionModal[3].selected) return "Istanbul";
        }

        function getFeatures() {
            let masFeatures = [];
            if (wifiModal.checked) masFeatures.push('wifi');
            if (beachModal.checked) masFeatures.push('beach');
            if (gymModal.checked) masFeatures.push('gym');
            if (conferenceModal.checked) masFeatures.push('conference');
            return masFeatures
        }

        function sameName (){
            warning.textContent = "hotel with this name is already exist";
        }

        function closeModal() {
            console.log(3);
            eventBus.unsubscribe('closeModal', closeModal);
            submitModal.removeEventListener("submit", validateSubmit);
            instance.close();
        }
        function prepareHotel() {
            let hotel = {
                name: nameModal.value,
                rating: ratingModal.value,
                description: descModal.value,
                mealType: getMealType(),
                features: getFeatures(),
                region: getRegion()
            };
            eventBus.publish('hotelWannaToCreate', hotel);
        }
    }
})();
