# `slonkboard`

`slonkboard` is a front-end dashboard for `slonk`. 
It is based off of our previous dashboard, 
[`resfet-dashboard`](https://github.com/rice-eclipse/resfet-dashboard).

## Dependencies

This project uses [Node.JS and NPM](https://nodejs.org/). 

## Installation

Clone the repository into your desktop:

```bash
git clone https://github.com/rice-eclipse/slonkboard
```

CD into the directory:  

```bash
cd slonkboard
```

Install the required modules:

```bash
npm install
```

Run the software:

```bash
npm start
```

While debugging, you may find it useful to include backtrace information from Electron.
To do this, set the environment variable `ELECTRON_ENABLE_LOGGING` to 1.

```bash
ELECTRON_ENABLE_LOGGING=1 npm start
```

## License

Copyright (c) Rice Eclipse 2019-2022. 
All rights reserved.

Licensed under [GNU General Public License v3.0](https://github.com/rice-eclipse/slonkboard/blob/master/LICENSE).
