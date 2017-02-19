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
        checkWidth: true
    }
    
    class responsiveText {

        /**
         * Constructor
         *
         * @param  {object} element The elements that will be resized
         * @param  {object} options Custom user options
         */
        constructor( elements, options ) {
            this.options = Object.assign({}, defaultOptions, options);
            this.elements = elements;
        }

        /**
         * Initiate responsiveText
         */
        init() {
            if (this.elements.length) {

                for(let i = 0; i < this.elements.length; i++) {

                    this.responsiveText(this.elements[i]);

                }

            } else {
                this.responsiveText(this.elements);
            }
        }

        /**
         * Calculate the font-size required for the font to be as big as possible
         *
         * @param {object} element The element that will be resized
         */
        responsiveText( element ) {
            let fontSize, target;

            // Get the max size of the element
            if( this.options.targetSize.hasOwnProperty('width') && this.options.targetSize.hasOwnProperty('height') ) {
                target = this.options.targetSize;
            } else {
                target = this.getTargetSize( element );
            }

            this.binarySearch(guess => {
                // We divide the guess since we don't need such a large font-size and we want some decimal places
                guess = guess / this.options.divider;

                // Floor guess to X decimals
                fontSize = this.floor10(guess, this.options.length);

                // Set the new fontSize
                element.style.fontSize = fontSize + this.options.unit;

                // Get the size of the element with the new font-size
                let absoluteSize = this.getAbsoluteSize( element );

                // Custom comparator
                if(this.options.comparator instanceof Function) {
                    return this.options.comparator()
                } else {

                    const absoluteWidthExact = absoluteSize.width === target.width;
                    const absoluteWidthLess = absoluteSize.width < target.width;
                    const absoluteHeightExact = absoluteSize.height === target.height;
                    const absoluteHeightLess = absoluteSize.height < target.height;

                    // Only check width 
                    if(this.options.checkWidth === true && this.options.checkHeight === false) {

                        // Check if we found the exact correct font-size
                        if(absoluteWidthExact) {
                            return 1;
                        }

                        // If not, check if the new size is less than the original
                        else {
                            return absoluteWidthLess;
                        }

                    }

                    // Only check height
                    else if(this.options.checkWidth === false && this.options.checkHeight === true) {

                        // Check if we found the exact correct font-size
                        if(absoluteHeightExact) {
                            return 1;
                        }

                        // If not, check if the new size is less than the original
                        else {
                            return absoluteHeightLess;
                        }

                    }

                    // Check both width and height
                    else {

                        // Check if we found the exact correct font-size
                        if(absoluteWidthExact && absoluteHeightExact) {
                            return 1;
                        }

                        // If not, check if the new size is less than the original
                        else {
                            return absoluteWidthLess && absoluteHeightLess;
                        }

                    }
                }
            });

            // Set the final font-size
            element.style.fontSize = fontSize + this.options.unit;

            // Dispatch done event with final font-size
            element.dispatchEvent(new CustomEvent('done', {
                detail: {
                    fontSize: fontSize
                }
            }));
        }

        /**
         * Gets the absolute size of an element.
         *
         * @param  {object} element The element that will be resized
         * @return {number}         An object with the width and height
         */
        getAbsoluteSize( element ) {
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
        getTargetSize( element ) {
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
         * Performs a binary search to find a number between min and max and returns the final guess. 
         * If it can't be found it'll return false.
         * Original from https://github.com/Olical/binary-search
         *
         * @param  {function} comparator A function to validate whether the guess is smaller than the target
         * @param  {number}   max        The max value to search for
         * @param  {number}   min        The min value to search for
         * @return {number}              Returns the last guess
         */
        binarySearch(comparator = (guess, min, max) => {
            let target = 0;

            if(guess === target) {
                return 1;
            } else {
                return guess < target;
            }

        }, max = this.options.max, min = this.options.min) {
            let guess;

            // if max is bitwise
            if (max <= 2147483647) {
                while (min <= max) {
                    guess = (min + max) >> 1;
                    if (comparator(guess, min, max) === 1) { return guess }
                    if (comparator(guess, min, max)) { min = guess + 1 }
                    else { max = guess - 1 }
                }
            } else {
                while (min <= max) {
                    guess = Math.floor((min + max) / 2);
                    if (comparator(guess, min, max) === 1) { return guess }
                    if (comparator(guess, min, max)) { min = guess + 1 }
                    else { max = guess - 1 }
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
        floor10(value, exp) {
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