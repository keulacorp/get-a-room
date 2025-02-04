import { Request, Response } from 'express';
import { TokenPayload } from 'google-auth-library';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DateTime } from 'luxon';

import { createToken, readToken, updateToken, writeToken } from './token';

import jwtTokenPayload from '../../types/jwtTokenPayload';
describe('token', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    const createMockToken = async (): Promise<string> => {
        await createToken()(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );
        return mockResponse?.locals?.token;
    };
    const testPayload: TokenPayload = {
        iss: 'https://accounts.google.com',
        sub: 'testSub',
        aud: 'testAud',
        iat: DateTime.now().toUTC().toSeconds(),
        exp: DateTime.now().plus({ minutes: 60 }).toUTC().toSeconds(),
        name: 'testName',
        email: 'test@email.com'
    };
    let testToken: string;

    beforeEach(async () => {
        jest.resetAllMocks();

        mockRequest = {};
        mockResponse = {
            locals: {
                oAuthClient: 'client',
                accessToken: 'token',
                refreshToken: 'rtoken'
            }
        };
        mockNext = jest.fn();
        process.env.HOSTED_DOMAIN = 'testDomain.com';
        process.env.JWT_SECRET = 'testSecret';
    });
    describe('createToken', () => {
        test('Should set JWT token to locals', async () => {
            if (mockResponse.locals) {
                mockResponse.locals.payload = testPayload;
            }

            await createToken()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.locals?.token).toBeTruthy();
            expect(mockNext).toHaveBeenCalledTimes(1);
            expect(mockNext).toHaveBeenCalledWith();
        });
    });

    describe('updateToken', () => {
        test('Should throw error when token could not be decoded', () => {
            expect(() => updateToken('incorrectJWT', 'token2')).toThrow(
                'Could not decode token'
            );
        });

        test('Should update the accessToken field of JWT', async () => {
            testToken = await createMockToken();

            const newJwt = updateToken(testToken, 'token2');
            const payload = jwt.verify(
                newJwt,
                process.env.JWT_SECRET as string
            ) as JwtPayload;

            expect(newJwt).toBeTruthy();
            expect(payload.accessToken).toEqual('token2');
        });
    });

    describe('readToken', () => {
        test('Should throw exception when invalid secret is given', () => {
            process.env.JWT_SECRET = 'incorrectSecret';
            expect(() => readToken(testToken)).toThrow('invalid signature');
        });

        test('Should return JWT payload', async () => {
            const testData = {
                ...mockResponse.locals,
                payload: {
                    sub: 'testSub',
                    name: 'testName',
                    email: 'test@email.com',
                    accessToken: 'token',
                    refreshToken: 'rtoken'
                }
            };
            mockResponse.locals = testData;
            testToken = await createMockToken();
            const decoded = readToken(testToken);

            expect(decoded.sub).toEqual('testSub');
            expect(decoded.name).toEqual('testName');
            expect(decoded.email).toEqual('test@email.com');
            expect(decoded.accessToken).toEqual('token');
            expect(decoded.refreshToken).toEqual('rtoken');
        });
    });

    describe('writeToken', () => {
        test('Should return signed JWT token', () => {
            const jwtPayload: jwtTokenPayload = {
                sub: testPayload.sub as string,
                name: testPayload.name as string,
                email: testPayload.email as string,
                accessToken: mockResponse.locals?.accessToken,
                refreshToken: mockResponse.locals?.refreshToken
            };

            const jwtToken = writeToken(jwtPayload);

            expect(jwtToken).toBeTruthy();
        });
    });
});
