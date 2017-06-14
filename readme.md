# Responsive text

A responsive "fittext" script that is calculating the required font size based on the size of the parent element.  
Can be used with the viewport width unit so that no resize events have to be used.

## Download and Install:
Download [responsive-text.js](https://raw.githubusercontent.com/PatrikElfstrom/responsive-text/master/dist/responsive-text.js) and place responsive-text.js in your project.

## Usage:
`white-space: nowrap;` is required for it to work correctly. You can use `<br />` to get line breaks.  
The parent element needs some form of height and width.

```html
<style>
    .parent { width: 500px; height: 500px; }
    h1 { white-space: nowrap; }
</style>

<div class="parent">
    <h1>Gandalf the Grey</h1>
</div>

<script type="text/javascript" src="responsive-text.js"></script>
<script type="text/javascript">
    var element = document.querySelector('h1');
    new responsiveText(element).init();
</script>
```

### Autoresizing text without resize event
With the use of the `vw` (or `vh`) unit we can get autoresizing text without the need of an resize event.
```html
<style>
    html,body {
        width: 100%;
        margin: 0;
    }
    .parent {
        width: 100%;
        height: 300px;
    }
    h1 { white-space: nowrap; }
</style>

<div class="parent">
    <h1>Radagast the Brown</h1>
</div>

<script type="text/javascript" src="responsive-text.js"></script>
<script type="text/javascript">
    var element = document.querySelector('h1');
    new responsiveText(element, {
        unit: 'vw',
    }).init();
</script>
```
### Autoresizing text with resize event
`px` is the default unit and with a resize event it is a little more reliable.
```html
<style>
    html,body {
        width: 100%;
        margin: 0;
    }
    .parent {
        width: 100%;
        height: 300px;
    }
    h1 { white-space: nowrap; }
</style>

<div class="parent">
    <h1>Saruman the White</h1>
</div>
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
(currentSize, targetSize, guess) => {
    // Compare the current size with the target size
    const isWidthExact = currentSize.width === targetSize.width;
    const isWidthLess = currentSize.width < targetSize.width;
    const isHeightExact = currentSize.height === targetSize.height;
    const isHeightLess = currentSize.height < targetSize.height;
    
    // Check if we found the exact correct font-size
    if (isWidthExact && isHeightExact) {
        return 1;
    }

    // If not, check if the current size is less than the original
    return isWidthLess && isHeightLess;
}
```
Default: `null`
### checkHeight
If the height of the element should be considered.  
Default: `true`
### checkWidth
If the width of the element should be considered.  
Default: `true`
### callback
A function that is called when the calculation is done  
Default: `function() {}`
