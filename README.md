# Word Statistics

## Description

A Nestjs server that processes text and stores frequency for each word.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start:dev

# debug
$ yarn start:debug

# production mode
$ export NODE_ENV=production
$ nest build
$ nest start
```

## Test

```bash
# unit tests
$ yarn test
```
## Endpoints

### Process Text

`POST /v1/words` - Accepts text source (string/url/local file path) and a word delimiter (optional - default is ` `) and return `202`

String example:
```bash
POST /v1/words
body: {
  str: "Hi! My name is (what?), my name is (who?), my name is Slim Shady"
}
```

Url example:
```bash
POST /v1/words
body: {
  url: "https://words.free.beeceptor.com/bigFile"
}
```

File example:
```bash
POST /v1/words
body: {
  localFilePath: "./localFiles/bible.txt"
}
```

### Get Word Frequency