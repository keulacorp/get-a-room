/**
 * @vitest-environment happy-dom
 */

const valueMock = vi.fn();

vi.mock('./getARoomEnv', () => {
    return {
        default: () => {
            valueMock.mockImplementationOnce(() => 'VITE_REACT_APP_SERVER_KEY');
            return {
                VITE_REACT_APP_SERVER_KEY: valueMock()
            };
        }
    };
});

import { checkEnvVariables } from './checkEnvVariables';

describe('checkEnvVariables', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('Should fail without application server key', () => {
        valueMock.mockImplementationOnce(() => undefined);

        expect(() => {
            checkEnvVariables();
        }).toThrowError('Application server key not set');
    });

    test('Should fail with empty application server key', () => {
        valueMock.mockImplementationOnce(() => '');
        expect(() => {
            checkEnvVariables();
        }).toThrowError('Application server key not set');
    });
});
