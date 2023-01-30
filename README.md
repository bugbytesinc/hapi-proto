# Hedera API Typescript/Javascript Support Libraries

This is an Experimental Project exploring the possiblities of producing
a low level binding packages that aid in authoring other TS/JS projects
interacting with the Hedera API.

Creators make no assertion of future maintanance or support.  We suggest 
you do not use this package at this time, but if you do, please bind to the 
**exact version** of the package as future patch releases will **not** be 
backwards compatible until stability in design and features is achieved.

## NPM Packages produced by this source code repository:

* **PROTO** [@bugbytes/hapi-proto](./packages/hapi-proto/README.md)

  This project contains typescript definitions for the entirety of the 
  [Hedera API Protobuf](https://github.com/hashgraph/hedera-protobufs) specification.  
  It is generated with the help of the 
  [grpc_tools_node_protoc](https://www.npmjs.com/package/grpc_tools_node_protoc_ts) 
  NPM package.  This package is intended to be consumed from the “use raw protobuf constructs” 
  point of view.  It does not add any value-added classes or utilities.  If this is not an
  approach that is desirable, please consider Hedera’s official JavaSscript SDK. In order to 
  serialize structures to protobuf and back, this package has peer dependencies on ` protobufjs`, 
  `long` and `rxjs` (if using any streaming API calls).

* **UTIL** [@bugbytes/hapi-util](./packages/hapi-util/README.md)  

  This project contains helper functions to aid in the common tasks of converting well known 
  string formats to HAPI protobuf objects and back again.  It also contains some basic logic 
  for producing transaction signatures when provided private key values.  This package depends 
  on the `@bugbytes/hapi-proto` package, and if utilizing the key validating and signing 
  features: ` @noble/ed25519`, ` @noble/secp256k1` are also required.

* **MIRROR** [@bugbytes/hapi-mirror](./packages/hapi-mirror/README.md)

  This project provides a helper client for retrieving data from an Hedera Mirror Node.  
  The data structures exposed by this library are generated from the Hedera Mirror Node’s 
  OpenAPI data structure with the help of the 
  [openapi-typescript]( https://github.com/drwpow/openapi-typescript#readme) project.  
  This package depends on both the ` @bugbytes/hapi-proto` and `@bugbytes/hapi-util` as 
  well as an implementation of the **Fetch API** to intrinsically exist in the process environment.

* **CONNECT** [@bugbytes/hapi-connect](./packages/hapi-connect/README.md)  

  This project is an independent implementation of the server/website side of the 
  *HashConnect* protocol.  It can be leveraged to connect to wallets supporting the 
  *HashConnect* protocol.  The implementation requires the following peer dependencies:
  `@bugbytes/hapi-proto`, `@bugbytes/hapi-util`, `long`, `protobufjs`, `simple-crypto-js` 
  and `ts-typed-events`.

* **HASHPOOL** [@bugbytes/hapi-hashpool](./packages/hapi-hashpool/README.md)  

  This project provides a helper client for interacting with the experimental 
  Hashpool REST server, a REST front-end for submitting raw (possibly partially) signed 
  protobuf HAPI transactions which are then temporarily held in state and submitted to the 
  appropriate Hedera Gossip Node via native gRPC protocol at the proper submission time.  
  The implementation requires the following peer dependencies:  `@bugbytes/hapi-proto`, 
  `@bugbytes/hapi-util`, `long`, `protobufjs` as well as an implementation of the 
  **Fetch API** to intrinsically exist in the process environment.