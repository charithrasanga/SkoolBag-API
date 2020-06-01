var Joi = require("joi");
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

const create_schema = {
    id: Joi.allow(0),
    name: Joi.string().required().min(3),
    street: Joi.string().required().min(3),
    suburb: Joi.string().required().min(3),
    postcode: Joi.string().required().min(2),
    state: Joi.string().required().min(3),
    student_count: Joi.number().required().min(1),
};

const update_schema = {
    id: Joi.number().required().min(1),
    name: Joi.string().required().min(3),
    street: Joi.string().required().min(3),
    suburb: Joi.string().required().min(3),
    postcode: Joi.string().required().min(2),
    state: Joi.string().required().min(3),
    student_count: Joi.number().required().min(1),
};

let schoolData = [{
        id: 1,
        name: "Airds High School",
        street: "School Drive",
        suburb: "CAMPBELLTOWN",
        postcode: "2560",
        state: "NSW",
        student_count: 200,
        isDeleted: false,
    },
    {
        id: 2,
        name: "Ajuga School",
        street: "Summer Drive",
        suburb: "GLENFIELD",
        postcode: "2167",
        state: "NSW",
        student_count: 300,
        isDeleted: false,
    },
    {
        id: 3,
        name: "Albion Park Public School",
        street: "Albion Park Drive",
        suburb: "ALBION PARK",
        postcode: "2527",
        state: "NSW",
        student_count: 500,
        isDeleted: false,
    },
    {
        id: 4,
        name: "Mount Victoria Public School",
        street: "Main Street",
        suburb: "MOUNT VICTORIA",
        postcode: "2786",
        state: "NSW",
        student_count: 1578,
        isDeleted: false,
    },
    {
        id: 5,
        name: "Nepean Creative and Performing Arts High School",
        street: "North Drive",
        suburb: "EMU PLAINS",
        postcode: "2750",
        state: "NSW",
        student_count: 325,
        isDeleted: false,
    },
    {
        id: 6,
        name: "North Rocks Public School",
        street: "Green Vally Drive",
        suburb: "NORTH ROCKS",
        postcode: "2151",
        state: "NSW",
        student_count: 200,
        isDeleted: false,
    }

];

//Routes for CRUD operations

/**
 * @swagger
 * definitions:
 *   School:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       street:
 *         type: string
 *       suburb:
 *         type: string
 *       postcode:
 *         type: string
 *       state:
 *         type: string
 *       student_count:
 *         type: integer
 */

/**
 * @swagger
 * /api/schools:
 *   get:
 *     tags:
 *       - Schools
 *     description: Returns all schools
 *     produces:
 *       - application/json
 *     responses :
 *        200:
 *         description: An array of school objects
 *         schema:
 *           $ref: '#/definitions/School'
 */
router.get("/api/schools", (req, res) => {


    let activeSchools = schoolData.filter(function(e) {
        return e.isDeleted === false;
    });
    res.send(activeSchools);
});

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     tags:
 *       - Schools
 *     description: Returns a single school
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: School Id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single school
 *         schema:
 *           $ref: '#/definitions/School'
 */
router.get("/api/schools/:id", (req, res) => {
    let school = schoolData.find((x) => x.id === parseInt(req.params.id));
    if (!school) {
        res.status(404).send("School with ID:" + req.params.id + " was not found");
    } else {
        res.status(200).send(school);
    }
});

/**
 * @swagger
 * /api/schools:
 *   post:
 *     tags:
 *       - Schools
 *     description: Creates a shool
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: school
 *         description: School object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/School'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.post("/api/schools/", (req, res) => {
    // validate modal before processing data
    const result = Joi.validate(req.body, create_schema);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    const idArray = schoolData.map(x => x.id);
    const maxId = Math.max.apply(Math, idArray); // this approach avoid errors when data type not defined.

    const school = {
        id: maxId + 1,
        name: req.body.name,
        street: req.body.street,
        suburb: req.body.suburb,
        postcode: req.body.postcode,
        state: req.body.state,
        student_count: req.body.student_count,
        isDeleted: false,
    };

    schoolData.push(school);

    res.send(school);
});

/**
 * @swagger
 * /api/schools/:
 *   put:
 *     tags:
 *       - Schools
 *     description: Updates a single shool
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: school
 *         description: School object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/School'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put("/api/schools/", (req, res) => {
    const result = Joi.validate(req.body, update_schema);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    let school = schoolData.find((x) => x.id === parseInt(req.body.id));
    if (!school) {
        res.status(404).send("School with ID:" + req.boby.id + " was not found");
    } else {
        school.name = req.body.name;
        school.postcode = req.body.postcode;
        school.state = req.body.state;
        school.street = req.body.street;
        school.suburb = req.body.suburb;
        school.student_count = parseInt(req.body.student_count);
        school.isDeleted = false;

        res.status(200).send(school);
    }
});

/**
 * @swagger
 * /api/schools/{id}:
 *   delete:
 *     tags:
 *       - Schools
 *     description: Deletes a single school
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: school's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
router.delete("/api/schools/:id", (req, res) => {
    let school = schoolData.find((x) => x.id === parseInt(req.params.id));
    if (!school) {
        res.status(404).send("School with ID:" + req.boby.id + " was not found");
    } else {
        // schoolData.pop(school);
        school.isDeleted = true;
        res.status(200).send(true);
    }
});

module.exports = router;