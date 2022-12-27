# HAPI Protobuf

> *This is an Experimental Project, the creators make no assertion of future 
> maintanance or support.  We suggest you do not use this package at this time, 
> but if you do, please bind to the **exact version** of the package as future 
> patch releases will **not** be backwards compatible until stability in design 
> and features is achieved.*

## [@bugbytes/hapi-proto](https://www.npmjs.com/package/@bugbytes/hapi-proto)  

This package provides typescript definitions for the entirety of the 
[Hedera API Protobuf](https://github.com/hashgraph/hedera-protobufs) specification.  
It is generated with the help of the 
[grpc_tools_node_protoc](https://www.npmjs.com/package/grpc_tools_node_protoc_ts) 
NPM package.  This package is intended to be consumed from the “use raw protobuf constructs” 
point of view.  It does not add any value-added classes or utilities.  If this is not an
approach that is desirable, please consider Hedera’s official JavaSscript SDK. In order to 
serialize structures to protobuf and back, this package has peer dependencies on ` protobufjs`, 
`long` and `rxjs` (if using any streaming API calls).
