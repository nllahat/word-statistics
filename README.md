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
```

\*\* default port: `8080`

## Test

```bash
# unit tests
$ yarn test
```

## Endpoints

### Process Text

`POST /v1/words` - Accepts text source (string/url/local file path) and a word delimiter (optional - default is ``) and returns `202`

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
  wordDelimiter: ' '
}
```

### Get Word Frequency

`GET /v1/words/:word` - Accepts a word as a url parameter and returns the word frequency number

## Data Structure

### Assumptions

- A `word` is an English word in a lower-case form (`a-z`) with no other characters.
- An average word length in English is ~10.
- Total unique words in English is ~200,000.

---> Estimated max memory usage to store all unique words is ~2 MB.

### Implementation

Because many english words share a single prefix I chose to use the `Trie` data structure to store the words and their frequencies.
With that structure I could save memory by not saving a record for each unique word (as opposed to a `HashTable`).
Max nodes to iterate in the `Trie` is `26`.

\*\* I thought it might be an overhead to use a database for that task by these assumptions
but let me know if you want to see any database integration experience from my side
