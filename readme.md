# Responsive text

A responsive "fittext" script that is calculating the required font size to get the desired width of the element and sets that using the vw unit so that no window resize events is necessary.

## Download and Install:
Download [responsive-text.js](https://raw.githubusercontent.com/PatrikElfstrom/Responsive-text/master/responsive-text.js) and place responsive-text.js in your project.

## Usage:
white-space: nowrap is required for it to work correctly. You can use `<br/>` to get line breaks.
```html
<style>
    h1 { white-space: nowrap; }
</style>
<h1>Say the magic words,<br/> Fat Gandalf.</h1>
<script type="text/javascript" src="responsive-text.js"></script>
<script type="text/javascript">
    document.getElementsByTagName('h1').responsiveText();
</script>
```

### With Google Fonts:  
Since Google Fonts needs to load before we do the calculation we need to use [Web Font Loader](https://github.com/typekit/webfontloader) so we can get a callback when Google Fonts has loaded.
```html
<style>
    h1 { white-space: nowrap; }
</style>
<h1>Say the magic words,<br/> Fat Gandalf.</h1>
<script type="text/javascript" src="responsive-text.js"></script>
<script type="text/javascript">
    WebFontConfig = {
        active: function() {
            document.getElementsByTagName('h1').responsiveText();
        },
        google: {
            families: ['Open Sans']
        }
    };
    (function(d) {
        var wf = d.createElement('script'), s = d.scripts[0];
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js';
        s.parentNode.insertBefore(wf, s);
    })(document);
</script>
```


## How does it work?
It works simply by calculating the required font size to get the desired width of the element.  

1. Get the desired width of the element  
This is done by temporarily setting the element position to absolute.  
  
2. Calculate the required font size  
This is done by doing a binary search to find a font size where the element width is equal to the desired width  
  
3. Set the calculated font size  
The calculated font size is set with the vw unit. This to avoid the need to do any calculations during resize of the window.  
  
Since vw is relative to the width of the viewport (100vw = 100% viewport width) we don't have to change the font size during window resize. 15% of the viewport is always 15% of the viewport.

## Known issues:  
* If the window has an vertical scrollbar the text won't scale properly. It will be off by around 100px per 1000px.