![](https://user-images.githubusercontent.com/1753298/89695355-eda48200-d8d0-11ea-99e0-1db05ee7a66a.png)

You can use this addon for [Local](https://localwp.com/) 5.x on **MacOS ONLY** to connect to databases using [TablePlus](https://tableplus.com/) with one click!

## Install

Download the `.tgz` file from a [release](https://github.com/aubreypwd/local-tableplus/releases). Navigate to *Local → Addons → Installed → Install from Disk* and select the `.tgz` file. Enable *TablePlus* and restart Local.

## Usage

Connect to databases just like you would Sequel Pro or Adminer, but with <img src="https://tableplus.com/resources/favicons/apple-icon-180x180.png" height="16" width="16" style="display:inline"> TablePlus!.

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
