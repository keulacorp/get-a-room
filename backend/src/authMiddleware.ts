import express from 'express';
import { unless } from 'express-unless';
import { getOAuthClient } from './utils/oAuthClient';
import * as responses from './utils/responses';
import { readToken, updateToken } from './controllers/auth/token';

/**
 * Filter for unless
 * @param req Express request
 * @returns {boolean}
 */
export const authFilter = (req: express.Request) => {
    const path = req.path;
    const skipPaths = ['/api/auth', '/api/favicon.ico'];

    if (path === '/api') {
        return true;
    }

    if (skipPaths.some((v) => path.includes(v))) {
        return true;
    }

    return false;
};

/**
 * Parses access token from headers and refresh token from
 * httpOnly cookie and sets them to res.locals
 * @returns -
 */
export type ExpressMiddlewareWithUnless = {
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<express.Response | undefined>;
    unless: typeof unless;
};
export const parseToken = (): ExpressMiddlewareWithUnless => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { TOKEN } = req.cookies;

            if (!TOKEN) {
                return responses.invalidToken(req, res);
            }

            const payload = readToken(TOKEN);
            if (!payload.refreshToken) {
                console.warn(
                    'oAuth refresh token not found. Revoking access token',
                    payload
                );

                getOAuthClient()
                    .revokeToken(payload.accessToken)
                    .then(() => {
                        console.warn('Access token revoked', payload);
                    })
                    .catch((reason) => {
                        console.error('Error revoking access token', reason);
                    });

                return responses.invalidToken(req, res);
            }

            res.locals.token = TOKEN;
            res.locals.sub = payload.sub;
            res.locals.email = payload.email;
            res.locals.refreshToken = payload.refreshToken;
            res.locals.accessToken = payload.accessToken;

            next();
        } catch (err) {
            return responses.invalidToken(req, res);
        }
    };

    middleware.unless = unless;

    return middleware;
};

/**
 * Validate that the access token included in the authorization header is valid
 * if not, check for refresh token and if found try to refresh the access token
 * @param noAuthPaths Array of paths that don't require authentication
 * @returns -
 */
export const validateAccessToken = (): ExpressMiddlewareWithUnless => {
    const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const client = getOAuthClient();

            client.setCredentials({
                access_token: res.locals.accessToken,
                refresh_token: res.locals.refreshToken
            });

            const newToken = (await client.getAccessToken()).token;
            if (!newToken) {
                return responses.invalidToken(req, res);
            }

            // Token had expired
            if (res.locals.accessToken !== newToken) {
                res.locals.accessToken = newToken;
                const jwt = updateToken(res.locals.token, newToken as string);

                res.cookie('TOKEN', jwt, {
                    maxAge: 31556952000, // 1 year
                    httpOnly: true
                });

                client.setCredentials({
                    access_token: res.locals.accessToken,
                    refresh_token: res.locals.refreshToken
                });
            }

            res.locals.oAuthClient = client;
            next();
        } catch {
            return responses.invalidToken(req, res);
        }
    };

    middleware.unless = unless;

    return middleware;
};
