# Responsive text

A responsive "fittext" script that is calculating the required font size based on the size of the parent element. Can be used with the vw (viewport width) unit so that no resize events have to be used.

## Download and Install:
Download [responsive-text.js](https://raw.githubusercontent.com/PatrikElfstrom/responsive-text/master/dist/responsive-text.js) and place responsive-text.js in your project.

## Usage:
`white-space: nowrap;` is required for it to work correctly. You can use `<br />` to get line breaks.

### Without resize event
```html
<style>
    h1 { white-space: nowrap; }
</style>
<h1>Say the magic words,<br/> Fat Gandalf.</h1>
<script type="text/javascript" src="responsive-text.js"></script>
<script type="text/javascript">
    var element = document.querySelector('h1');
    new responsiveText({
        unit: 'vw',
    }, element).init();
</script>
```
### With resize event
```html
<style>
    h1 { white-space: nowrap; }
</style>
<h1>Say the magic words,<br/> Fat Gandalf.</h1>
<script type="text/javascript" src="responsive-text.js"></script>
<script type="text/javascript">
    var element = document.querySelector('h1');
    var responsiveText = new responsiveText(element)
    
    responsiveText.init();
    
    window.addEventListener('resize', function() {
        responsiveText.init();
    });
</script>
```

## Options
### unit
Define your own font-size unit.
Default: `'px'`
### targetSize
Define your own target size.
Needs to be an object with width and height.
```
{
    width: 100, 
    height: 100
}
```
Defaults to check the parents size.
Default: `{}`
### min
The minimum binary search range.
Default: `0`
### max
The maximum binary search range.
Default: `1000000000`
### divider
How much to divide the guess to get the correct font-size.
Default: `100000`
### length
The float floor exponent (the 10 logarithm of the adjustment base).
Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
Default: `-6`
### comparator
A custom comparator used to test if the guessed font-size is correct.
Example:
```JavaScript
(guess, min, max) => {
    guess = guess / divider;
    
    element.style.fontSize = guess + 'vw';

    // Let the font-size set the size of the element
    // then return the new width of the element
    let currentElementWidth = getCurrentElementWidth(); 

    // if the current element width is equal to the target width
    // we've found the correct font-size.
    // If not, test if the current size is too big or too small
    if(currentElementWidth === targetElementWidth) {
        return 1;
    } else {
        return currentElementWidth < targetElementWidth;
    }
}
```
Default: `null`
### checkHeight
If the height of the element should be considered.
Default: `true`
### checkWidth
If the width of the element should be considered.
Default: `true`