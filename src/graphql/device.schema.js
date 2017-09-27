import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import axios from 'axios';

// API ENDPOINT
//
import API_URL from '../constants/urls';

// Define types
//
const DeviceType = new GraphQLObjectType({
    name: 'Device',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        pinNumber: {
            type: GraphQLInt,
        },
        isOn: {
            type: GraphQLBoolean
        }
    }) 
});

// Root query, base for all schema
//
const DeviceRootQuery = new GraphQLObjectType({
    name: 'DeviceRootQuery',
    fields: () => ({
        device: {
            type: DeviceType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios
                    .get(API_URL.concat(`/${args.id}`))
                    .then(response => response.data);
            },
            devices: {
                type: new GraphQLList(DeviceType),
                resolve(parentValue, args) {
                    return axios
                        .get(API_URL)
                        .then(response => response.data);
                }
            }
        }
    })
});

// Mutation
//
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDevice: {
            type: DeviceType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                pinNumber: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parentValue, args) {
                // TODO READ PIN NUMBER
                
                return axios
                    .post(API_URL, {
                        name: args.name,
                        pinNumber: args.pinNumber
                    })
                    .then(response => response.data);
            }
        },
        deleteDevice: {
            type: DeviceType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parentValue, args) {
                return axios
                    .delete(API_URL.concat(`/${args.id}`))
                    .then(response => response.data);
            }
        },
        editDevice: {
            type: DeviceType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                name: {
                    type: GraphQLString
                },
                pinNumber: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, args) {
                return axios
                    .patch(API_URL.concat(`/${args.id}`, args))
                    .then(response => response.data);
            }
        },
        deviceOnOff: {
            type: DeviceType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                isOn: {
                    type: new GraphQLNonNull(GraphQLBoolean)
                }
            },
            resolve(parentValue, args) {
                // Optimization check if the pin if valid
                if(args.isOn) {
                    //Switch the device on
                } else {
                    //Switch the device off
                }
                // return device type
            }
        }
    }
});

export default new GraphQLSchema({
    query: DeviceRootQuery,
    mutation: mutation
});