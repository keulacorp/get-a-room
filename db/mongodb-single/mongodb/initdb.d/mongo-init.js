db.getSiblingDB('admin').auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD
);
db.createUser({
    user: 'getaroom',
    pwd: 'getaroom',
    roles: [
        {
            role: 'readWrite',
            db: 'getaroom'
        }
    ]
});
