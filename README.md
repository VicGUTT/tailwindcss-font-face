# An easy way to configure your project's font faces within [TailwindCSS](https://tailwindcss.com)

This plugin provides you with a `fontFace` configuration theme that allows you to setup your project's `@font-face` rules either by defining the rules manually or by pointing to an external CSS file.
Here's a quick example:

```js
// tailwind.config.js

module.exports = {
    theme: {
        // Using a font provider (external CSS file)
        fontFace: [
            'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;1,200&display=swap',
            'https://fonts-provider.com/Montserrat'
        ],
        // Manually defining the rules
        fontFace: [
            {
                fontFamily: 'Mulish',
                fontStyle: 'normal',
                fontWeight: 900,
                src: '/fonts/Mulish/Mulish-Black.ttf',
                // ...
            },
            // ...
        ],
    },
    plugins: [
        require('@vicgutt/tailwindcss-font-face')({
            fontDir: './public/fonts/Mulish',
            fontPath: '/fonts/Mulish',
        }),
    ],
};
```

## How it works

When passing in font face rules manually the plugin will mostly just pass it down to Tailwind so the CSS styles can be generated.
If an external CSS file is provided, the plugin will extract that file's font faces, fetch and store the font files, set the correct font path for all font faces, convert the font faces to an object and finally pass it down to Tailwind.

You might be interested in taking a look at the [Handler.ts](https://github.com/VicGUTT/tailwindcss-font-face/blob/main/src/Handler.ts) and [AbstractFontsProvider.ts](https://github.com/VicGUTT/tailwindcss-font-face/blob/main/src/FontFaceProviders/AbstractFontsProvider.ts) files.

The generated CSS will be added to Tailwind's **base** layer.

## Installation

Install the plugin via NPM _(or yarn)_:

``` bash
# Using npm
npm i @vicgutt/tailwindcss-font-face

# Using Yarn
yarn add @vicgutt/tailwindcss-font-face
```

Then add the plugin to your tailwind.config.js file:

``` js
// tailwind.config.js

module.exports = {
    theme: {
        // ...
    },
    plugins: [
        require('@vicgutt/tailwindcss-font-face'),
        // ...
    ],
};
```

## Options

The plugin exposes a few options that may used to configure it's behaviour.

| Name                 | Type                | Default            | Description |
| -------------------- | ------------------- | ------------------ | ----------- |
| fontDir              | `string\|undefined` | `undefined`        | Necessary, when fetching an external file, to know where to store the font files. This value can also be specified when defining the external resource as in object.  
| fontPath             | `string\|undefined` | `undefined`        | Necessary, when fetching an external file, as it will be used to set the font's `src` url. This value can also be specified when defining the external resource as in object.  
| defaultFontFaceRules | `object\|undefined` | `undefined`        | Default font face rules that will be applied to all styles _(manually defined or not)_.

Here's an example of how those options can be used:

```js
// tailwind.config.js

module.exports = {
    // ...
    plugins: [
        require('@vicgutt/tailwindcss-font-face')({
            fontDir: './path/to/where/the/externally/fetched/font/files/will/be/stored',
            fontPath: '/value/that/will/be/used/for/the/font/face/src/url',
            defaultFontFaceRules: {
                fontFamily: 'My-awesome-font',
                fontDisplay: 'swap',
                fontStyle: 'normal',
                fontWeight: 500,
                // ...
            },
        }),
    ],
};
```

## Usage

The `fontFace` theme key accepts either [Manual styles](#manual-styles) or [External styles](#external-styles) or a mix of both.
Here's how they can both be structured:

### Manual styles

It expects CSS rules written as JavaScript objects in the same CSS-in-JS syntax used [throughout Tailwind](https://tailwindcss.com/docs/plugins#css-in-js-syntax).
That said, the following properties are considered "special" by the plugin:

#### src

This property may be defined as a `string`, `object`, or an `array` of either or both.
If defined as an object, it requires the `url` key to be present and it's value to be the path from where the font file will be downloaded when needed by a browser.
It accepts an optional `format` key that denotes well-known font formats and avoids the browser from downloading unsupported font formats.

See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src) from more details.

Here's examples of how the src may be defined:

```js
{
    src: '/the/font/path.woff2',
    // - or -
    src: { url: '/the/font/path.woff2', format: 'woff2' },
    // - or -
    src: { url: '/the/font/path.woff2', format: 'auto' }, // Will detect the "woff2" format from the file extension when possible
    // - or a mix -
    src: [
        '/a/font/path1.woff2',
        { url: '/a/font/path2.woff2' },
        { url: '/a/font/path3.woff2', format: 'woff2' },
        { url: '/a/font/path4.woff2', format: 'auto' },
        { url: '/a/font/path5.unknown', format: 'woff2' },
        { url: '/a/font/path6.unknown', format: 'auto' },
    ],
};
```

This will produce the following CSS:

```css
@font-face {
    src: url('/the/font/path.woff2');
    /* or */
    src: url('/the/font/path.woff2') format('woff2');
    /* or */
    src: url('/the/font/path.woff2') format('woff2'); /* Format automatically detected */
    /* or a mix */
    src: url('/a/font/path1.woff2'),
        url('/a/font/path2.woff2'),
        url('/a/font/path3.woff2') format('woff2'),
        url('/a/font/path4.woff2') format('woff2'),
        url('/a/font/path5.unknown') format('woff2'),
        url('/a/font/path6.unknown');
}
```

#### fontWeight

This property expects any valid [CSS "font-weight" value](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight) or any [Tailwind "font-weight" name](https://tailwindcss.com/docs/font-weight) minus the "font-" prefix.
It also accepts two values to specify a range that is supported by the font-face which can be written as an array or a string.

The following table demontrates the expected values:

| Value             | Mapped to       | Description |
| ----------------- | --------------- | ----------- |
| number            | Itself          | Usefull for "variable fonts"
| 100 to 900        | Itself          | Standard numeric font weight values
| normal            | Itself          | Normal font weight. Same as 400.
| bold              | Itself          | Bold font weight. Same as 700.
| thin              | 100             | Tailwind font weight name for the "100" CSS value
| extralight        | 200             | Tailwind font weight name for the "200" CSS value
| light             | 300             | Tailwind font weight name for the "300" CSS value
| medium            | 500             | Tailwind font weight name for the "500" CSS value
| semibold          | 600             | Tailwind font weight name for the "600" CSS value
| extrabold         | 800             | Tailwind font weight name for the "800" CSS value
| black             | 900             | Tailwind font weight name for the "900" CSS value
| 'value1 value2'   | value1 value2   | Specifying a font weight range
| [value1, value2]  | value1 value2   | Specifying a font weight range

Here's examples of how the fontWeight may be defined:

```js
{
    fontWeight: 77,
    // - or -
    fontWeight: 'thin',
    // - or -
    fontWeight: 'normal',
    // - or -
    fontWeight: ['light', 900],
};
```

This will produce the following CSS:

```css
@font-face {
    font-weight: 77;
    /* or */
    font-weight: 100;
    /* or */
    font-weight: normal;
    /* or */
    font-weight: 300 900;
}
```

### External styles

Font faces can be extracted, parsed and processed from any valid URL that exposes CSS styles. This feature is usefull for when you would like to locally host font files provided by services like Google fonts.

#### Defining the URL

To fetch external styles, the plugin will expect a URL which can be passed in as a string, object or an array of either or both.

Here's examples of how the URL may be specified:

```js
{
    fontFace: 'https://fonts-provider.com/Montserrat.css',
    // - or -
    fontFace: [
        'https://fonts-provider.com/Montserrat.css',
        'https://fonts-provider.com/Mulish.css',
    ],
    // - or -
    fontFace: { url: 'https://fonts-provider.com/Montserrat.css' },
    // - or -
    fontFace: [
        'https://fonts-provider.com/Lato.css',
        { url: 'https://fonts-provider.com/Montserrat.css' },
        { url: 'https://fonts-provider.com/Mulish.css' },
    ],
};
```

Please keep in mind that when fetching external font faces the plugin will need to know **where to store** the retrieved files and **which path to set** to the font faces' `src: url(...)` property.

#### `fontDir` & `fontPath`

When fetching external font faces the `fontDir` & `fontPath` properties must be defined either when defining the URL as an object or as global config options.

Here's examples of how they may be specified:

```js
{
    theme: {
        fontFace: [
            // The `fontDir` & `fontPath` are provided by the plugin options below
            'https://fonts-provider.com/Montserrat',

            // The `fontDir` & `fontPath` are provided directly, thus overwriting the plugin options
            {
                url: 'https://fonts-provider.com/Mulish.css',
                fontDir: './public/specific/Mulish/font/dir',
                fontPath: '/specific/Mulish/font/path',
            },
        ],
    },
    plugins: [
        require('@vicgutt/tailwindcss-font-face')({
            fontDir: './public/fonts/Montserrat',
            fontPath: '/fonts/Montserrat',
        }),
    ],
};
```

This will produce styles similar to:

```css
/* Montserrat font faces */

@font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 200;
    font-display: swap;
    /* The font will be stored in './public/fonts/Montserrat' */
    src: url('/fonts/Montserrat/Montserrat-normal-200-a92506f0a66e014d41e9315248f2d01d.woff2') format('woff2');
    /* ... */
}
/* ... */

/* Mulish font faces */

@font-face {
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 200;
    font-display: swap;
    /* The font will be stored in './public/specific/Mulish/font/dir' */
    src: url('/specific/Mulish/font/path/Mulish-normal-200-b96bb1e6727bb1c10705054f2b14b625.woff2') format('woff2');
    /* ... */
}
/* ... */
```

#### Defining request options

This plugin uses the [sync-request](https://github.com/ForbesLindesay/sync-request) library to make synchronous HTTP requests.
Synchronous HTTP requests are necessary because TailwindCSS's plugin system lack async excecution support.

All of [sync-request's options](https://github.com/ForbesLindesay/sync-request#usage) may be defined by passing in a `request` key:

```js
{
    fontFace: {
        url: 'https://fonts-provider.com/Mulish.css',
        request: {
            // These are the default values defined in "AbstractFontsProvider.ts"
            maxRedirects: 5,
            timeout: 5000,
            retry: true,
            maxRetries: 3,
            retryDelay: 1,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            },
        },
    },
};
```

Some services like Google Fonts may determine which font faces to serve based on the browser. For that reason we spoof a Chrome 90 `user-agent` request header when fetching the resource.

<!-- ## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently. -->

## Contributing

If you're interested in contributing to the project, please read our [contributing docs](https://github.com/VicGUTT/tailwindcss-font-face/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
