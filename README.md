# Open TablePlus for Local

Note this is for Local by Flywheel "Lightning" 5.x+

## Installation

Until this ends up in the community list, you can clone this repo into `~/Library/Application Support/Local/addons/` using:

```bash
$ git clone git@github.com:aubreypwd/local-tableplus.git
```

Then, in the addon, run:

```
npm i
```

## Development

Just clone the repo into `~/Library/Application Support/Local/addons/` like normal:

```bash
$ git clone git@github.com:aubreypwd/local-tableplus.git
```

`master` will be the current development version.

Then when you run `npm i` you can run `npm run build` or `npm run watch` to develop.

## Notes

This will override your `/tmp/mysql.sock` file to connect to TablePlus.
