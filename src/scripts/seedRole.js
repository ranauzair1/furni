const Role = require("../models/role");
const createRoles = async () => {
    const Roles = [
        {
            role: "Admin",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            role: "Manager",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            role: "Vendor",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            role: "Client",
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            role: "Worker",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    await Role.bulkCreate(Roles);
};
const seedDB = async () => {
    try {
        Promise.all
        await createRoles();
    } catch (error) {
        console.log("There is some error in seeding database", error);
    }
};

seedDB();