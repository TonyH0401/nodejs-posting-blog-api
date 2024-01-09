- when to use params vs queryString: https://stackoverflow.com/a/31261026/14723731
    - TLDR: params is to get resource/resource, queryString is used for filtering
- https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
- https://dev.to/larswaechter/how-i-structure-my-rest-apis-11k4
- https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/
- utils are for generic and reuseable functions
- middlewares are for specific routes, involving more in requests and responses   
- https://stackoverflow.com/q/18875292/14723731, pass data through the next middlewares uses res.locals
- should add a "return" for the next(), I encoutered the "header returns twice" situation where there is a next() under the next(error)
because although the next(error) directs to the error middleware, the code continue to run to the next() below, and so it returns twice,
the same situation here https://stackoverflow.com/q/77589461/14723731 even though this has "return", the stack has a good answer but I 
will make a TLDR one, .catch() is async, while fetch was resolving, the data is still undefined and we send an error response, 
when the fetch is resolved and if there are any errors, we send another error response, this make the response twice
