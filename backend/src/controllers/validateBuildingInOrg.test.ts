import { Request, Response } from 'express';
import { mocked } from 'jest-mock';
import { getBuildings } from './buildingsController';
import { badRequest, internalServerError } from '../utils/responses';
import { validateBuildingInOrg } from './validateBuildingInOrg';

jest.mock('./buildingsController');
jest.mock('../utils/responses');

const mockedGetBuildings = mocked(getBuildings, { shallow: false });
const mockedBadRequest = mocked(badRequest, { shallow: false });
const mockedInternalServerError = mocked(internalServerError, {
    shallow: false
});

describe('buildingsController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    describe('validateBuildingInOrg', () => {
        beforeEach(() => {
            mockRequest = {
                query: {}
            };
            mockResponse = {
                locals: {
                    oAuthClient: 'client',
                    buildingId: 'test1'
                }
            };
            mockNext = jest.fn();

            jest.resetAllMocks();
        });

        test('Should call next if no building defined', async () => {
            delete mockResponse.locals?.buildingId;

            await validateBuildingInOrg()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedGetBuildings).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
        });

        test('Should return internal server error if no results', async () => {
            mockedGetBuildings.mockResolvedValueOnce([]);

            await validateBuildingInOrg()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedGetBuildings).toBeCalledTimes(1);
            expect(mockedInternalServerError).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalled();
        });

        test('Should return bad request if building not in results', async () => {
            mockedGetBuildings.mockResolvedValueOnce([
                {
                    id: 'test2',
                    name: 'First',
                    latitude: 61.4957056,
                    longitude: 23.7993984
                },
                {
                    id: 'test3',
                    name: 'Second',
                    latitude: 61.4957056,
                    longitude: 23.7993984
                }
            ]);

            await validateBuildingInOrg()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedGetBuildings).toBeCalledTimes(1);
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockNext).not.toBeCalled();
            expect(mockedBadRequest).toBeCalledTimes(1);
        });

        test('Should call next if building in list', async () => {
            mockedGetBuildings.mockResolvedValueOnce([
                {
                    id: 'test1',
                    name: 'First'
                },
                {
                    id: 'test2',
                    name: 'Second'
                }
            ]);

            await validateBuildingInOrg()(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockedGetBuildings).toBeCalledTimes(1);
            expect(mockedInternalServerError).not.toBeCalled();
            expect(mockedBadRequest).toBeCalledTimes(0);
            expect(mockNext).toBeCalledWith();
            expect(mockNext).toBeCalledTimes(1);
        });
    });
});
