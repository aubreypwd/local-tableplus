# Open TablePlus on MacOS for Local "Lightning" 5.x

![](https://tableplus.com/resources/favicons/apple-icon.png)

## Installation

There are two ways to install:

### Link

Clone the repo anywhere you want using:

```
git clone git@github.com:aubreypwd/local-tableplus.git
```

Then, cd into the repo and run `npm run link` and it will automatically symlink to your Local addons folder and build the package.

### Clone

Until this ends up in the community list, you can clone this repo into `~/Library/Application Support/Local/addons/` using:

```bash
git clone git@github.com:aubreypwd/local-tableplus.git
```

Then, in the addon, run:

```bash
npm i
```

Restart Local and you should be able to enable the Addon and use.

## Development

Just clone the repo into `~/Library/Application Support/Local/addons/` like normal:

```bash
git clone git@github.com:aubreypwd/local-tableplus.git
```

`master` will be the current development version.

Then when you run `npm i` you can run `npm run build` or `npm run watch` to develop.

You will have to `brew install watchexec` to run `npm run watch`.

## Notes

This will override your `/tmp/mysql.sock` file to connect to TablePlus.

-------------------------

# Changelog 

## 1.0.1

- New way to install using `npm run link` after cloning anywhere

## 1.0.0

First version using TablePlus 3.7.0 (330). This version connects to TablePlus by creating symlink from the site's socket file to `/tmp/mysql.sock` which TablePlus connects by default when invoked via a `mysql://` URI.
