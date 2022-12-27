# HAPI Utilities

> *This is an Experimental Project, the creators make no assertion of future 
> maintanance or support.  We suggest you do not use this package at this time, 
> but if you do, please bind to the **exact version** of the package as future 
> patch releases will **not** be backwards compatible until stability in design 
> and features is achieved.*

## [@bugbytes/hapi-util](https://www.npmjs.com/package/@bugbytes/hapi-util)  

This project contains helper functions to aid in the common tasks of converting well known 
string formats to HAPI protobuf objects and back again.  It also contains some basic logic 
for producing transaction signatures when provided private key values.  This package depends 
on the `@bugbytes/hapi-proto` package, and if utilizing the key validating and signing 
features: ` @noble/ed25519`, ` @noble/secp256k1` are also required.