# filloutApi

Here is a simple express node repo using typescript and running in docker.


The url is as follows. The `replacewithtestdata` param needs to be an array of filters. 
```
https://filloutapi-q1qs.onrender.com/cLZojxk94ous/filteredResponses/replacewithtestdata
```


Here are some working test urls in the form of an equal and not equal check.
```
// equal
https://filloutapi-q1qs.onrender.com/cLZojxk94ous/filteredResponses/%5B%7B%22id%22%3A%22bE2Bo4cGUv49cjnqZ4UnkW%22%2C%22condition%22%3A%22equals%22%2C%22value%22%3A%22Johnny%22%7D%2C%7B%22id%22%3A%22dSRAe3hygqVwTpPK69p5td%22%2C%22condition%22%3A%22greater_than%22%2C%22value%22%3A%222024-01-01%22%7D%5D

// not equal
https://filloutapi-q1qs.onrender.com/cLZojxk94ous/filteredResponses/%5B%7B%22id%22%3A%22bE2Bo4cGUv49cjnqZ4UnkW%22%2C%22condition%22%3A%22does_not_equal%22%2C%22value%22%3A%22Johnny%22%7D%2C%7B%22id%22%3A%22dSRAe3hygqVwTpPK69p5td%22%2C%22condition%22%3A%22greater_than%22%2C%22value%22%3A%222024-01-01%22%7D%5D
```

## Param encoding

Here is an example of how the above filter param being formated. Make sure the param is not enclosed in a string
```
const testFilter = [
	{
		id: "bE2Bo4cGUv49cjnqZ4UnkW",
		condition: "equals",
		value: "Johnny",
	},
	{
		id: "dSRAe3hygqVwTpPK69p5td",
		condition: "greater_than",
		value: "2024-01-01"
	}
];
// stringify then encode the array to be added as the filter param.
const paramStringFilter = encodeURIComponent(JSON.stringify(testFilter));
```