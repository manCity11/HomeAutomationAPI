import request from 'request';

const BASE_URL = "http://localhost:3000/";

const API_URL = {
    DEVICE: BASE_URL.concat("devices")
};

describe('Beginning of the tests', function() {
    describe('Routes tests', () => {
        it('/ route should be defined', () => {
            request(`${BASE_URL}`, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
            });
        });

        it('/devices route should be defined', () => {
            request(`${API_URL.DEVICE}`, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
            });
        });
    });

    describe('CRUD methods tests', () => {
        describe('READ Method tests', () => {
            it('should a status code equal to 200', () => {
                request(`${API_URL.DEVICE}?query={devices{id,name,pinNumber,isOn}}`, (error, response, body) => {
                    expect(response.statusCode).to.equal(200);
                });
            });
    
            it('should have a list of devices', () => {
                request(`${API_URL.DEVICE}?query={devices{id,name,pinNumber,isOn}}`, (error, response, body) => {
                    expect(body).to.be.an('array');
                });
            });
    
            it('device should have property id name pinNumber and isOn', () => {
                request(`${API_URL.DEVICE}?query={devices{id,name,pinNumber,isOn}}`, (error, response, body) => {
                    expect(body[0].id).to.be.defined();
                    expect(body[0].name).to.be.defined();
                    expect(body[0].pinNumber).to.be.defined();
                    expect(body[0].isOn).to.be.defined();
                });
            });
        });

        describe('CREATE Method tests', () => {
            it('should have a status code equal to 201', () => {
                const testDevice = {
                    name: 'Test device',
                    pinNumber: 16
                } 
                request(`${API_URL.DEVICE}?query=mutation{addDevice(name:${testDevice.name},:pinNumber${testDevice.pinNumber})}`, (error, response, body) => {
                    expect(response.statusCode).to.equal(201);
                    let device = body;

                    resquest(`${API_URL.DEVICE}?query={device(:id${deviceId}){id,name,pinNumber}}`, (error, response, body) => {
                        expect(response.statusCode).to.equal(200);
                        expect(body.name).to.equal(testDevice.name);
                        expect(body.pinNumber).to.equal(testDevice.pinNumber);
                    });
                });
            });
        });

        describe('UPDATE Method tests', () => {
            it('should have a status equal to 200 and different value', () => {
                
                //create device
                const testDevice = {
                    name: 'Test device',
                    pinNumber: 16
                } 
                request(`${API_URL.DEVICE}?query=mutation{addDevice(name:${testDevice.name},pinNumber:${testDevice.pinNumber})}`, (error, response, body) => {
                    let device = body;

                    resquest(`${API_URL.DEVICE}?query=mutation{editDevice(id:${device.id},name:"Dummy")}`, (error, response, body) => {
                        expect(response.statusCode).to.equal(200);
                        expect(body.name).to.equal("Dummy");
                        expect(body.pinNumber).to.equal(device.pinNumber);
                    });
                });
            });
        });

        describe('DELETE Method tests', () => {
            it('shoud have a status equal to 200 and remove the value', () => {
                //create device
                const testDevice = {
                    name: 'Test device',
                    pinNumber: 16
                } 
                request(`${API_URL.DEVICE}?query=mutation{addDevice(name:${testDevice.name},pinNumber:${testDevice.pinNumber})}`, (error, response, body) => {
                    let device = body;

                    resquest(`${API_URL.DEVICE}?query=mutation{deleteDevice(id:${device.id})}`, (error, response, body) => {
                        expect(response.statusCode).to.equal(200);
                        expect(body.length).to.equal(0);
                    });
                });
            });
        });
    });

    describe('deviceOnOff Method tests', () => {
        it('should have a status equal to 200 and switch on the device', () => {
            request(`${API_URL.DEVICE}?query=mutation{deviceOnOff(id:"1",pinNumber:3, isOn:true)}`, (error, response, body) => {
                let device = body;
                expect(response.statusCode).to.equal(200);
                expect(response.body.isOn).to.equal(true);
            });
        });

        it('should have a status equal to 200 and switch off the device', () => {
            request(`${API_URL.DEVICE}?query=mutation{deviceOnOff(id:"1",pinNumber:3, isOn:false)}`, (error, response, body) => {
                let device = body;
                expect(response.statusCode).to.equal(200);
                expect(response.body.isOn).to.equal(false);
            });
        });
    });
});