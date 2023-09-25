# asteroid-miner

## Project setup
```
yarn install

should have mongodb installed.
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and run for production
```
yarn start
```

## Some ideas
```
1. solved issues and changed items comparing with the online service:
-- websocket connection
-- added [initial mineral] when asteroid created, and changed [minerals] to [current minerals],
in order to indicate current value and initial value. the init value won't change.
-- not sure it is intentional or an issue, in the online service, the [targetType] of miner
might alter as "planet" or "asteroid", but the target never change.
in my own logic, these two fields indicate the current working target of miner.
and the [target] is always corresponding to the [targetType].
-- uniformed the data that returned from REST api and websocket. the online service has different
model of data for REST api and websocket. the websocket might combine referred object in the field.
in my own logic, they always return the same data and the referred field is id of the referred object.
-- bug resolved: in the online service, when a miner is created on a specific planet,
the minerals in the planet will not be consumed, and the number of miners is not increased.
solved in my backend.
-- for the field [current miner] in asteroid, i'm not sure this indicates the number or the name of
current miners. in the online service, it returns a miner name. but actually for each asteroid,
due to different miningSpeed and carryCapacity and remaining amount of minerals, there might be
many miners mining at the same time. so in my logic, this field is removed at the backend, just to simplify.
and the display value will be determined in front-end.

2. as per the changes above, the front end has made some changes to cater for the api response.

3. as the history data has been done in front-end, to simplify and because of insufficient time,
this portion is not implemented in my backend.

```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
