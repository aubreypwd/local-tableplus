# <img src="https://tableplus.com/resources/favicons/apple-icon-180x180.png" style="display:inline" height="16" width="16">TablePlus Addon for <img src="https://static.macupdate.com/products/61238/l/local-by-flywheel-logo.png?v=1568340803" style="display:inline" height="16" width="16"> Local

Only on <img src="https://lh3.googleusercontent.com/proxy/qb4yE71EW3HgI7iSim7Lbxf31H1xbU1TmeVMx6ThlM0XlZOBD21qhvkK9bIl5fcKrzpzJIhyYle_REQ3SH6Uai0lSP4bTJd-c9bTJ6KHGfR_YsGFVpWMLgQQ4Xl-A14sOps" style="display:inline" height="16" width="16"> MacOS for Local 5.x (Lightning)

- [Install &rarr](https://github.com/aubreypwd/local-tableplus/releases/tag/v1.0.0)

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
