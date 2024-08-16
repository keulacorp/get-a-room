import webpush from 'web-push';

export const getDatabaseUrl = () => {
    const { DB_USER, DB_NAME, DB_PASSWORD, DB_URL, DB_OVERRIDE_URL } =
        process.env;
    const databaseUrl = createDatabaseUrl(
        DB_USER,
        DB_NAME,
        DB_PASSWORD,
        DB_URL,
        DB_OVERRIDE_URL
    );
    console.log(`Connecting to database: ${databaseUrl}`);
    return databaseUrl;
};

export const createDatabaseUrl = (
    dbUser?: string,
    dbName?: string,
    dbPassword?: string,
    dbUrl?: string,
    dbOverrideUrl?: string
) => {
    if (!dbUser) {
        throw new Error('Database user not defined');
    }
    if (!dbPassword) {
        throw new Error('Database password not defined');
    }
    if (!dbUrl) {
        throw new Error('Database url not defined');
    }
    if (!dbName) {
        throw new Error('Database name not defined');
    }

    if (dbOverrideUrl && dbOverrideUrl !== '') {
        return dbOverrideUrl;
    }
    return `mongodb+srv://${dbUser}:${dbPassword}@${dbUrl}/${dbName}?retryWrites=true&w=majority`;
};

export const setupVapidDetails = () => {
    const publicKey = process.env.VAPID_PUBLIC_KEY as string;
    const privateKey = process.env.VAPID_PRIVATE_KEY as string;
    webpush.setVapidDetails('mailto:test@test.com', publicKey, privateKey);
};
