const pool = require("../db/pool");
const { InvalidCredentialsErr, NotFoundErr } = require("../errors");

const getTeacherModules = async (req, res, next) => {
  try {
    const { modules } = req.session.user;

    const query = "SELECT * FROM modules WHERE id = ANY($1)";
    const getModules = await pool.query(query, [modules]);

    res.status(200).json({
      success: true,
      modules: getModules.rows,
      rowCount: getModules.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const getAllModules = async (req, res, next) => {
  try {
    const getModules = await pool.query("SELECT * FROM modules");
    res.status(200).json({
      success: true,
      modules: getModules.rows,
      rowCount: getModules.rowCount,
    });
  } catch (error) {
    next(error);
  }
};

const createModule = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new InvalidCredentialsErr("Please provide the module's name");
    }

    const moduleInDB = await pool.query(
      "SELECT * FROM modules WHERE name = $1",
      [name]
    );

    if (moduleInDB.rows[0]) {
      return res.status(400).json({
        success: false,
        message: `module with this name already exists`,
      });
    }

    const createModule = await pool.query(
      "INSERT INTO modules(name) VALUES($1)",
      [name]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateModule = async (req, res, next) => {
  try {
    try {
      const { id: moduleId } = req.params;
      const { name } = req.body;

      if (!name) {
        throw new InvalidCredentialsErr(
          "Please provide all the required fields"
        );
      }

      const moduleInDB = await pool.query(
        "SELECT id FROM modules WHERE id = $1",
        [moduleId]
      );

      if (!moduleInDB.rows[0]) {
        throw new NotFoundErr("Module doesn't exists");
      }

      const updateModule = await pool.query(
        "UPDATE modules SET name = $1 WHERE id = $2",
        [name, moduleId]
      );
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteModule = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllModules,
  getTeacherModules,
  createModule,
  deleteModule,
  updateModule,
};
