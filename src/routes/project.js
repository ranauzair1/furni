const { authJwt } = require("../middlewares/authJwt");

const { addProject, asigningProject, getAllPostComments, getAllclientprojects, creatPost, getUserAllPostComments, getAllmangerprojects, addComments, getAllvenderprojects, getAllworkerProjects, getAllProjectPosts } =
    require("../controllers").project;


module.exports = (router) => {
    router.route("/addProject").post(addProject);
    router.route("/asigningProject").post(asigningProject);
    router.route("/createPost").post(creatPost);
    router.route("/addComments").post(addComments);
    router.route("/getAllmangerprojects").get(getAllmangerprojects);
    router.route("/getAllworkerProjects").get(getAllworkerProjects);
    router.route("/getAllvenderprojects").get(getAllvenderprojects);
    router.route("/getAllclientprojects").get(getAllclientprojects);
    router.route("/getUserAllPostComments").get(getUserAllPostComments);
    router.route("/getAllPostComments").get(getAllPostComments);
    router.route("/getAllProjectPosts").post(getAllProjectPosts);
};
