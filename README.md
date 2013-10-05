# urlicon

**urlicon** beautifies web address inputs with informative glyphs and tastefully recomposed urls.

## Usage

```js
// native version
new Url(new Urlicon(element, options));
```

```js
// jquery version
$('#url').urlicon();
```

## Configuration

**delay**: Delay (in milliseconds) between icon changes. Default is `300`.

**path**: Path of the glyphs. Default is `"image/urlicon"`.

**prefix**: Prefix classname given to the input (`<input>`), glyph, and container. Default is `"urlicon"`.

**usefavicon**: Whether a site favicon should be used when present. Default is `false`.

**useprotocol**: Whether a protocol should prepend urls. Default is `false`, but forcibly `true` on url inputs (`<input type="url">`).