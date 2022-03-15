# A Node API to count the number of page hits

Usage:
install with `npm install`  
- npm run dev  
- To test, start another server from the views directory and render the index.html, in testing small-static-server was used.
- a data directory will be created with a json file for permenant storage of data in a json file, urls are hashed with the crypto module
- api srvice should work from any website / server request

# EndPoints

#### /text
- returns plain text
**`0`**

#### /json
- returns json formatted data  
**`{"count": 0 }`**

#### /js 
- returns executable javascript
**`${count}`**

## Examples of fetch request:

#### /text

```
fetch('http://localhost:3000/text', {
    method: 'GET',
    headers: {
        'Accept': 'text/plain',
    },
})
    .then(res => res.text())
    .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err));
```

#### /json

```
fetch('http://localhost:3000/json', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
    .then(res => res.json())
    .then(data => {
         console.log(data.count);
    })
    .catch(err => console.log(err));
```

#### /js

```
fetch('http://localhost:3000/js', {
    method: 'GET',
    headers: {
        'Accept': 'application/javascript',
    },
})
    .then(res => res.text())
    .then(data => {
        data = eval(data);
    })
    .catch(err => console.log(err));
```

## 