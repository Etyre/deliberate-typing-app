# Development

## Run

```
npm run dev

```

## Railway stuff

On railway, create a volume for the secrets folder, so that we're not overwriting the old private/public keys every time we redeploy (invalidating any auth tokens on client machines).

(It's also necessary to do this for the database, as you can read in the README for the database.)
