const { authJwt } = require("../middlewares/authJwt");

const { addProject, asigningProject, getAllclientprojects, getAllmangerprojects, getAllvenderprojects, getAllworkerProjects } =
    require("../controllers").project;


module.exports = (router) => {
    router.route("/addProject").post(addProject);
    router.route("/asigningProject").post(asigningProject);
    router.route("/getAllmangerprojects").get(getAllmangerprojects);
    router.route("/getAllworkerProjects").get(getAllworkerProjects);
    router.route("/getAllvenderprojects").get(getAllvenderprojects);
    router.route("/getAllclientprojects").get(getAllclientprojects);
};
