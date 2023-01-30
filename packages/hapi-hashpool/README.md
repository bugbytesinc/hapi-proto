# HAPI Hashpool Client

> *This is an Experimental Project, the creators make no assertion of future 
> maintanance or support.  We suggest you do not use this package at this time, 
> but if you do, please bind to the **exact version** of the package as future 
> patch releases will **not** be backwards compatible until stability in design 
> and features is achieved.*

## [@bugbytes/hapi-hashpool](https://www.npmjs.com/package/@bugbytes/hapi-hashpool)  

This package provides a helper client for interacting with the experimental 
Hashpool REST server, a REST front-end for submitting raw (possibly partially) signed 
protobuf HAPI transactions which are then temporarily held in state and submitted to the 
appropriate Hedera Gossip Node via native gRPC protocol at the proper submission time.  
The implementation requires the following peer dependencies:  `@bugbytes/hapi-proto`, 
`@bugbytes/hapi-util`, `long`, `protobufjs` as well as an implementation of the 
**Fetch API** to intrinsically exist in the process environment.