const valueMock = jest.fn();

const envMock = jest.mock('util/getARoomEnv', () => () => {
    valueMock.mockImplementationOnce(() => 'VITE_REACT_APP_SERVER_KEY');
    return {
        VITE_REACT_APP_SERVER_KEY: valueMock()
    };
});

import { checkEnvVariables } from './checkEnvVariables';

describe('checkEnvVariables', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Should fail without application server key', () => {
        valueMock.mockImplementationOnce(() => undefined);

        expect(() => {
            checkEnvVariables();
        }).toThrow('Application server key not set');
    });

    test('Should fail with empty application server key', () => {
        valueMock.mockImplementationOnce(() => '');
        expect(() => {
            checkEnvVariables();
        }).toThrow('Application server key not set');
    });
});
