import express from 'express';
import cors from 'cors';
import { loadSequelize } from './sequelize/index.mjs';

const port = process.env.PORT || 80;
const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sequelize;
let UserModel;

app.get('/users', (req, res) => {
  UserModel.findAll().then((users) => {
    res.json(users);
  });
});

app.get('/users/:id', (req, res) => {
  UserModel.findByPk(req.params.id).then((user) => {
    res.json(user);
  });
});

app.post('/users', async (req, res) => {
  const user = await UserModel.create(req.body);
  res.json(user);
});

app.put('/users/:id', (req, res) => {
  UserModel.update(req.body, { where: { id: req.params.id } }).then(() => {
    res.json({ success: true });
  });
});

app.delete('/users/:id', (req, res) => {
  UserModel.destroy({ where: { id: req.params.id } }).then(() => {
    res.json({ success: true });
  });
});

app.listen(port, async () => {
  const isLocal = process.argv[2] == 'local' ? true : false;

  sequelize = await loadSequelize(process.env.DB_PARAMETER_NAME, isLocal);
  await sequelize.authenticate();
  UserModel = sequelize.models.User;
  console.log(`listening on port ${port}`);
});
