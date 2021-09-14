import "dotenv/config";

const serverConfig = {
    db_connection: process.env.DB_CONNECTION,
    blank_profile: "https://www.worldfuturecouncil.org/wp-content/uploads/2020/06/blank-profile-picture-973460_1280-1.png",
};

export default serverConfig;