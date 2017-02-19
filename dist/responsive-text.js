var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (root, factory) {
    root.responsiveText = factory();
})(this, function () {

    var defaultOptions = {
        unit: 'px',
        targetSize: {},
        min: 0,
        max: 1000000000,
        divider: 100000,
        length: -6,
        comparator: null,
        checkHeight: true,
        checkWidth: true
    };

    var responsiveText = function () {

        /**
         * Constructor
         *
         * @param  {object} element The elements that will be resized
         * @param  {object} options Custom user options
         */
        function responsiveText(elements, options) {
            _classCallCheck(this, responsiveText);

            this.options = Object.assign({}, defaultOptions, options);
            this.elements = elements;
        }

        /**
         * Initiate responsiveText
         */


        _createClass(responsiveText, [{
            key: 'init',
            value: function init() {
                if (this.elements.length) {

                    for (var i = 0; i < this.elements.length; i++) {

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

        }, {
            key: 'responsiveText',
            value: function responsiveText(element) {
                var _this = this;

                var fontSize = void 0,
                    target = void 0;

                // Get the max size of the element
                if (this.options.targetSize.hasOwnProperty('width') && this.options.targetSize.hasOwnProperty('height')) {
                    target = this.options.targetSize;
                } else {
                    target = this.getTargetSize(element);
                }

                this.binarySearch(function (guess) {
                    // We divide the guess since we don't need such a large font-size and we want some decimal places
                    guess = guess / _this.options.divider;

                    // Floor guess to X decimals
                    fontSize = _this.floor10(guess, _this.options.length);

                    // Set the new fontSize
                    element.style.fontSize = fontSize + _this.options.unit;

                    // Get the size of the element with the new font-size
                    var absoluteSize = _this.getAbsoluteSize(element);

                    // Custom comparator
                    if (_this.options.comparator instanceof Function) {
                        return _this.options.comparator();
                    } else {

                        var absoluteWidthExact = absoluteSize.width === target.width;
                        var absoluteWidthLess = absoluteSize.width < target.width;
                        var absoluteHeightExact = absoluteSize.height === target.height;
                        var absoluteHeightLess = absoluteSize.height < target.height;

                        // Only check width 
                        if (_this.options.checkWidth === true && _this.options.checkHeight === false) {

                            // Check if we found the exact correct font-size
                            if (absoluteWidthExact) {
                                return 1;
                            }

                            // If not, check if the new size is less than the original
                            else {
                                    return absoluteWidthLess;
                                }
                        }

                        // Only check height
                        else if (_this.options.checkWidth === false && _this.options.checkHeight === true) {

                                // Check if we found the exact correct font-size
                                if (absoluteHeightExact) {
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
                                    if (absoluteWidthExact && absoluteHeightExact) {
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

        }, {
            key: 'getAbsoluteSize',
            value: function getAbsoluteSize(element) {
                // Get current position
                var elementPosition = element.style.position;
                var elementWhiteSpace = element.style.whiteSpace;

                // Set position to absolute
                element.style.position = 'absolute';
                element.style.whiteSpace = 'nowrap';

                // Get the new element width
                var boundingClientRect = element.getBoundingClientRect();
                var absoluteWidth = boundingClientRect.width;
                var absoluteHeight = boundingClientRect.height;

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

        }, {
            key: 'getTargetSize',
            value: function getTargetSize(element) {
                // get current styles
                var elementWidth = element.style.width;
                var elementHeight = element.style.height;
                var elementPosition = element.style.position;
                var parentElementPosition = element.parentElement.style.position;

                // Set the parent element to relative
                element.parentElement.style.position = 'relative';

                // Set the element size and position
                element.style.width = '100%';
                element.style.height = '100%';
                element.style.position = 'absolute';

                // Get the element new size
                var boundingClientRect = element.getBoundingClientRect();
                var targetWidth = boundingClientRect.width;
                var targetHeight = boundingClientRect.height;

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

        }, {
            key: 'binarySearch',
            value: function binarySearch() {
                var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (guess, min, max) {
                    var target = 0;

                    if (guess === target) {
                        return 1;
                    } else {
                        return guess < target;
                    }
                };
                var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.options.max;
                var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.options.min;
                return function () {
                    var guess = void 0;

                    // if max is bitwise
                    if (max <= 2147483647) {
                        while (min <= max) {
                            guess = min + max >> 1;
                            if (comparator(guess, min, max) === 1) {
                                return guess;
                            }
                            if (comparator(guess, min, max)) {
                                min = guess + 1;
                            } else {
                                max = guess - 1;
                            }
                        }
                    } else {
                        while (min <= max) {
                            guess = Math.floor((min + max) / 2);
                            if (comparator(guess, min, max) === 1) {
                                return guess;
                            }
                            if (comparator(guess, min, max)) {
                                min = guess + 1;
                            } else {
                                max = guess - 1;
                            }
                        }
                    }

                    return guess;
                }();
            }

            /**
             * Decimal floor with decimal adjustment.
             * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
             *
             * @param   {Number}  value The number.
             * @param   {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
             * @returns {Number}        The adjusted value.
             */

        }, {
            key: 'floor10',
            value: function floor10(value, exp) {
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
                value = Math.floor(+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));

                // Shift back
                value = value.toString().split('e');

                return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
            }
        }]);

        return responsiveText;
    }();

    return responsiveText;
});