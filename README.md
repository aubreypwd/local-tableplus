# Open TablePlus on MacOS for Local "Lightning" 5.x


<p style="text-align:center">
<img src="https://static.macupdate.com/products/61238/l/local-by-flywheel-logo.png?v=1568340803" height="150" width="150" style="display:inline"><img src="https://tableplus.com/resources/favicons/apple-icon.png" height="150" width="150" style="display:inline">
</p>

## Installation



## Notes

This will override your `/tmp/mysql.sock` file to connect to TablePlus.

--------------------

## Development

Clone the repo anywhere you want using:

```
git clone git@github.com:aubreypwd/local-tableplus.git
```

Then, cd into the repo and run `npm run link` and it will automatically symlink to your Local addons folder and build the package.

then run `npm run build` or `npm run watch` (requires `watchexec`, install with `brew install watchexec`) to develop.

`master` will be the current development version.

### Packaging for release

Run `npm run dist` to create a package to distribute to release channels.

-------------------------

# Changelog 

## v1.0.0

First version using TablePlus 3.7.0 (330). This version connects to TablePlus by creating symlink from the site's socket file to `/tmp/mysql.sock` which TablePlus connects by default when invoked via a `mysql://` URI.
