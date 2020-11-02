![](https://user-images.githubusercontent.com/1753298/89695355-eda48200-d8d0-11ea-99e0-1db05ee7a66a.png)

You can use this addon for <img src="https://static.macupdate.com/products/61238/l/local-by-flywheel-logo.png?v=1568340803" style="display:inline" height="16" width="16"> [Local](https://localwp.com/) 5.x ⚡️ on <img src="https://lh3.googleusercontent.com/proxy/qb4yE71EW3HgI7iSim7Lbxf31H1xbU1TmeVMx6ThlM0XlZOBD21qhvkK9bIl5fcKrzpzJIhyYle_REQ3SH6Uai0lSP4bTJd-c9bTJ6KHGfR_YsGFVpWMLgQQ4Xl-A14sOps" style="display:inline" height="16" width="16"> MacOS ONLY to connect to databases using <img src="https://tableplus.com/resources/favicons/apple-icon-180x180.png" style="display:inline" height="16" width="16"> [TablePlus](https://tableplus.com/) with one click.

- [Install &rarr;](https://github.com/aubreypwd/local-tableplus/releases/tag/v1.0.0)

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
