```
npm install
```

## To run ticker:
Create a file called `url.txt` with the URL you want to tick
```
./loop.sh
```

## To run graphing server:
```
node index.js
```

## To run S3 cacher:
1. Configure your AWS credentials: `aws configure`
1. Configure the bucket name/key: `cp config.example.js config.js`, fill in details

Then:
```
node cache.js
```
