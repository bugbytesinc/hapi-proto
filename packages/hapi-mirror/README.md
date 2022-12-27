# HAPI Mirror Client

> *This is an Experimental Project, the creators make no assertion of future 
> maintanance or support.  We suggest you do not use this package at this time, 
> but if you do, please bind to the **exact version** of the package as future 
> patch releases will **not** be backwards compatible until stability in design 
> and features is achieved.*

## [@bugbytes/hapi-mirror](https://www.npmjs.com/package/@bugbytes/hapi-mirror)  

This package provides a helper client for retrieving data from an Hedera Mirror Node.  
The data structures exposed by this library are generated from the Hedera Mirror Node’s 
OpenAPI data structure with the help of the 
[openapi-typescript]( https://github.com/drwpow/openapi-typescript#readme) project.  
This package depends on both the ` @bugbytes/hapi-proto` and `@bugbytes/hapi-util` as 
well as an implementation of the **Fetch API** to intrinsically exist in the process environment.
