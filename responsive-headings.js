(function(){

    const responsiveHeadings = function() {

        function getRealWidth( element ) {
            const elementPosition = element.style.position; // get position
            element.style.position = 'absolute';      // set position to absolute

            const elementWidth = element.offsetWidth; // get current width
            element.style.position = elementPosition; // reset position

            return elementWidth;
        }

        // https://github.com/Olical/binary-search
        function binarySearch(maxValue, increase, callback) {
            var min = 0;
            var max = maxValue;
            var guess;

            var bitwise = (max <= 2147483647) ? true : false;
            if (bitwise) {
                while (min <= max) {
                    guess = (min + max) >> 1;
                    if (callback(guess)) { return guess; }
                    if (increase(guess)) { min = guess + 1; }
                    else { max = guess - 1; }
                }
            } else {
                while (min <= max) {
                    guess = Math.floor((min + max) / 2);
                    if (callback(guess)) { return guess; }
                    if (increase(guess)) { min = guess + 1; }
                    else { max = guess - 1; }
                }
            }

            return -1;
        }

        const responsiveHeading = function( element ) {
            const elementWidth = element.offsetWidth; // Desired width
            let newElementWidth = getRealWidth( element ); // get current width

            element.classList.remove("responsiveHeadings-complete");
            element.classList.add("responsiveHeadings-loading");

            // returns fontsize if exact fontsize was found otherwise -1
            // We dont need the return since the last tested is always the closest
            binarySearch(10000, function(guess) {
                fontSize = guess/100; // we do max 10000 and divide by 100 to get two decimals (ex. 8.43)
                element.style.fontSize = fontSize + 'vw'; // set the new fontSize
                newElementWidth = getRealWidth( element ); // get the new width

                return newElementWidth < elementWidth;
            }, function(guess) {
                fontSize = guess/100; // we do max 10000 and divide by 100 to get two decimals (ex. 8.43)
                element.style.fontSize = fontSize + 'vw'; // set the new fontSize
                newElementWidth = getRealWidth( element ); // get the new width

                return newElementWidth === elementWidth;
            });

            element.classList.remove("responsiveHeadings-loading");
            element.classList.add("responsiveHeadings-complete");
        };

        if (this.length) {
            for(let i = 0; i < this.length; i++) {
                responsiveHeading(this[i]);
            }
        } else {
            responsiveHeading(this);
        }

        return this;
    };

    Element.prototype.responsiveHeadings = responsiveHeadings;
    HTMLCollection.prototype.responsiveHeadings = responsiveHeadings;

})();