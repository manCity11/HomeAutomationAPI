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
                    .get(`${API_URL.DEVICE}/${args.id}`)
                    .then(response => {
                        let returnDevice = response.data;
                        // emulate pin operation
                        returnDevice.isOn = Math.floor(Math.random() * 1) === 1;

                        return returnDevice;
                    });
            }
        },
        devices: {
            type: new GraphQLList(DeviceType),
            resolve(parentValue, args) {
                return axios
                    .get(`${API_URL.DEVICE}`)
                    .then(response => {
                        let listDevices = response.data;

                        return listDevices.map(device => {
                            // emulate pin operation
                            device.isOn = Math.floor(Math.random() * 1) === 1;

                            return device;
                        });
                    });
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
                return axios
                    .post(`${API_URL.DEVICE}`, {
                        name: args.name,
                        pinNumber: args.pinNumber
                    })
                    .then(response => {
                        let newDevice = response.data;
                        // emulate pin operation
                        newDevice.isOn = Math.floor(Math.random() * 1) === 1;

                        return newDevice;
                    });
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
                    .delete(`${API_URL.DEVICE}/${args.id}`)
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
                    .patch(`${API_URL.DEVICE}/${args.id}`, args)
                    .then(response => {
                        let modifiedDevice = response.data;
                        // emulate pin operation
                        modifiedDevice.isOn = Math.floor(Math.random() * 1) === 1;

                        return modifiedDevice;
                    });
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
                    return axios
                        .get(`${API_URL.DEVICE}/${args.id}`)
                        .then(response => {
                            let returnDevice = response.data;
                            // emulate pin operation
                            returnDevice.isOn = true;

                            return returnDevice;
                        });
                } else {
                    //Switch the device off
                    return axios
                    .get(`${API_URL.DEVICE}/${args.id}`)
                    .then(response => {
                        let returnDevice = response.data;
                        // emulate pin operation
                        returnDevice.isOn = false;

                        return returnDevice;
                    });
                }
            }
        }
    }
});

export default new GraphQLSchema({
    query: DeviceRootQuery,
    mutation: mutation
});