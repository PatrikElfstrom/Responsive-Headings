((root, factory) => {
    root.responsiveText = factory();
})(this, () => {
    const defaultOptions = {
        unit: 'px',
        targetSize: {},
        min: 0,
        max: 1000000000,
        divider: 100000,
        length: -6,
        comparator: null,
        checkHeight: true,
        checkWidth: true,
        callback () {}
    };

    class responsiveText {

        /**
         * Constructor
         *
         * @param  {object} element The elements that will be resized
         * @param  {object} options Custom user options
         */
        constructor (elements, options) {
            this._options = Object.assign({}, defaultOptions, options);
            this._elements = elements;
        }

        /**
         * Getters
         */
        get options () {
            return this._options;
        }

        get elements () {
            return this._elements;
        }

        /**
         * Initiate responsiveText
         */
        init () {
            if (this.elements.length) {
                for (let i = 0; i < this.elements.length; i++) {
                    this.main(this.elements[i]);
                }
            } else {
                this.main(this.elements);
            }
        }

        /**
         * Calculate the font-size required for the font to be as big as possible
         *
         * @param {object} element The element that will be resized
         */
        main (element) {
            this.element = element;

            // Set the target size of the element
            if (Object.prototype.hasOwnProperty.call(this.options.targetSize, 'width') &&
                Object.prototype.hasOwnProperty.call(this.options.targetSize, 'height')
            ) {
                this.targetSize = this.options.targetSize;
            } else {
                this.targetSize = responsiveText.getTargetSize(element);
            }

            // Do the main calculation
            const guess = responsiveText.binarySearch(this.comparator.bind(this), this.options.max, this.options.min);

            // Convert the final guess to font-size
            const fontSize = this.guessToFontSize(guess);

            // Set the final font-size
            element.style.fontSize = fontSize;

            // Callback
            this.options.callback(element, fontSize);
        }

        /**
         * Comparator function to do the comparison
         *
         * @param {int} guess  The current guess
         * @return {bool, int} Returns true if new size is less than the target size
         *                     or 1 if exact size was found
         */
        comparator (guess) {

            // Set the new fontSize
            this.element.style.fontSize = this.guessToFontSize(guess);

            // Get the size of the element with the new font-size
            const currentSize = responsiveText.getAbsoluteSize(this.element);

            // Use custom comparator
            if (this.options.comparator instanceof Function) {
                return this.options.comparator(currentSize, this.targetSize, guess);
            }

            // Compare the current size with the target size
            const isWidthExact = currentSize.width === this.targetSize.width;
            const isWidthLess = currentSize.width < this.targetSize.width;
            const isHeightExact = currentSize.height === this.targetSize.height;
            const isHeightLess = currentSize.height < this.targetSize.height;

            // Only check width
            if (this.options.checkWidth === true && this.options.checkHeight === false) {

                // Check if we found the exact correct font-size
                if (isWidthExact) {
                    return 1;
                }

                // If not, check if the current size is less than the original
                return isWidthLess;
            }

            // Only check height
            else if (this.options.checkWidth === false && this.options.checkHeight === true) {

                // Check if we found the exact correct font-size
                if (isHeightExact) {
                    return 1;
                }

                // If not, check if the current size is less than the original
                return isHeightLess;
            }

            // Check both width and height
            // Check if we found the exact correct font-size
            if (isWidthExact && isHeightExact) {
                return 1;
            }

            // If not, check if the current size is less than the original
            return isWidthLess && isHeightLess;
        }

        /**
         * Converts the guess to a usable font-size
         *
         * @param {int} guess The current guess
         * @return {number}         An object with the width and height
         */
        guessToFontSize (guess) {
            // We divide the guess to get some decimal places
            guess /= this.options.divider;

            // Floor guess to X decimals
            let fontSize = responsiveText.floor10(guess, this.options.length);

            // Add unit
            fontSize += this.options.unit;

            return fontSize;
        }

        /**
         * Gets the absolute size of an element.
         *
         * @param  {object} element The element that will be resized
         * @return {number}         An object with the width and height
         */
        static getAbsoluteSize (element) {
            // Get current position
            const elementPosition = element.style.position;
            const elementWhiteSpace = element.style.whiteSpace;

            // Set position to absolute
            element.style.position = 'absolute';
            element.style.whiteSpace = 'nowrap';

            // Get the new element width
            const boundingClientRect = element.getBoundingClientRect();
            const absoluteWidth = boundingClientRect.width;
            const absoluteHeight = boundingClientRect.height;

            // Reset the position
            element.style.position = elementPosition;
            element.style.whiteSpace = elementWhiteSpace;

            return { width: absoluteWidth, height: absoluteHeight };
        }

        /**
         * Gets the max size of an element inside its parent.
         *
         * @param  {object} element The element that will be resized
         * @return {object}         An object with the target width and height
         */
        static getTargetSize (element) {
            // get current styles
            const elementWidth = element.style.width;
            const elementHeight = element.style.height;
            const elementPosition = element.style.position;
            const parentElementPosition = element.parentElement.style.position;

            // Set the parent element to relative
            element.parentElement.style.position = 'relative';

            // Set the element size and position
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.position = 'absolute';

            // Get the element new size
            const boundingClientRect = element.getBoundingClientRect();
            const targetWidth = boundingClientRect.width;
            const targetHeight = boundingClientRect.height;

            // Reset the styles
            element.style.width = elementWidth;
            element.style.height = elementHeight;
            element.style.position = elementPosition;
            element.parentElement.style.position = parentElementPosition;

            return { width: targetWidth, height: targetHeight };
        }

        /**
         * Performs a binary search to find a number
         * between min and max and returns the final guess.
         * If it can't be found it'll return false.
         * Original from https://github.com/Olical/binary-search
         *
         * @param  {function} comparator Compare if the guess is smaller than the target
         * @param  {number}   max        The max value to search for
         * @param  {number}   min        The min value to search for
         * @return {number}              Returns the last guess
         */
        static binarySearch (comparator = guess => {
            const target = 0;

            if (guess === target) {
                return 1;
            }

            return guess < target;
        }, max = 10000, min = 0) {
            let guess;

            // if max is bitwise
            if (max <= 2147483647) {
                while (min <= max) {
                    guess = (min + max) >> 1;
                    if (comparator(guess, min, max) === 1) { return guess; }
                    if (comparator(guess, min, max)) { min = guess + 1; }
                    else { max = guess - 1; }
                }
            } else {
                while (min <= max) {
                    guess = Math.floor((min + max) / 2);
                    if (comparator(guess, min, max) === 1) { return guess; }
                    if (comparator(guess, min, max)) { min = guess + 1; }
                    else { max = guess - 1; }
                }
            }

            return guess;
        }

        /**
         * Decimal floor with decimal adjustment.
         * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
         *
         * @param   {Number}  value The number.
         * @param   {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number}        The adjusted value.
         */
        static floor10 (value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math.floor(value);
            }

            value = +value;
            exp = +exp;

            // If the value is not a number or the exp is not an integer...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }

            // Shift
            value = value.toString().split('e');
            value = Math.floor(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

            // Shift back
            value = value.toString().split('e');

            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }
    }

    return responsiveText;
});
